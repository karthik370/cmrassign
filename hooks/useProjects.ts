'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/types/project'
import { supabase } from '@/lib/supabase'
import axios from 'axios'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Get the current session to send with request
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('Not authenticated')
        setProjects([])
        return
      }
      
      const response = await axios.get('/api/project', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      setProjects(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const createProject = async (
    file: File,
    name: string,
    fontId: string
  ) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('font_id', fontId)

      const response = await axios.post('/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session.access_token}`
        },
      })

      if (response.data.success) {
        await fetchProjects()
        return { success: true, project: response.data.project }
      }

      return { success: false, error: response.data.message }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create project',
      }
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await axios.delete(`/api/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.data.success) {
        await fetchProjects()
        return { success: true }
      }

      return { success: false, error: response.data.message }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete project',
      }
    }
  }

  const generatePDF = async (projectId: string) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await axios.post(`/api/pdf/${projectId}/generate`, {}, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.data.success) {
        await fetchProjects()
        return { success: true, downloadUrl: response.data.downloadUrl }
      }

      return { success: false, error: response.data.message }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to generate PDF',
      }
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    generatePDF,
  }
}
