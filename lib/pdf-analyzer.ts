import { PDFAnalysisResult, PageAnalysis } from '@/types/pdf'
import { TextLine, BoundingBox } from '@/types/project'

// Simplified PDF analyzer - just uses external service or manual count
export const analyzePDF = async (pdfUrl: string): Promise<PDFAnalysisResult> => {
  try {
    console.log('📊 Fetching PDF to analyze:', pdfUrl)
    
    // Fetch the PDF to check if it's valid
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch PDF')
    }
    
    const buffer = await response.arrayBuffer()
    
    // Simple PDF page count detection using markers
    // PDFs have page count in their structure
    const pdfString = new TextDecoder().decode(buffer)
    
    // Count /Type /Page occurrences (basic method)
    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g)
    const pageCount = pageMatches ? pageMatches.length : 1
    
    console.log(`📄 Detected ${pageCount} pages using simple analysis`)
    
    // Generate default page data
    const pages: PageAnalysis[] = []
    for (let i = 1; i <= pageCount; i++) {
      pages.push({
        pageNumber: i,
        width: 595, // A4 width in points
        height: 842, // A4 height in points
        rotation: 0,
        textAreas: [],
        lines: [],
      })
    }

    return {
      pageCount,
      pages,
    }
  } catch (error) {
    console.error('❌ PDF analysis error:', error)
    throw new Error('Failed to analyze PDF')
  }
}

const detectHorizontalLines = (textContent: any, viewport: any): any[] => {
  const lines: any[] = []
  const lineHeight = 30 // Approximate line height in points
  const pageHeight = viewport.height
  const pageWidth = viewport.width

  // Create default lines every ~30 points
  for (let y = 100; y < pageHeight - 100; y += lineHeight + 10) {
    lines.push({
      y: y,
      width: pageWidth - 100,
      height: lineHeight,
    })
  }

  return lines
}

const detectHeader = (textContent: any, viewport: any): BoundingBox | null => {
  const headerZone = viewport.height * 0.1

  return {
    x: 0,
    y: 0,
    width: viewport.width,
    height: headerZone,
  }
}

const detectFooter = (textContent: any, viewport: any): BoundingBox | null => {
  const footerZone = viewport.height * 0.9

  return {
    x: 0,
    y: footerZone,
    width: viewport.width,
    height: viewport.height - footerZone,
  }
}

const detectBarcodes = (textContent: any): BoundingBox[] => {
  // Basic barcode detection - can be enhanced
  return []
}

export const calculateSafeZones = (
  lines: any[],
  header: BoundingBox | null,
  footer: BoundingBox | null,
  barcodes: BoundingBox[]
) => {
  // Calculate safe zones for text input
  return lines.map((line) => ({
    x: line.x || 50,
    y: line.y,
    width: line.width,
    height: line.height,
  }))
}

export const generateTextLines = (
  pageWidth: number,
  pageHeight: number
): TextLine[] => {
  const lines: TextLine[] = []
  const lineHeight = 28 // Line height for text
  const lineSpacing = 35 // Total spacing between lines (includes line height + gap)
  const startY = 80 // Start closer to top
  const endY = pageHeight - 80 // End closer to bottom
  const marginX = 60 // Side margins

  let id = 1
  for (let y = startY; y < endY; y += lineSpacing) {
    lines.push({
      id: `line-${id}`,
      x: marginX,
      y: y,
      width: pageWidth - marginX * 2,
      height: lineHeight,
      maxCharacters: Math.floor((pageWidth - marginX * 2) / 7), // Approximate chars per line
    })
    id++
  }

  return lines
}
