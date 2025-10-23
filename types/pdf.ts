export interface PDFUploadResponse {
  success: boolean
  project?: {
    id: string
    name: string
    page_count: number
    metadata: any
  }
  error?: string
  message?: string
}

export interface PDFGenerationRequest {
  projectId: string
}

export interface PDFGenerationResponse {
  success: boolean
  downloadUrl?: string
  error?: string
  message?: string
}

export interface PDFAnalysisResult {
  pageCount: number
  pages: PageAnalysis[]
}

export interface PageAnalysis {
  pageNumber: number
  width: number
  height: number
  rotation: number
  textAreas: TextArea[]
  lines: DetectedLine[]
}

export interface TextArea {
  x: number
  y: number
  width: number
  height: number
  text?: string
}

export interface DetectedLine {
  y: number
  width: number
  height: number
}
