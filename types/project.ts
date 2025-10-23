import { Font } from './font'

export interface Project {
  id: string
  user_id: string
  font_id: string | null
  name: string
  original_pdf_url: string
  processed_pdf_url: string | null
  page_count: number | null
  pdf_metadata: PDFMetadata | null
  status: 'draft' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  font?: Font
}

export interface PDFMetadata {
  pageCount: number
  pages: PageMetadata[]
}

export interface PageMetadata {
  pageNumber: number
  width: number
  height: number
  lines: TextLine[]
  header: BoundingBox | null
  footer: BoundingBox | null
  barcodes: BoundingBox[]
  safeZones: SafeZone[]
}

export interface TextLine {
  id: string
  x: number
  y: number
  width: number
  height: number
  maxCharacters?: number
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface SafeZone {
  x: number
  y: number
  width: number
  height: number
}

export interface PageEdit {
  id: string
  project_id: string
  page_number: number
  text_content: TextBlock[] | null
  detected_areas: DetectedAreas | null
  ink_color: string
  line_colors?: Record<number, string> // Store individual line colors (line index -> color)
  dimensions?: PageDimensions // Store page-specific dimension settings
  drawing_data?: any[] // Store drawing strokes (pen, eraser, lines)
  created_at: string
  updated_at: string
}

export interface PageDimensions {
  lineBoxHeight: number
  lineSpacing: number
  marginLeft: number
  marginRight: number
  marginTop: number
}

export interface TextBlock {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontWeight?: number
  letterSpacing?: number
  color: string
}

export interface DetectedAreas {
  lines: TextLine[]
  header: BoundingBox | null
  footer: BoundingBox | null
  barcodes: BoundingBox[]
}
