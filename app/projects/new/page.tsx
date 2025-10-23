'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PaymentGate } from '@/components/payment/PaymentGate'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { PDFUploader } from '@/components/pdf/PDFUploader'
import { FontSelector } from '@/components/fonts/FontSelector'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { supabase } from '@/lib/supabase'

interface LocalFont {
  id: string
  name: string
  fileName?: string
  fileSize?: number
  type: 'ttf' | 'otf'
  url: string
  isLocal?: true
  fontType?: 'local' | 'uploaded'
}

export default function NewProjectPage() {
  const router = useRouter()
  const [selectedFont, setSelectedFont] = useState<LocalFont | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handlePDFUpload = async (file: File, name: string) => {
    if (!selectedFont) {
      alert('Please select a font first')
      return
    }

    setIsUploading(true)
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Not authenticated. Please login again.')
        return
      }

      // Upload PDF and create project with selected local font
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('name', name)
      formData.append('fontUrl', selectedFont.url)
      formData.append('fontName', selectedFont.name)
      formData.append('fontFileName', selectedFont.fileName || selectedFont.name)

      const response = await axios.post('/api/pdf/upload-with-local-font', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.data.success && response.data.projectId) {
        router.push(`/projects/${response.data.projectId}/editor`)
      } else {
        alert(response.data.error || 'Failed to create project')
      }
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert(error.response?.data?.error || 'Failed to upload PDF')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ProtectedRoute>
      <PaymentGate>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-8">
              <div className="max-w-4xl mx-auto">
                <Link
                  href="/projects"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Projects
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  New Project
                </h1>
                <p className="text-gray-600 mb-8">
                  Select a font and upload your PDF document
                </p>

                {/* Step 1: Select Font */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold">1</span>
                    Choose Your Handwriting Font
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <FontSelector 
                      selectedFont={selectedFont}
                      onSelectFont={setSelectedFont}
                    />
                  </div>
                </div>

                {/* Step 2: Upload PDF */}
                {selectedFont && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold">2</span>
                      Upload Your PDF Assignment
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <PDFUploader onUpload={handlePDFUpload} />
                      {isUploading && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                          <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                          <p className="text-blue-800 font-medium">Creating project with {selectedFont.name}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </PaymentGate>
    </ProtectedRoute>
  )
}
