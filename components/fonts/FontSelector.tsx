'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
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

interface FontSelectorProps {
  selectedFont: LocalFont | null
  onSelectFont: (font: LocalFont) => void
}

export const FontSelector = ({ selectedFont, onSelectFont }: FontSelectorProps) => {
  const [localFonts, setLocalFonts] = useState<LocalFont[]>([])
  const [uploadedFonts, setUploadedFonts] = useState<LocalFont[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [previewText, setPreviewText] = useState('The quick brown fox jumps')
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  const allFonts = [...uploadedFonts, ...localFonts]

  useEffect(() => {
    loadFonts()
  }, [])

  const loadFonts = async () => {
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      // Load local fonts
      const localResponse = await fetch('/api/fonts/local')
      const localData = await localResponse.json()
      const local = (localData.fonts || []).map((f: any) => ({ ...f, fontType: 'local' }))
      setLocalFonts(local)

      // Load user-uploaded fonts (with auth)
      const uploadedResponse = await fetch('/api/fonts/uploaded', {
        headers: session?.access_token ? {
          'Authorization': `Bearer ${session.access_token}`
        } : {}
      })
      const uploadedData = await uploadedResponse.json()
      const uploaded = (uploadedData.fonts || []).map((f: any) => ({
        ...f,
        id: f.id,
        name: f.name,
        fileName: f.name,
        fileSize: 0,
        type: f.format || 'ttf',
        url: f.url,
        fontType: 'uploaded'
      }))
      setUploadedFonts(uploaded)
      
      const allFonts = [...uploaded, ...local]
      // Auto-select first font if none selected
      if (!selectedFont && allFonts.length > 0) {
        onSelectFont(allFonts[0])
      }
    } catch (error) {
      console.error('Failed to load fonts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFontFace = async (font: LocalFont) => {
    if (loadedFonts.has(font.id)) return
    
    try {
      const fontFace = new FontFace(font.id, `url(${font.url})`)
      await fontFace.load()
      document.fonts.add(fontFace)
      setLoadedFonts(prev => new Set(prev).add(font.id))
      console.log(`✅ Font loaded: ${font.name}`)
    } catch (error) {
      console.error(`Failed to load font ${font.name}:`, error)
    }
  }

  // Load all fonts for preview
  useEffect(() => {
    allFonts.forEach(font => loadFontFace(font))
  }, [localFonts, uploadedFonts])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Font Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Handwriting Font
        </label>
        {allFonts.length > 0 && (
          <div className="mb-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
            <span className="font-medium">💡 Tip:</span>
            <span>{uploadedFonts.length} uploaded + {localFonts.length} local = {allFonts.length} total fonts available</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedFont ? (
              <>
                <span
                  className="text-2xl"
                  style={{ fontFamily: selectedFont.id }}
                >
                  Aa
                </span>
                <div>
                  <div className="font-medium text-gray-900">{selectedFont.name}</div>
                  <div className="text-xs text-gray-500">
                    {selectedFont.type.toUpperCase()}{selectedFont.fileSize ? ` • ${formatFileSize(selectedFont.fileSize)}` : ''}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-gray-500">Choose a font...</span>
            )}
          </div>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Preview text..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Uploaded Fonts Section */}
              {uploadedFonts.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="px-4 py-2 bg-purple-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    📤 Your Uploaded Fonts ({uploadedFonts.length})
                  </div>
                  {uploadedFonts.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => {
                        onSelectFont(font)
                        setIsOpen(false)
                      }}
                      className="w-full px-4 py-3 hover:bg-purple-50 flex items-center gap-3 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div
                          className="text-lg mb-1"
                          style={{ fontFamily: font.id }}
                        >
                          {previewText}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">{font.name}</span>
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">Uploaded</span>
                        </div>
                      </div>
                      {selectedFont?.id === font.id && (
                        <Check size={20} className="text-purple-600 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Local Fonts Section */}
              <div className="py-2">
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  💾 Default Local Fonts ({localFonts.length})
                </div>
                {localFonts.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => {
                      onSelectFont(font)
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <div
                        className="text-lg mb-1"
                        style={{ fontFamily: font.id }}
                      >
                        {previewText}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">{font.name}</span>
                        <span>•</span>
                        <span>{font.type.toUpperCase()}</span>
                        {font.fileSize && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(font.fileSize)}</span>
                          </>
                        )}
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">Local</span>
                      </div>
                    </div>
                    {selectedFont?.id === font.id && (
                      <Check size={20} className="text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Font Preview */}
      {selectedFont && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
          <div
            className="text-2xl text-gray-900"
            style={{ fontFamily: selectedFont.id }}
          >
            The quick brown fox jumps over the lazy dog.<br />
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789 !@#$%^&*()
          </div>
        </div>
      )}
    </div>
  )
}
