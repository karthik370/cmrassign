'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface LocalFont {
  name: string
  fileName?: string
  url: string
  type?: 'local' | 'uploaded'
  id?: string
}

interface FontChangerProps {
  currentFontName: string
  onFontChange: (fontName: string, fontUrl: string) => void
}

export const FontChanger = ({ currentFontName, onFontChange }: FontChangerProps) => {
  const [localFonts, setLocalFonts] = useState<LocalFont[]>([])
  const [uploadedFonts, setUploadedFonts] = useState<LocalFont[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    loadFonts()
  }, [])

  const allFonts = [...uploadedFonts, ...localFonts]

  const loadFonts = async () => {
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      // Load local fonts
      const localResponse = await fetch('/api/fonts/local')
      const localData = await localResponse.json()
      setLocalFonts((localData.fonts || []).map((f: any) => ({ ...f, type: 'local' })))

      // Load user-uploaded fonts (with auth)
      const uploadedResponse = await fetch('/api/fonts/uploaded', {
        headers: session?.access_token ? {
          'Authorization': `Bearer ${session.access_token}`
        } : {}
      })
      const uploadedData = await uploadedResponse.json()
      setUploadedFonts((uploadedData.fonts || []).map((f: any) => ({ ...f, type: 'uploaded' })))
    } catch (error) {
      console.error('Failed to load fonts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFontChange = async (font: LocalFont) => {
    setChanging(true)
    try {
      await onFontChange(font.name, font.url)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to change font:', error)
    } finally {
      setChanging(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Handwriting Font
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={changing}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors disabled:opacity-50"
      >
        <span className="text-sm font-medium truncate">{currentFontName}</span>
        {changing ? (
          <Loader2 size={16} className="animate-spin text-gray-400" />
        ) : (
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            {/* User Uploaded Fonts */}
            {uploadedFonts.length > 0 && (
              <div className="py-1 border-b border-gray-200">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-purple-50">
                  📤 Your Uploaded Fonts
                </div>
                {uploadedFonts.map((font) => (
                  <button
                    key={font.id || font.name}
                    type="button"
                    onClick={() => handleFontChange(font)}
                    className="w-full px-3 py-2 hover:bg-purple-50 flex items-center justify-between transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">{font.name}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium flex-shrink-0">Uploaded</span>
                    </div>
                    {currentFontName === font.name && (
                      <Check size={16} className="text-purple-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Local/Default Fonts */}
            <div className="py-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                💾 Default Fonts
              </div>
              {localFonts.map((font) => (
                <button
                  key={font.fileName || font.name}
                  type="button"
                  onClick={() => handleFontChange(font)}
                  className="w-full px-3 py-2 hover:bg-gray-50 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{font.name}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium flex-shrink-0">Local</span>
                  </div>
                  {currentFontName === font.name && (
                    <Check size={16} className="text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
