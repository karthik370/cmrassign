import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { validateFontBuffer } from '@/lib/font-validator'
import formidable from 'formidable'
import { promises as fs } from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
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

    if (!file || !name) {
      return NextResponse.json(
        { success: false, error: 'File and name are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate font file
    const validation = validateFontBuffer(buffer)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const uploadResult: any = await uploadToCloudinary(
      buffer,
      'fonts',
      'raw'
    )

    // Save to database
    console.log('Inserting font for user:', user.id, user.email)
    const { data: font, error: dbError } = await supabaseAdmin
      .from('fonts')
      .insert({
        user_id: user.id,
        name: name,
        font_file_url: uploadResult.secure_url,
        font_file_size: buffer.length,
        font_format: validation.format || 'ttf',
        status: 'active',
        is_validated: true,
      } as any)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to save font' },
        { status: 500 }
      )
    }

    console.log('Font saved successfully:', (font as any)?.id, 'for user:', user.id)

    // Log usage
    await supabaseAdmin.from('usage_logs').insert({
      user_id: user.id,
      action: 'font_uploaded',
      metadata: { font_id: (font as any)?.id, font_name: name },
    } as any)

    return NextResponse.json({
      success: true,
      font,
    })
  } catch (error: any) {
    console.error('Font upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
