export interface Font {
  id: string
  user_id: string
  name: string
  font_file_url: string
  font_file_size: number | null
  font_format: 'ttf' | 'otf'
  status: 'uploaded' | 'active' | 'failed'
  is_validated: boolean
  created_at: string
  updated_at: string
}

export interface FontUploadResponse {
  success: boolean
  font?: Font
  error?: string
  message?: string
}

export interface FontValidation {
  isValid: boolean
  error?: string
  format?: 'ttf' | 'otf'
}
