'use client'

import { useState, useEffect } from 'react'
import { Font } from '@/types/font'
import { loadCustomFont } from '@/lib/font-loader'
import { Input } from '@/components/ui/Input'

interface FontPreviewProps {
  font: Font
}

export const FontPreview = ({ font }: FontPreviewProps) => {
  const [customText, setCustomText] = useState('The quick brown fox jumps over the lazy dog')
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    loadCustomFont(font.font_file_url, `preview-${font.id}`)
      .then(() => setFontLoaded(true))
      .catch((err) => {
        console.error('Failed to load font:', err)
        setFontLoaded(false)
      })
  }, [font])

  if (!fontLoaded) {
    return <div className="text-center py-8">Loading font...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div style={{ fontFamily: `preview-${font.id}` }} className="space-y-3">
          <p className="text-2xl">The quick brown fox jumps over the lazy dog</p>
          <p className="text-xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p className="text-xl">abcdefghijklmnopqrstuvwxyz</p>
          <p className="text-xl">0123456789 !@#$%^&*()</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <Input
          label="Try your own text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Type something..."
        />
        <div
          style={{ fontFamily: `preview-${font.id}` }}
          className="text-2xl mt-4 p-4 bg-gray-50 rounded min-h-[100px]"
        >
          {customText}
        </div>
      </div>
    </div>
  )
}
