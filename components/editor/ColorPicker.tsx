'use client'

import { Pen } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InkColor = 'black' | 'blue-dark' | 'night-blue' | 'pure-blue' | 'dodger-blue' | 'blueberry-blue' | 'royal-blue' | 'cornflower-blue' | 'midnight-navy' | 'ocean-blue' | 'sapphire-blue' | 'cobalt-blue' | 'marine-blue'

interface ColorPickerProps {
  selectedColor: InkColor
  onChange: (color: InkColor) => void
}

export const ColorPicker = ({ selectedColor, onChange }: ColorPickerProps) => {
  const colors: Array<{ value: InkColor; label: string; hex: string; description: string }> = [
    { value: 'black', label: 'Black', hex: '#1a1a1a', description: 'Classic' },
    { value: 'blue-dark', label: 'Navy Blue', hex: '#1e3a8a', description: 'Ballpoint' },
    { value: 'night-blue', label: 'Night Blue', hex: '#151B54', description: 'Deep' },
    { value: 'pure-blue', label: 'Blue', hex: '#0000FF', description: 'Vibrant' },
    { value: 'dodger-blue', label: 'Dodger Blue', hex: '#1E90FF', description: 'Bright' },
    { value: 'blueberry-blue', label: 'Blueberry', hex: '#0041C2', description: 'Rich' },
    { value: 'royal-blue', label: 'Royal Blue', hex: '#4169E1', description: 'Classic' },
    { value: 'cornflower-blue', label: 'Cornflower', hex: '#6695ED', description: 'Soft' },
    { value: 'midnight-navy', label: 'Midnight Navy', hex: '#284283', description: 'RGB' },
    { value: 'ocean-blue', label: 'Ocean Blue', hex: '#3E66A3', description: 'RGB' },
    { value: 'sapphire-blue', label: 'Sapphire', hex: '#2D5DAF', description: 'RGB' },
    { value: 'cobalt-blue', label: 'Cobalt', hex: '#305CDE', description: 'RGB' },
    { value: 'marine-blue', label: 'Marine Blue', hex: '#003399', description: 'RGB' },
  ]

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <Pen size={16} className="inline mr-1" />
        Ink Color
      </label>
      <div className="grid grid-cols-2 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={cn(
              'px-3 py-2.5 rounded-lg border-2 transition-all text-left',
              selectedColor === color.value
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{color.label}</div>
                <div className="text-xs text-gray-500">{color.description}</div>
              </div>
              {selectedColor === color.value && (
                <span className="text-primary-600 text-lg">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
