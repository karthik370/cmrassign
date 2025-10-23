'use client'

import { Type } from 'lucide-react'

interface FontSizeControlProps {
  fontSize: number
  onChange: (size: number) => void
}

export const FontSizeControl = ({ fontSize, onChange }: FontSizeControlProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <Type size={16} className="inline mr-1" />
        Font Size: {fontSize}pt
      </label>
      <input
        type="range"
        min="10"
        max="40"
        value={fontSize}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>10pt</span>
        <span>25pt</span>
        <span>40pt</span>
      </div>
    </div>
  )
}
