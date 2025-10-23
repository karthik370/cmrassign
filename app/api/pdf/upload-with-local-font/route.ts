import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { analyzePDF } from '@/lib/pdf-analyzer'

const MAX_PROJECTS_PER_USER = 5

export async function POST(request: NextRequest) {
  try {
    // Get authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check project limit (5 projects max for all users)
    const { count: projectCount } = await (supabaseAdmin as any)
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (projectCount !== null && projectCount >= MAX_PROJECTS_PER_USER) {
      return NextResponse.json({ 
        error: `Maximum project limit reached. You can only create ${MAX_PROJECTS_PER_USER} projects.`,
        limitReached: true 
      }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File
    const projectName = formData.get('name') as string
    const fontUrl = formData.get('fontUrl') as string
    const fontName = formData.get('fontName') as string
    const fontFileName = formData.get('fontFileName') as string

    if (!pdfFile || !projectName || !fontUrl || !fontName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('📦 Uploading PDF with local font:', { projectName, fontName, fontFileName })

    // Convert File to Buffer
    const arrayBuffer = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload PDF to Cloudinary first
    console.log('☁️  Uploading PDF to Cloudinary...')
    const pdfUpload: any = await uploadToCloudinary(buffer, 'original_pdfs', 'raw')
    console.log('✅ PDF uploaded:', pdfUpload.secure_url)

    // Analyze PDF using the uploaded URL
    console.log('📄 Analyzing PDF...')
    const pdfInfo = await analyzePDF(pdfUpload.secure_url)
    console.log(`✅ PDF analyzed: ${pdfInfo.pageCount} pages`)

    // Create or get font record
    let fontRecord = await (supabaseAdmin as any)
      .from('fonts')
      .select('*')
      .eq('user_id', user.id)
      .eq('name', fontName)
      .single()

    let fontId: string

    if (!fontRecord.data) {
      // Font doesn't exist, create it
      console.log('🔤 Creating font record for:', fontName)
      const fontInsert = await (supabaseAdmin as any)
        .from('fonts')
        .insert({
          user_id: user.id,
          name: fontName,
          font_file_url: fontUrl, // Use local API endpoint
          font_file_size: 0, // Local fonts don't need size tracking
          font_format: fontFileName.endsWith('.otf') ? 'otf' : 'ttf',
          status: 'local', // Mark as 'local' not 'active' so it doesn't appear in uploaded fonts
          is_validated: true,
        })
        .select()
        .single()

      if (fontInsert.error || !fontInsert.data) {
        console.error('❌ Failed to create font:', fontInsert.error)
        throw new Error('Failed to create font record')
      }

      fontId = fontInsert.data.id
      console.log('✅ Font created:', fontId)
    } else {
      fontId = fontRecord.data.id
      console.log('✅ Font found:', fontId)
    }

    // Create project
    console.log('📝 Creating project...')
    const { data: project, error: projectError } = await (supabaseAdmin as any)
      .from('projects')
      .insert({
        user_id: user.id,
        name: projectName,
        font_id: fontId,
        original_pdf_url: pdfUpload.secure_url,
        page_count: pdfInfo.pageCount,
        status: 'draft',
      })
      .select()
      .single()

    if (projectError) {
      console.error('❌ Failed to create project:', projectError)
      throw new Error('Failed to create project')
    }

    console.log('✅ Project created:', project.id)

    // Create empty page edits for each page
    const pageEdits = Array.from({ length: pdfInfo.pageCount }, (_, i) => ({
      project_id: project.id,
      page_number: i + 1,
      text_content: [{ id: 'main', text: '', x: 0, y: 0, width: 0, height: 0, fontSize: 24, color: 'black' }],
      detected_areas: null,
      ink_color: 'black',
    }))

    await (supabaseAdmin as any).from('page_edits').insert(pageEdits)

    return NextResponse.json({
      success: true,
      projectId: project.id,
      message: 'Project created successfully',
    })

  } catch (error: any) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload' },
      { status: 500 }
    )
  }
}
