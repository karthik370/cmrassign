'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FontList } from '@/components/fonts/FontList'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function FontsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    My Fonts
                  </h1>
                  <p className="text-gray-600">
                    Manage your handwriting fonts
                  </p>
                </div>
                <Link href="/fonts/upload">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Upload Font
                  </Button>
                </Link>
              </div>

              <FontList />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
