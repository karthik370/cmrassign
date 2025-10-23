'use client'

import { useState, useEffect } from 'react'
import { Font } from '@/types/font'
import { supabase } from '@/lib/supabase'
import axios from 'axios'

export const useFonts = () => {
  const [fonts, setFonts] = useState<Font[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFonts = async () => {
    try {
      setLoading(true)
      
      // Get the current session to send with request
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('Not authenticated')
        setFonts([])
        return
      }
      
      const response = await axios.get('/api/font', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      setFonts(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch fonts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFonts()
  }, [])

  const uploadFont = async (file: File, name: string) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)

      const response = await axios.post('/api/font/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session.access_token}`
        },
      })

      if (response.data.success) {
        await fetchFonts()
        return { success: true, font: response.data.font }
      }

      return { success: false, error: response.data.message }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to upload font',
      }
    }
  }

  const deleteFont = async (fontId: string) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await axios.delete(`/api/font/${fontId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.data.success) {
        await fetchFonts()
        return { success: true }
      }

      return { success: false, error: response.data.message }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete font',
      }
    }
  }

  const updateFont = async (fontId: string, name: string) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      const response = await axios.patch(`/api/font/${fontId}`, { name }, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.data.success) {
        await fetchFonts()
        return { success: true }
      }

      return { success: false, error: response.data.message }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update font',
      }
    }
  }

  return {
    fonts,
    loading,
    error,
    fetchFonts,
    uploadFont,
    deleteFont,
    updateFont,
  }
}
