import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename)
    const fontPath = path.join(process.cwd(), 'fonts', filename)

    // Security check - prevent directory traversal
    const normalizedPath = path.normalize(fontPath)
    const fontsDir = path.join(process.cwd(), 'fonts')
    if (!normalizedPath.startsWith(fontsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Check if file exists
    if (!fs.existsSync(fontPath)) {
      return NextResponse.json({ error: 'Font not found' }, { status: 404 })
    }

    // Read the font file
    const fontBuffer = fs.readFileSync(fontPath)
    
    // Determine content type
    const contentType = filename.endsWith('.otf') 
      ? 'font/otf' 
      : 'font/ttf'

    // Return font file with appropriate headers
    return new NextResponse(fontBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error serving font:', error)
    return NextResponse.json({ error: 'Failed to load font' }, { status: 500 })
  }
}
