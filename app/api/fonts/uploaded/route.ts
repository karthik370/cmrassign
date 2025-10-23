import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get authorization from header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      console.log('⚠️ No auth header - returning empty fonts')
      return NextResponse.json({ fonts: [] })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      console.log('⚠️ Auth error or no user:', authError?.message)
      return NextResponse.json({ fonts: [] })
    }

    console.log(`📤 Fetching uploaded fonts for user: ${user.email}`)

    // Fetch user's uploaded fonts
    const { data: fonts, error } = await supabaseAdmin
      .from('fonts')
      .select('id, name, font_file_url, font_format, created_at, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching uploaded fonts:', error)
      return NextResponse.json({ fonts: [] })
    }

    console.log(`✅ Found ${fonts?.length || 0} uploaded fonts`)
    fonts?.forEach((f: any) => console.log(`  - ${f.name} (${f.id})`))

    // Format fonts for the font selector
    const formattedFonts = (fonts || []).map((font: any) => ({
      id: font.id,
      name: font.name,
      url: font.font_file_url,
      type: 'uploaded',
      format: font.font_format
    }))

    return NextResponse.json({ fonts: formattedFonts })
  } catch (error) {
    console.error('❌ Error in uploaded fonts API:', error)
    return NextResponse.json({ fonts: [] })
  }
}
