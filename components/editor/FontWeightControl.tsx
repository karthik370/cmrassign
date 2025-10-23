'use client'

import { Type } from 'lucide-react'

interface FontWeightControlProps {
  fontWeight: number
  onChange: (weight: number) => void
}

export const FontWeightControl = ({ fontWeight, onChange }: FontWeightControlProps) => {
  const weights = [
    { value: 300, label: 'Light', description: 'Thin' },
    { value: 400, label: 'Regular', description: 'Normal' },
    { value: 500, label: 'Medium', description: 'Moderate' },
    { value: 600, label: 'Semi-Bold', description: 'Thick' },
    { value: 700, label: 'Bold', description: 'Extra Thick' },
  ]

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <Type size={16} className="inline mr-1" />
        Font Thickness
      </label>
      
      {/* Slider */}
      <div>
        <input
          type="range"
          min="300"
          max="700"
          step="100"
          value={fontWeight}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Light</span>
          <span className="font-medium">{weights.find(w => w.value === fontWeight)?.label || 'Regular'}</span>
          <span>Bold</span>
        </div>
      </div>

      {/* Weight Options */}
      <div className="grid grid-cols-1 gap-2">
        {weights.map((weight) => (
          <button
            key={weight.value}
            onClick={() => onChange(weight.value)}
            className={`px-3 py-2 rounded-lg border-2 transition-all text-left ${
              fontWeight === weight.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="text-sm font-medium text-gray-900"
                  style={{ fontWeight: weight.value }}
                >
                  {weight.label}
                </div>
                <div className="text-xs text-gray-500">{weight.description}</div>
              </div>
              <div 
                className="text-lg"
                style={{ fontWeight: weight.value }}
              >
                Aa
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
