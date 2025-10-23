'use client'

import { useState } from 'react'
import { Font } from '@/types/font'
import { FontCard } from './FontCard'
import { Modal } from '@/components/ui/Modal'
import { FontPreview } from './FontPreview'
import { useFonts } from '@/hooks/useFonts'
import { Loading } from '@/components/ui/Loading'

interface FontListProps {
  onUseFont?: (font: Font) => void
}

export const FontList = ({ onUseFont }: FontListProps) => {
  const { fonts, loading, deleteFont } = useFonts()
  const [previewFont, setPreviewFont] = useState<Font | null>(null)

  const handleDelete = async (fontId: string) => {
    if (confirm('Are you sure you want to delete this font?')) {
      await deleteFont(fontId)
    }
  }

  if (loading) {
    return <Loading text="Loading fonts..." />
  }

  if (fonts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No fonts uploaded yet. Upload your first font to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fonts.map((font) => (
          <FontCard
            key={font.id}
            font={font}
            onDelete={handleDelete}
            onPreview={setPreviewFont}
            onUse={onUseFont}
          />
        ))}
      </div>

      <Modal
        isOpen={!!previewFont}
        onClose={() => setPreviewFont(null)}
        title="Font Preview"
        size="lg"
      >
        {previewFont && <FontPreview font={previewFont} />}
      </Modal>
    </>
  )
}
