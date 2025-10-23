'use client'

import { Space } from 'lucide-react'

interface LetterSpacingControlProps {
  letterSpacing: number
  onChange: (spacing: number) => void
}

export const LetterSpacingControl = ({ letterSpacing, onChange }: LetterSpacingControlProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <Space size={16} className="inline mr-1" />
          Letter Spacing
        </label>
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {letterSpacing}px
        </span>
      </div>
      
      {/* Slider */}
      <div>
        <input
          type="range"
          min="-2"
          max="8"
          step="0.5"
          value={letterSpacing}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Tight</span>
          <span>Normal</span>
          <span>Wide</span>
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-xs text-gray-600 mb-1">Preview:</div>
        <div 
          className="text-lg font-medium text-gray-900"
          style={{ letterSpacing: `${letterSpacing}px` }}
        >
          Handwriting Text
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onChange(-1)}
          className={`px-2 py-1.5 text-xs rounded border-2 transition-all ${
            letterSpacing === -1
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          Tight
        </button>
        <button
          onClick={() => onChange(0)}
          className={`px-2 py-1.5 text-xs rounded border-2 transition-all ${
            letterSpacing === 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => onChange(2)}
          className={`px-2 py-1.5 text-xs rounded border-2 transition-all ${
            letterSpacing === 2
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          Wide
        </button>
      </div>
    </div>
  )
}
