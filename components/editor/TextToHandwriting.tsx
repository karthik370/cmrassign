'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { InkColor } from './ColorPicker'
import { PageDimensions } from '@/types/project'
import { DrawingCanvas } from './DrawingCanvas'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface TextToHandwritingProps {
  pdfUrl: string
  pageNumber: number
  fontFamily: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  inkColor: InkColor
  dimensions: PageDimensions
  onTextChange: (text: string) => void
  onLineColorsChange?: (lineColors: Record<number, InkColor>) => void
  initialText?: string
  initialLineColors?: Record<number, string>
  onPageCountDetected?: (pageCount: number) => void
  onOverflowDetected?: (overflowLines: string[], totalLines: number) => void
  showOverflowFrom?: string[] // Show overflow lines from previous page
  drawingMode?: boolean
  drawingData?: any[]
  onDrawingChange?: (drawing: any[]) => void
}

export const TextToHandwriting = ({
  pdfUrl,
  pageNumber,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  inkColor,
  dimensions,
  onTextChange,
  onLineColorsChange,
  initialText = '',
  initialLineColors = {},
  onPageCountDetected,
  onOverflowDetected,
  showOverflowFrom,
  drawingMode = false,
  drawingData = [],
  onDrawingChange,
}: TextToHandwritingProps) => {
  const [inputText, setInputText] = useState(initialText)
  const [pageWidth, setPageWidth] = useState<number | null>(null)
  const [pageHeight, setPageHeight] = useState<number | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [lineColors, setLineColors] = useState<Record<number, InkColor>>(initialLineColors as Record<number, InkColor>)

  // Update text and line colors when page changes or initial data changes
  useEffect(() => {
    setInputText(initialText)
    setLineColors(initialLineColors as Record<number, InkColor>)
  }, [initialText, initialLineColors, pageNumber])

  // Page dimensions and line settings (from props - page-specific settings)
  const lineBoxHeight = dimensions.lineBoxHeight
  const lineSpacing = dimensions.lineSpacing
  const marginLeft = dimensions.marginLeft
  const marginRight = dimensions.marginRight
  const marginTop = dimensions.marginTop
  // Use 595 as default (standard A4 width) to match PDF generation
  const effectivePageWidth = pageWidth || 595
  const availableWidth = effectivePageWidth - marginLeft - marginRight
  
  // Calculate character width based on font size
  // Adjusted to 0.55 to better match PDF font measurements
  // (PDF uses exact font.widthOfTextAtSize, we approximate)
  const avgCharWidth = fontSize * 0.6
  const maxCharsPerLine = Math.floor(availableWidth / avgCharWidth)

  // Smart word wrapping: Auto-reflows when you add/delete text
  // - Respects manual Enter + auto-wraps at margin + preserves spaces
  // - When you backspace, words flow back up from next line automatically
  const wrapTextToLines = (text: string): string[] => {
    if (!text) return ['']
    
    // Step 1: Split by manual line breaks (Enter key)
    const manualParagraphs = text.split('\n')
    const wrappedLines: string[] = []

    // Step 2: For each paragraph, intelligently wrap at character limit
    manualParagraphs.forEach((paragraph) => {
      if (paragraph.length === 0) {
        wrappedLines.push('') // Preserve empty lines from manual breaks
        return
      }

      // Dynamic word-by-word wrapping with space preservation
      const words = paragraph.split(/(\s+)/) // Captures spaces as separate elements
      let currentLine = ''

      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        if (word.length === 0) continue
        
        const testLine = currentLine + word
        
        // Check if adding this word exceeds line width
        if (testLine.length > maxCharsPerLine) {
          if (currentLine.length > 0) {
            // Line is full - save it and start new line
            wrappedLines.push(currentLine.trimEnd()) // Remove trailing spaces
            currentLine = word.trimStart() // Start new line with word (no leading space)
          } else {
            // Single word too long - force break it
            let remaining = word
            while (remaining.length > maxCharsPerLine) {
              wrappedLines.push(remaining.substring(0, maxCharsPerLine))
              remaining = remaining.substring(maxCharsPerLine)
            }
            currentLine = remaining
          }
        } else {
          // Word fits - add it to current line
          currentLine = testLine
        }
      }

      // Add the last line of this paragraph
      if (currentLine.length > 0) {
        wrappedLines.push(currentLine.trimEnd())
      }
    })

    return wrappedLines.length > 0 ? wrappedLines : ['']
  }

  const textLines = wrapTextToLines(inputText)
  // Use 842 as default (standard A4 height) to match PDF generation
  const maxLinesPerPage = Math.floor(((pageHeight || 842) - marginTop - 80) / lineSpacing)
  
  // Calculate overflow
  const overflowLines = textLines.length > maxLinesPerPage ? textLines.slice(maxLinesPerPage) : []
  
  // Notify parent about overflow in REAL-TIME (whenever text or dimensions change)
  useEffect(() => {
    if (onOverflowDetected) {
      // Always notify, even if no overflow (to clear next page if overflow resolved)
      onOverflowDetected(overflowLines, textLines.length)
    }
  }, [inputText, lineSpacing, marginTop, lineBoxHeight, overflowLines.length, textLines.length])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setInputText(newText)
    onTextChange(newText)
  }

  const toggleLineColor = (lineIndex: number) => {
    const colors: InkColor[] = ['black', 'blue-dark', 'night-blue', 'pure-blue', 'dodger-blue', 'blueberry-blue', 'royal-blue', 'cornflower-blue', 'midnight-navy', 'ocean-blue', 'sapphire-blue', 'cobalt-blue', 'marine-blue']
    const currentColor = lineColors[lineIndex] || inkColor
    const currentIndex = colors.indexOf(currentColor)
    const nextIndex = (currentIndex + 1) % colors.length
    const newLineColors = {
      ...lineColors,
      [lineIndex]: colors[nextIndex]
    }
    setLineColors(newLineColors)
    
    // Notify parent of line color change
    if (onLineColorsChange) {
      onLineColorsChange(newLineColors)
    }
  }

  const getLineColor = (lineIndex: number): string => {
    const color = lineColors[lineIndex] || inkColor
    const colorMap: Record<InkColor, string> = {
      'black': '#1a1a1a',
      'blue-dark': '#1e3a8a',
      'night-blue': '#151B54',
      'pure-blue': '#0000FF',
      'dodger-blue': '#1E90FF',
      'blueberry-blue': '#0041C2',
      'royal-blue': '#4169E1',
      'cornflower-blue': '#6695ED',
      'midnight-navy': '#284283',
      'ocean-blue': '#3E66A3',
      'sapphire-blue': '#2D5DAF',
      'cobalt-blue': '#305CDE',
      'marine-blue': '#003399',
    }
    return colorMap[color] || '#1a1a1a'
  }

  const getColorBackground = (color: InkColor): { bg: string; border: string; text: string } => {
    const colorStyles: Record<InkColor, { bg: string; border: string; text: string }> = {
      'black': { bg: '#1a1a1a', border: '#1a1a1a', text: '#ffffff' },
      'blue-dark': { bg: '#1e3a8a', border: '#1e3a8a', text: '#ffffff' },
      'night-blue': { bg: '#151B54', border: '#151B54', text: '#ffffff' },
      'pure-blue': { bg: '#0000FF', border: '#0000FF', text: '#ffffff' },
      'dodger-blue': { bg: '#1E90FF', border: '#1E90FF', text: '#ffffff' },
      'blueberry-blue': { bg: '#0041C2', border: '#0041C2', text: '#ffffff' },
      'royal-blue': { bg: '#4169E1', border: '#4169E1', text: '#ffffff' },
      'cornflower-blue': { bg: '#6695ED', border: '#6695ED', text: '#000000' },
      'midnight-navy': { bg: '#284283', border: '#284283', text: '#ffffff' },
      'ocean-blue': { bg: '#3E66A3', border: '#3E66A3', text: '#ffffff' },
      'sapphire-blue': { bg: '#2D5DAF', border: '#2D5DAF', text: '#ffffff' },
      'cobalt-blue': { bg: '#305CDE', border: '#305CDE', text: '#ffffff' },
      'marine-blue': { bg: '#003399', border: '#003399', text: '#ffffff' },
    }
    return colorStyles[color] || colorStyles['black']
  }

  return (
    <div className="flex flex-col h-full">
      {/* Input Text Area - Hide when drawing mode is active */}
      {!drawingMode && (
        <div className="bg-white border-b p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type Your Text
          </label>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
            placeholder="Type or paste text here...&#10;• Auto-wraps when reaching right margin&#10;• Press Enter for manual line breaks&#10;• Backspace to reflow words back up&#10;• All changes update instantly!"
            style={{ lineHeight: '1.5' }}
          />
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <div className="flex items-center gap-2">
              <span>{textLines.length} lines (max {maxLinesPerPage})</span>
              {textLines.length > maxLinesPerPage && (
                <span className="text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                  ⚠️ +{textLines.length - maxLinesPerPage} lines overflow to next page
                </span>
              )}
            </div>
            <span>{inputText.length} chars</span>
          </div>
        </div>
      )}

      {/* Compact Line Color Selector - Scrollable - Hide when drawing mode is active */}
      {!drawingMode && textLines.length > 0 && textLines.slice(0, maxLinesPerPage).length > 0 && (
        <div className="bg-gray-50 border-b p-2">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-xs font-medium text-gray-600">Line Colors (click to cycle):</span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-black border"></span>
              <span>→</span>
              <span className="w-3 h-3 rounded-full bg-blue-900 border"></span>
              <span>→</span>
              <span className="w-3 h-3 rounded-full bg-blue-600 border"></span>
              <span>→</span>
              <span className="w-3 h-3 rounded-full bg-blue-400 border"></span>
              <span>→</span>
              <span className="w-3 h-3 rounded-full bg-blue-300 border"></span>
              <span>→</span>
              <span className="w-3 h-3 rounded-full bg-red-600 border"></span>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
            {textLines.slice(0, maxLinesPerPage).map((line, index) => {
              const currentColor = lineColors[index] || inkColor
              const colorStyle = getColorBackground(currentColor)
              return (
                <button
                  key={index}
                  onClick={() => toggleLineColor(index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs border-2 rounded hover:opacity-80 transition-all flex-shrink-0 font-medium"
                  style={{ 
                    borderColor: colorStyle.border,
                    backgroundColor: colorStyle.bg,
                    color: colorStyle.text
                  }}
                  title={`${line.substring(0, 50)} - Click to change color`}
                >
                  <span>L{index + 1}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* PDF with Handwritten Text Overlay - Scrollable */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-lg relative inline-block">
          {/* PDF Background - Keep Original Untouched */}
          <Document 
            file={pdfUrl}
            onLoadSuccess={(pdf) => {
              setNumPages(pdf.numPages)
              console.log(`✅ PDF loaded on client: ${pdf.numPages} pages total`)
              // Notify parent of actual page count
              if (onPageCountDetected) {
                onPageCountDetected(pdf.numPages)
              }
            }}
            onLoadError={(error) => {
              console.error('❌ Error loading PDF:', error)
            }}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading PDF...</div>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber}
              onLoadSuccess={(page) => {
                console.log(`✅ Page ${pageNumber} loaded - Original size: ${page.originalWidth}x${page.originalHeight}`)
                setPageWidth(page.originalWidth)
                setPageHeight(page.originalHeight)
              }}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={1.0}
              devicePixelRatio={2}
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-500">Loading page {pageNumber}...</div>
                </div>
              }
            />
          </Document>

          {/* Text Overlay - NO LINES (use existing PDF lines) - ALWAYS SHOW */}
          <div className="absolute inset-0 pointer-events-none">
            <svg 
              width={pageWidth || 800} 
              height={pageHeight || 1120} 
              className="absolute inset-0"
              style={{ pointerEvents: 'none' }}
            >
              {/* Render text on existing PDF lines with individual colors */}
              {textLines.slice(0, maxLinesPerPage).map((line, index) => {
                // Equal spacing with baseline offset for precise alignment
                // CRITICAL: Use SAME formula for ALL lines (empty or not)
                // Baseline offset: 0.75-0.85 typically works well (adjust if needed)
                const baselineOffset = fontSize * 0.8
                const y = marginTop + (index * lineSpacing) + baselineOffset
                
                // Skip rendering empty lines entirely (but spacing is still calculated)
                if (!line || line.trim() === '') {
                  return null
                }
                
                return (
                  <text
                    key={index}
                    x={marginLeft}
                    y={y}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    fill={getLineColor(index)}
                    style={{ userSelect: 'none', fontWeight, letterSpacing: `${letterSpacing}px` }}
                    xmlSpace="preserve"
                  >
                    {line}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Drawing Canvas Overlay - Show OVER text when drawing mode is active */}
          {drawingMode && onDrawingChange && (
            <div className="absolute inset-0" style={{ width: pageWidth || 800, height: pageHeight || 1120, zIndex: 10 }}>
              <DrawingCanvas
                pageNumber={pageNumber}
                width={pageWidth || 800}
                height={pageHeight || 1120}
                initialDrawing={drawingData}
                onDrawingChange={onDrawingChange}
              />
            </div>
          )}

          {/* Display saved drawings when NOT in drawing mode */}
          {!drawingMode && drawingData && drawingData.length > 0 && (
            <div className="absolute inset-0 pointer-events-none" style={{ width: pageWidth || 800, height: pageHeight || 1120, zIndex: 5 }}>
              <canvas
                ref={(canvas) => {
                  if (!canvas) return
                  const ctx = canvas.getContext('2d')
                  if (!ctx) return
                  
                  canvas.width = pageWidth || 800
                  canvas.height = pageHeight || 1120
                  
                  // Clear and redraw all saved strokes
                  ctx.clearRect(0, 0, canvas.width, canvas.height)
                  
                  drawingData.forEach((stroke: any) => {
                    if (!stroke.points || stroke.points.length < 2) return
                    
                    ctx.beginPath()
                    
                    if (stroke.tool === 'eraser') {
                      ctx.globalCompositeOperation = 'destination-out'
                      ctx.strokeStyle = 'rgba(0,0,0,1)'
                    } else {
                      ctx.globalCompositeOperation = 'source-over'
                      ctx.strokeStyle = stroke.color || '#000000'
                    }
                    
                    ctx.lineWidth = stroke.thickness || 2
                    ctx.lineCap = 'round'
                    ctx.lineJoin = 'round'
                    
                    if (stroke.tool === 'line' && stroke.points.length === 2) {
                      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
                      ctx.lineTo(stroke.points[1].x, stroke.points[1].y)
                    } else {
                      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
                      for (let i = 1; i < stroke.points.length; i++) {
                        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
                      }
                    }
                    
                    ctx.stroke()
                    ctx.globalCompositeOperation = 'source-over'
                  })
                }}
                style={{ width: `${pageWidth || 800}px`, height: `${pageHeight || 1120}px` }}
              />
            </div>
          )}
          </div>
        </div>
      </div>

    </div>
  )
}
