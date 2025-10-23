import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { analyzePDF, generateTextLines } from '@/lib/pdf-analyzer'

const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_PAGE_COUNT = 12
const MAX_PROJECTS_PER_USER = 5

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user profile exists
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      // Create profile if it doesn't exist
      await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        } as any)
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const fontId = formData.get('font_id') as string

    if (!file || !name || !fontId) {
      return NextResponse.json(
        { success: false, error: 'File, name, and font_id are required' },
        { status: 400 }
      )
    }

    // Validate PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Please upload a PDF file' },
        { status: 400 }
      )
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { success: false, error: 'PDF file is too large. Maximum size is 50MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult: any = await uploadToCloudinary(
      buffer,
      'pdfs',
      'raw'
    )

    // Analyze PDF
    let analysis
    try {
      console.log('📄 Starting PDF analysis for:', uploadResult.secure_url)
      analysis = await analyzePDF(uploadResult.secure_url)
      console.log(`✅ PDF analyzed successfully: ${analysis.pageCount} pages`)
    } catch (error) {
      console.error('❌ PDF analysis error:', error)
      // Continue with default metadata
      analysis = {
        pageCount: 1,
        pages: [{ pageNumber: 1, width: 612, height: 792, rotation: 0, textAreas: [], lines: [] }],
      }
      console.log('⚠️ Using default metadata: 1 page')
    }

    if (analysis.pageCount > MAX_PAGE_COUNT) {
      return NextResponse.json(
        {
          success: false,
          error: `PDF has too many pages. Maximum is ${MAX_PAGE_COUNT} pages.`,
        },
        { status: 400 }
      )
    }

    // Check project limit (5 projects max for all users)
    const { count: projectCount } = await (supabaseAdmin as any)
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (projectCount !== null && projectCount >= MAX_PROJECTS_PER_USER) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum project limit reached. You can only create ${MAX_PROJECTS_PER_USER} projects.`,
          limitReached: true,
        },
        { status: 403 }
      )
    }

    // Create project
    console.log(`📝 Creating project with ${analysis.pageCount} pages`)
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: user.id,
        font_id: fontId,
        name: name,
        original_pdf_url: uploadResult.secure_url,
        page_count: analysis.pageCount,
        pdf_metadata: analysis,
        status: 'draft',
      } as any)
      .select()
      .single()

    if (projectError) {
      console.error('❌ Database error:', projectError)
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      )
    }

    console.log(`✅ Project created successfully:`, {
      id: (project as any).id,
      name: (project as any).name,
      page_count: (project as any).page_count
    })

    // Create page edits for each page
    console.log(`📄 Creating page edits for ${analysis.pageCount} pages`)
    const pageEdits = []
    for (let i = 1; i <= analysis.pageCount; i++) {
      const pageData = analysis.pages[i - 1]
      const textLines = generateTextLines(
        pageData?.width || 612,
        pageData?.height || 792
      )

      pageEdits.push({
        project_id: (project as any).id,
        page_number: i,
        text_content: textLines.map((line) => ({
          id: line.id,
          text: '',
          x: line.x,
          y: line.y,
          width: line.width,
          height: line.height,
          fontSize: 12,
          color: 'black',
        })),
        detected_areas: { lines: textLines },
        ink_color: 'black',
      })
    }

    console.log(`✅ Inserting ${pageEdits.length} page edits`)
    const { error: pageEditsError } = await supabaseAdmin
      .from('page_edits')
      .insert(pageEdits as any)

    if (pageEditsError) {
      console.error('❌ Page edits error:', pageEditsError)
    } else {
      console.log(`✅ All page edits created successfully`)
    }

    // Log usage
    await supabaseAdmin.from('usage_logs').insert({
      user_id: user.id,
      action: 'pdf_uploaded',
      metadata: { project_id: (project as any).id, page_count: analysis.pageCount },
    } as any)

    return NextResponse.json({
      success: true,
      project: {
        id: (project as any).id,
        name: (project as any).name,
        page_count: analysis.pageCount,
        metadata: analysis,
      },
    })
  } catch (error: any) {
    console.error('PDF upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
