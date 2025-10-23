'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle, XCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface PDFUploaderProps {
  onUpload: (file: File, name: string) => Promise<void>
}

export const PDFUploader = ({ onUpload }: PDFUploaderProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    setError('')

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    if (selectedFile.size > MAX_PDF_SIZE) {
      setError('PDF file is too large. Maximum size is 50MB.')
      return
    }

    setFile(selectedFile)
    if (!name) {
      setName(selectedFile.name.replace('.pdf', ''))
    }
  }

  const handleUpload = async () => {
    if (!file || !name) {
      setError('Please select a file and enter a name')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      await onUpload(file, name)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400',
          file && 'border-green-500 bg-green-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0]
            if (selectedFile) handleFileSelect(selectedFile)
          }}
        />

        {file ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="text-green-600" size={24} />
            <FileText className="text-gray-600" size={20} />
            <span className="text-sm text-gray-700">{file.name}</span>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-600">
              Drag & drop your PDF file here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Maximum 12 pages, up to 50MB
            </p>
          </div>
        )}

        {!file && (
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="mt-4"
          >
            Choose PDF
          </Button>
        )}
      </div>

      {file && (
        <div className="space-y-3">
          <Input
            label="Project Name"
            placeholder="Assignment 1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              isLoading={isUploading}
              className="flex-1"
            >
              Upload PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setName('')
                setError('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <XCircle size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
