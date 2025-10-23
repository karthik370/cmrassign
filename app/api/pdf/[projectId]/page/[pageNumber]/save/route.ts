import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; pageNumber: string } }
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

    // Verify project ownership
    const { data: project } = await (supabaseAdmin as any)
      .from('projects')
      .select('id')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { text_content, ink_color, line_colors, dimensions, drawing_data } = body

    // Upsert page edit
    const { data: pageEdit, error } = await (supabaseAdmin as any)
      .from('page_edits')
      .upsert(
        {
          project_id: params.projectId,
          page_number: parseInt(params.pageNumber),
          text_content,
          ink_color: ink_color || 'black',
          line_colors: line_colors || {},
          dimensions: dimensions || {},
          drawing_data: drawing_data || [],
          updated_at: new Date().toISOString(),
        } as any,
        {
          onConflict: 'project_id,page_number',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Save page error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save page' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, pageEdit })
  } catch (error: any) {
    console.error('Save page error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
