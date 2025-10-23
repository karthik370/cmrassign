'use client'

import { useState, useEffect } from 'react'
import { Eye, Trash2, FileText } from 'lucide-react'
import { Font } from '@/types/font'
import { Button } from '@/components/ui/Button'
import { formatBytes, formatDate } from '@/lib/utils'
import { loadCustomFont } from '@/lib/font-loader'

interface FontCardProps {
  font: Font
  onDelete: (fontId: string) => void
  onPreview: (font: Font) => void
  onUse?: (font: Font) => void
}

export const FontCard = ({ font, onDelete, onPreview, onUse }: FontCardProps) => {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    loadCustomFont(font.font_file_url, `font-${font.id}`)
      .then(() => setFontLoaded(true))
      .catch(() => setFontLoaded(false))
  }, [font])

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{font.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {font.font_format.toUpperCase()} • {formatBytes(font.font_file_size || 0)} • {formatDate(font.created_at)}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded ${
              font.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {font.status}
          </span>
        </div>

        {fontLoaded && (
          <div
            style={{ fontFamily: `font-${font.id}` }}
            className="text-lg text-gray-700 py-2 border-t border-b"
          >
            The quick brown fox jumps
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(font)}
            className="flex-1"
          >
            <Eye size={16} className="mr-1" />
            Preview
          </Button>
          {onUse && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUse(font)}
              className="flex-1"
            >
              <FileText size={16} className="mr-1" />
              Use
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(font.id)}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
