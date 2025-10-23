import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const fontsDir = path.join(process.cwd(), 'fonts')
    
    // Check if fonts directory exists
    if (!fs.existsSync(fontsDir)) {
      return NextResponse.json({ fonts: [] })
    }

    // Read all font files
    const files = fs.readdirSync(fontsDir)
    const fontFiles = files.filter(file => 
      file.endsWith('.ttf') || file.endsWith('.otf')
    )

    // Create font metadata
    const fonts = fontFiles.map((file, index) => {
      const name = file.replace(/\.(ttf|otf)$/, '').replace(/[-_]/g, ' ')
      const stats = fs.statSync(path.join(fontsDir, file))
      
      return {
        id: `local-${index}`,
        name: name,
        fileName: file,
        fileSize: stats.size,
        type: file.endsWith('.otf') ? 'otf' : 'ttf',
        url: `/api/fonts/local/${encodeURIComponent(file)}`,
        isLocal: true,
      }
    })

    return NextResponse.json({ fonts })
  } catch (error) {
    console.error('Error loading local fonts:', error)
    return NextResponse.json({ error: 'Failed to load fonts' }, { status: 500 })
  }
}
