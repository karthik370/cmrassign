'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PDFEditor } from '@/components/editor/PDFEditor'
import { Loading } from '@/components/ui/Loading'
import { Project, PageEdit } from '@/types/project'
import { Font } from '@/types/font'
import { supabase } from '@/lib/supabase'
import axios from 'axios'
import { useParams } from 'next/navigation'

export default function EditorPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [font, setFont] = useState<Font | null>(null)
  const [pageEdits, setPageEdits] = useState<PageEdit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Get session token for auth
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        const response = await axios.get(`/api/pdf/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        setProject(response.data.project)
        setFont(response.data.font)
        setPageEdits(response.data.pageEdits || [])
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading fullScreen text="Loading project..." />
      </ProtectedRoute>
    )
  }

  if (error || !project || !font) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to load project
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <a
              href="/projects"
              className="text-primary-600 hover:underline"
            >
              Back to Projects
            </a>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <PDFEditor project={project} font={font} pageEdits={pageEdits} />
    </ProtectedRoute>
  )
}
