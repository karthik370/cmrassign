import { FontValidation } from '@/types/font'

const MAX_FONT_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = ['.ttf', '.otf']

export const validateFontFile = (file: File): FontValidation => {
  // Check file extension
  const extension = file.name.toLowerCase().slice(-4)
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a .ttf or .otf file.',
    }
  }

  // Check file size
  if (file.size > MAX_FONT_SIZE) {
    return {
      isValid: false,
      error: 'Font file is too large. Maximum size is 5MB.',
    }
  }

  return {
    isValid: true,
    format: extension === '.ttf' ? 'ttf' : 'otf',
  }
}

export const validateFontBuffer = (buffer: Buffer): FontValidation => {
  // Check TTF magic number: 0x00010000
  const isTTF =
    buffer[0] === 0x00 &&
    buffer[1] === 0x01 &&
    buffer[2] === 0x00 &&
    buffer[3] === 0x00

  // Check OTF magic number: "OTTO"
  const isOTF =
    buffer[0] === 0x4f && // O
    buffer[1] === 0x54 && // T
    buffer[2] === 0x54 && // T
    buffer[3] === 0x4f // O

  if (!isTTF && !isOTF) {
    return {
      isValid: false,
      error:
        'Invalid font file format. File does not appear to be a valid .ttf or .otf font.',
    }
  }

  return {
    isValid: true,
    format: isTTF ? 'ttf' : 'otf',
  }
}

export const ERROR_MESSAGES = {
  FONT_TOO_LARGE: 'Font file is too large. Maximum size is 5MB.',
  INVALID_FONT:
    'This file is not a valid font. Please download from Calligraphr.',
  INVALID_EXTENSION: 'Invalid file type. Please upload a .ttf or .otf file.',
  PDF_TOO_LARGE: 'PDF file is too large. Maximum size is 50MB.',
  TOO_MANY_PAGES: 'PDF has too many pages. Maximum is 12 pages.',
  UPLOAD_FAILED:
    'Upload failed. Please check your internet connection and try again.',
  GENERATION_FAILED: 'Failed to generate PDF. Please try again.',
}
