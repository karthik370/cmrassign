import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { generatePDFWithHandwriting } from '@/lib/pdf-generator'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
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

    // Get project with font
    const { data: project, error: projectError } = await (supabaseAdmin as any)
      .from('projects')
      .select('*, fonts(*)')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get all page edits
    const { data: pageEdits, error: pageEditsError } = await (supabaseAdmin as any)
      .from('page_edits')
      .select('*')
      .eq('project_id', params.projectId)
      .order('page_number', { ascending: true })

    if (pageEditsError || !pageEdits) {
      console.error('❌ Failed to fetch page edits:', pageEditsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch page edits' },
        { status: 500 }
      )
    }

    console.log(`📄 Found ${pageEdits.length} page edits to process`)

    // Update project status
    await (supabaseAdmin as any)
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', params.projectId)

    // Get fontUrl from request body (if provided) or use project default
    const body = await request.json().catch(() => ({}))
    const customFontUrl = body.fontUrl
    
    // Generate PDF
    let pdfBytes
    try {
      const originalPdfUrl = (project as any).original_pdf_url
      const fontUrl = customFontUrl || (project as any).fonts.font_file_url
      
      console.log('📄 PDF generation inputs:')
      console.log(`  Original PDF: ${originalPdfUrl}`)
      console.log(`  Font URL: ${fontUrl}`)
      console.log(`  Custom font provided: ${!!customFontUrl}`)
      console.log(`  Font name: ${(project as any).fonts.name}`)
      console.log(`  Pages to process: ${pageEdits.length}`)
      
      pdfBytes = await generatePDFWithHandwriting(
        originalPdfUrl,
        fontUrl,
        pageEdits
      )
    } catch (error) {
      console.error('❌ PDF generation error:', error)
      await (supabaseAdmin as any)
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', params.projectId)

      return NextResponse.json(
        { success: false, error: 'Failed to generate PDF' },
        { status: 500 }
      )
    }

    // Upload to Cloudinary
    const uploadResult: any = await uploadToCloudinary(
      Buffer.from(pdfBytes),
      'processed_pdfs',
      'raw'
    )

    // Update project with processed PDF URL
    const { error: updateError } = await (supabaseAdmin as any)
      .from('projects')
      .update({
        processed_pdf_url: uploadResult.secure_url,
        status: 'completed',
      })
      .eq('id', params.projectId)

    if (updateError) {
      console.error('Update project error:', updateError)
    }

    // Log usage
    await (supabaseAdmin as any).from('usage_logs').insert({
      user_id: user.id,
      action: 'pdf_downloaded',
      metadata: { project_id: params.projectId },
    } as any)

    console.log('✅ PDF generation completed successfully')
    console.log('📥 Download URL:', uploadResult.secure_url)
    
    return NextResponse.json({
      success: true,
      downloadUrl: uploadResult.secure_url,
      message: 'PDF generated successfully'
    })
  } catch (error: any) {
    console.error('Generate PDF error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'PDF generation failed' },
      { status: 500 }
    )
  }
}
