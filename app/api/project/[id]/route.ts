import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Get project details
    const { data: project, error: fetchError } = await (supabaseAdmin as any)
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete page edits (cascade should handle this, but being explicit)
    await (supabaseAdmin as any).from('page_edits').delete().eq('project_id', params.id)

    // Delete project from database
    const { error: deleteError } = await (supabaseAdmin as any)
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    // Delete PDFs from Cloudinary (optional, can be done async)
    try {
      if ((project as any).original_pdf_url) {
        const publicId = (project as any).original_pdf_url.split('/').slice(-2).join('/')
        await deleteFromCloudinary(publicId)
      }
      if ((project as any).processed_pdf_url) {
        const publicId = (project as any).processed_pdf_url.split('/').slice(-2).join('/')
        await deleteFromCloudinary(publicId)
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
