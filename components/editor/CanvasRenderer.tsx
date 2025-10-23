'use client'

import { useRef, useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { TextBlock, TextLine } from '@/types/project'
import { TextInputField } from './TextInputField'
import { DrawingCanvas } from './DrawingCanvas'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface CanvasRendererProps {
  pdfUrl: string
  pageNumber: number
  textLines: TextLine[]
  textBlocks: TextBlock[]
  fontFamily: string
  onTextChange: (textBlock: TextBlock) => void
  drawingMode?: boolean
  drawingData?: any[]
  onDrawingChange?: (drawing: any[]) => void
}

export const CanvasRenderer = ({
  pdfUrl,
  pageNumber,
  textLines,
  textBlocks,
  fontFamily,
  onTextChange,
  drawingMode = false,
  drawingData = [],
  onDrawingChange,
}: CanvasRendererProps) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageWidth, setPageWidth] = useState<number>(800)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setPageWidth(Math.min(containerWidth - 40, 800))
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg relative">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={pageWidth} />
        </Document>

        {/* Text input fields overlay */}
        {!drawingMode && (
          <div className="absolute inset-0 pointer-events-none">
            {textBlocks.map((textBlock) => (
              <div key={textBlock.id} className="pointer-events-auto">
                <TextInputField
                  textBlock={textBlock}
                  fontFamily={fontFamily}
                  maxCharacters={
                    textLines.find((line) => line.id === textBlock.id)
                      ?.maxCharacters || 100
                  }
                  onChange={onTextChange}
                />
              </div>
            ))}
          </div>
        )}

        {/* Drawing canvas overlay */}
        {drawingMode && onDrawingChange && (
          <div className="absolute inset-0" style={{ width: pageWidth, height: pageWidth * 1.414 }}>
            <DrawingCanvas
              pageNumber={pageNumber}
              width={pageWidth}
              height={pageWidth * 1.414}
              initialDrawing={drawingData}
              onDrawingChange={onDrawingChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
