import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET(
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

    const { data: font, error } = await supabaseAdmin
      .from('fonts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !font) {
      return NextResponse.json(
        { success: false, error: 'Font not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, font })
  } catch (error: any) {
    console.error('Get font error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

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

    // Get font details
    const { data: font, error: fetchError } = await supabaseAdmin
      .from('fonts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !font) {
      return NextResponse.json(
        { success: false, error: 'Font not found' },
        { status: 404 }
      )
    }

    // Check if font is used in any projects
    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('font_id', params.id)
      .limit(1)

    if (projects && projects.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete font that is used in projects',
        },
        { status: 400 }
      )
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('fonts')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete font' },
        { status: 500 }
      )
    }

    // Delete from Cloudinary (optional, can be done async)
    try {
      const publicId = (font as any).font_file_url.split('/').slice(-2).join('/')
      await deleteFromCloudinary(publicId)
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete font error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const { data: font, error } = await (supabaseAdmin as any)
      .from('fonts')
      .update({ name })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to update font' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, font })
  } catch (error: any) {
    console.error('Update font error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
