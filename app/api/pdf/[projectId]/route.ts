import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(
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

    if (pageEditsError) {
      console.error('Page edits error:', pageEditsError)
    }

    return NextResponse.json({
      success: true,
      project,
      font: (project as any).fonts,
      pageEdits: pageEdits || [],
    })
  } catch (error: any) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
