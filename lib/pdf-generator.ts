import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { PageEdit } from '@/types/project'

export const generatePDFWithHandwriting = async (
  originalPdfUrl: string,
  fontUrl: string,
  pageEdits: PageEdit[]
): Promise<Uint8Array> => {
  try {
    // Load original PDF
    const existingPdfBytes = await fetch(originalPdfUrl).then((res) =>
      res.arrayBuffer()
    )
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Register fontkit for custom font support
    pdfDoc.registerFontkit(fontkit)

    // Load and embed custom font
    console.log('📥 Fetching custom font from:', fontUrl)
    
    // Convert relative URL to absolute URL for server-side fetch
    const absoluteFontUrl = fontUrl.startsWith('http') 
      ? fontUrl 
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${fontUrl}`
    
    console.log('📥 Absolute font URL:', absoluteFontUrl)
    const fontResponse = await fetch(absoluteFontUrl)
    
    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font: ${fontResponse.status}`)
    }
    
    const fontBytes = await fontResponse.arrayBuffer()
    console.log(`✅ Font loaded: ${fontBytes.byteLength} bytes`)
    
    // Embed font WITHOUT subsetting to ensure all characters work
    const customFont = await pdfDoc.embedFont(fontBytes)
    console.log('✅ Custom font embedded successfully')
    console.log('  Font name:', customFont.name)
    
    // Test font rendering with a sample character
    try {
      const testWidth = customFont.widthOfTextAtSize('Test', 24)
      console.log(`  Font test: "Test" at 24pt = ${testWidth}px width - ✅ Font is renderable`)
    } catch (fontTestError) {
      console.error('  ❌ Font rendering test FAILED:', fontTestError)
      throw new Error('Custom font cannot render text - font file may be corrupted')
    }

    // Helper function: Wrap text to lines using character count (matches preview)
    const wrapTextToLines = (text: string, maxWidth: number, fontSize: number): string[] => {
      if (!text) return ['']
      
      // Calculate max chars per line using same formula as preview (0.6 multiplier)
      const avgCharWidth = fontSize * 0.6
      const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth)
      
      const manualParagraphs = text.split('\n')
      const wrappedLines: string[] = []

      manualParagraphs.forEach((paragraph) => {
        if (paragraph.length === 0) {
          wrappedLines.push('') // Preserve empty lines
          return
        }

        const words = paragraph.split(/(\s+)/) // Preserve spaces
        let currentLine = ''

        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          if (word.length === 0) continue
          
          const testLine = currentLine + word
          
          if (testLine.length > maxCharsPerLine) {
            if (currentLine.length > 0) {
              wrappedLines.push(currentLine.trimEnd())
              currentLine = word.trimStart()
            } else {
              // Word is too long, need to break it
              let remaining = word
              while (remaining.length > maxCharsPerLine) {
                wrappedLines.push(remaining.substring(0, maxCharsPerLine))
                remaining = remaining.substring(maxCharsPerLine)
              }
              currentLine = remaining
            }
          } else {
            currentLine = testLine
          }
        }

        if (currentLine.length > 0) {
          wrappedLines.push(currentLine.trimEnd())
        }
      })

      return wrappedLines.length > 0 ? wrappedLines : ['']
    }

    console.log(`📝 Processing ${pageEdits.length} pages for PDF generation`)
    
    // Process each page
    for (const pageEdit of pageEdits) {
      // Get text content - debug the structure
      console.log(`\n📄 Page ${pageEdit.page_number} data:`)
      console.log(`  text_content type:`, typeof pageEdit.text_content)
      console.log(`  text_content:`, JSON.stringify(pageEdit.text_content).substring(0, 200))
      
      const textContent = pageEdit.text_content?.[0]?.text || ''
      
      if (!textContent || textContent.trim() === '') {
        console.log(`⏭️  Skipping page ${pageEdit.page_number} - no text content`)
        continue
      }

      console.log(`✍️  Processing page ${pageEdit.page_number} - ${textContent.length} chars`)
      console.log(`  Preview: "${textContent.substring(0, 100)}..."`)
      
      const page = pdfDoc.getPage(pageEdit.page_number - 1)
      const { height: pageHeight, width: pageWidth } = page.getSize()
      
      // Text positioning settings (use saved page-specific dimensions or defaults)
      const dimensions = pageEdit.dimensions || {
        lineBoxHeight: 30.5,
        lineSpacing: 24.6,
        marginLeft: 40,
        marginRight: -220,
        marginTop: 93,
      }
      
      // Log only if using defaults (indicates dimension not saved)
      if (!pageEdit.dimensions) {
        console.log(`  ⚠️  WARNING: Page ${pageEdit.page_number} using DEFAULT dimensions (not saved in DB!)`)
      }
      
      const fontSize = pageEdit.text_content?.[0]?.fontSize || 24
      const letterSpacing = pageEdit.text_content?.[0]?.letterSpacing || 0
      const lineSpacing = dimensions.lineSpacing
      const marginLeft = dimensions.marginLeft
      const marginRight = dimensions.marginRight
      const marginTop = dimensions.marginTop
      const lineBoxHeight = dimensions.lineBoxHeight
      
      // Calculate available width
      const availableWidth = pageWidth - marginLeft - marginRight
      console.log(`  📏 Page ${pageEdit.page_number} wrapping calc:`)
      console.log(`     pageWidth=${pageWidth}, marginLeft=${marginLeft}, marginRight=${marginRight}`)
      console.log(`     availableWidth=${availableWidth}px`)
      
      // Calculate max lines per page
      const maxLinesPerPage = Math.floor((pageHeight - marginTop - 80) / lineSpacing)
      
      // Wrap text to lines using character count (matches preview exactly)
      const textLines = wrapTextToLines(textContent, availableWidth, fontSize)
      console.log(`  📊 Page ${pageEdit.page_number}: ${textLines.length} lines to render (max ${maxLinesPerPage} per page)`)
      
      // Check if text exceeds page capacity
      if (textLines.length > maxLinesPerPage) {
        console.log(`  ⚠️  WARNING: ${textLines.length - maxLinesPerPage} lines exceed page capacity!`)
        console.log(`  💡 These lines will appear on next page (if it exists)`)
      }
      
      // Draw lines that fit on this page
      let linesDrawn = 0
      const linesToDraw = textLines.slice(0, maxLinesPerPage) // Only draw lines that fit
      const overflowLines = textLines.slice(maxLinesPerPage) // Lines that don't fit
      
      linesToDraw.forEach((line: string, index: number) => {
        // Calculate Y position (PDF uses bottom-left origin)
        // CRITICAL: Use SAME formula for ALL lines (empty or not)
        const baselineOffset = fontSize * 0.8 // Match preview baseline position
        const canvasY = marginTop + (index * lineSpacing) + baselineOffset
        const pdfY = pageHeight - canvasY
        
        // Skip empty lines entirely (spacing already calculated)
        if (!line || line.trim() === '') {
          return
        }
        
        const textToDraw = line
        
        // Get color for this specific line (use line_colors if available, otherwise use default ink_color)
        const lineColors = pageEdit.line_colors || {}
        const color = lineColors[index] || pageEdit.ink_color || 'black'
        const colorMap: Record<string, { r: number; g: number; b: number }> = {
          'black': { r: 0.102, g: 0.102, b: 0.102 },                    // #1a1a1a
          'blue-dark': { r: 0.118, g: 0.227, b: 0.541 },               // #1e3a8a
          'night-blue': { r: 0.082, g: 0.106, b: 0.329 },              // #151B54
          'pure-blue': { r: 0.0, g: 0.0, b: 1.0 },                     // #0000FF
          'dodger-blue': { r: 0.118, g: 0.565, b: 1.0 },               // #1E90FF
          'blueberry-blue': { r: 0.0, g: 0.255, b: 0.761 },            // #0041C2
          'royal-blue': { r: 0.255, g: 0.412, b: 0.882 },              // #4169E1
          'cornflower-blue': { r: 0.4, g: 0.584, b: 0.929 },           // #6695ED
          'blue-jay': { r: 0.169, g: 0.329, b: 0.494 },                // #2B547E
          'azure-blue': { r: 0.282, g: 0.388, b: 0.627 },              // #4863A0
          'light-purple-blue': { r: 0.447, g: 0.561, b: 0.808 },       // #728FCE
          'steel-blue': { r: 0.275, g: 0.510, b: 0.706 },              // #4682B4
          'denim-blue': { r: 0.475, g: 0.729, b: 0.925 },              // #79BAEC
          'columbia-blue': { r: 0.529, g: 0.686, b: 0.780 },           // #87AFC7
          'deep-sea-blue': { r: 0.071, g: 0.204, b: 0.337 },           // #123456
          'dark-blue-gray': { r: 0.161, g: 0.275, b: 0.357 },          // #29465B
          'charcoal-blue': { r: 0.212, g: 0.267, b: 0.310 },           // #36454F
          'day-sky-blue': { r: 0.510, g: 0.792, b: 1.0 },              // #82CAFF
        }
        const colorValues = colorMap[color] || colorMap['black']
        const rgbColor = rgb(colorValues.r, colorValues.g, colorValues.b)

        // Debug first line
        if (linesDrawn === 0) {
          console.log(`  🎨 First line details:`)
          console.log(`    Text: "${textToDraw.substring(0, 30)}..."`)
          console.log(`    Position: x=${marginLeft}, y=${pdfY} (canvas: ${canvasY})`)
          console.log(`    Font size: ${fontSize}`)
          console.log(`    Font being used: ${customFont.name}`)
          console.log(`    Color: ${color}`)
          console.log(`    Page height: ${pageHeight}`)
        }

        // Draw text CHARACTER BY CHARACTER to apply letter spacing
        try {
          let currentX = marginLeft
          
          for (let charIndex = 0; charIndex < textToDraw.length; charIndex++) {
            const char = textToDraw[charIndex]
            
            // Draw character
            page.drawText(char, {
              x: currentX,
              y: pdfY,
              size: fontSize,
              font: customFont,
              color: rgbColor,
            })
            
            // Calculate character width and add letter spacing
            const charWidth = customFont.widthOfTextAtSize(char, fontSize)
            currentX += charWidth + letterSpacing // Add letter spacing after each character
          }
          
          linesDrawn++
        } catch (drawError) {
          console.error(`  ❌ Failed to draw line ${index}:`, drawError)
          console.error(`    Line content: "${textToDraw}"`)
          console.error(`    Font name attempted: ${customFont.name}`)
        }
      })
      
      console.log(`  ✅ Page ${pageEdit.page_number}: Drew ${linesDrawn} lines`)
      
      // Log overflow info but DON'T draw it (overflow is already saved in next page's text_content)
      if (overflowLines.length > 0) {
        console.log(`  ℹ️  Note: ${overflowLines.length} lines overflow - they should be in next page's text_content`)
      }

      // Draw annotations/drawings on the page
      if (pageEdit.drawing_data && Array.isArray(pageEdit.drawing_data) && pageEdit.drawing_data.length > 0) {
        console.log(`  🎨 Drawing ${pageEdit.drawing_data.length} strokes on page ${pageEdit.page_number}`)
        
        for (const stroke of pageEdit.drawing_data) {
          if (!stroke.points || stroke.points.length === 0) continue
          
          // Skip eraser strokes (they remove content, not add it)
          if (stroke.tool === 'eraser') continue
          
          // Convert hex color to RGB
          const hexColor = stroke.color || '#000000'
          const r = parseInt(hexColor.slice(1, 3), 16) / 255
          const g = parseInt(hexColor.slice(3, 5), 16) / 255
          const b = parseInt(hexColor.slice(5, 7), 16) / 255
          
          const thickness = stroke.thickness || 2
          
          // Draw lines connecting points
          for (let i = 0; i < stroke.points.length - 1; i++) {
            const p1 = stroke.points[i]
            const p2 = stroke.points[i + 1]
            
            // Convert canvas Y to PDF Y (flip vertical axis)
            const pdfY1 = pageHeight - p1.y
            const pdfY2 = pageHeight - p2.y
            
            // Draw line segment
            page.drawLine({
              start: { x: p1.x, y: pdfY1 },
              end: { x: p2.x, y: pdfY2 },
              thickness: thickness,
              color: rgb(r, g, b),
              opacity: 1,
            })
          }
        }
        
        console.log(`  ✅ Finished drawing annotations on page ${pageEdit.page_number}`)
      }
    }

    console.log('💾 Saving PDF...')

    // Save PDF
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF')
  }
}

export const createPDFFromText = async (
  text: string,
  fontUrl: string
): Promise<Uint8Array> => {
  try {
    const pdfDoc = await PDFDocument.create()
    
    // Register fontkit for custom font support
    pdfDoc.registerFontkit(fontkit)
    
    const page = pdfDoc.addPage([600, 800])

    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer())
    const customFont = await pdfDoc.embedFont(fontBytes)

    page.drawText(text, {
      x: 50,
      y: 750,
      size: 12,
      font: customFont,
      color: rgb(0, 0, 0),
    })

    return await pdfDoc.save()
  } catch (error) {
    console.error('PDF creation error:', error)
    throw new Error('Failed to create PDF')
  }
}
