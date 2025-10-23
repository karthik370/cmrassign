'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FontUploader } from '@/components/fonts/FontUploader'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function FontUploadPage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/fonts')
    }, 2000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-2xl mx-auto">
              <Link
                href="/fonts"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Fonts
              </Link>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Upload Font
              </h1>
              <p className="text-gray-600 mb-8">
                Upload your custom handwriting font file (.ttf or .otf)
              </p>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <FontUploader onSuccess={handleSuccess} />
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Don't have a font yet?
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Follow our step-by-step guide to create your handwriting font for free on Calligraphr.com
                </p>
                <Link
                  href="/instructions"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View Instructions →
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
