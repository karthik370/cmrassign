import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No authorization header' },
        { status: 401 }
      )
    }
    
    // Extract token from Bearer token
    const token = authHeader.replace('Bearer ', '')
    
    // Verify user with token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch fonts for the authenticated user (using admin client to bypass RLS)
    console.log('Fetching fonts for user:', user.id, user.email)
    const { data: fonts, error } = await supabaseAdmin
      .from('fonts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    console.log('Fonts found:', fonts?.length || 0, 'Error:', error)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch fonts' },
        { status: 500 }
      )
    }

    return NextResponse.json(fonts)
  } catch (error: any) {
    console.error('Get fonts error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
