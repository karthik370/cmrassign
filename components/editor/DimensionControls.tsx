import React from 'react'
import { PageDimensions } from '@/types/project'

interface DimensionControlsProps {
  dimensions: PageDimensions
  onChange: (dimensions: PageDimensions) => void
}

const DEFAULT_DIMENSIONS: PageDimensions = {
  lineBoxHeight: 30.5,
  lineSpacing: 23,
  marginLeft: 40,
  marginRight: -125,
  marginTop: 93,
}

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  dimensions,
  onChange,
}) => {
  const handleChange = (field: keyof PageDimensions, value: number) => {
    onChange({
      ...dimensions,
      [field]: value,
    })
  }

  const resetToDefaults = () => {
    onChange(DEFAULT_DIMENSIONS)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Page Dimensions</h3>
        <button
          onClick={resetToDefaults}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Reset to Default
        </button>
      </div>

      {/* Line Box Height */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Line Box Height: {dimensions.lineBoxHeight}px
        </label>
        <input
          type="range"
          min="20"
          max="50"
          step="0.5"
          value={dimensions.lineBoxHeight}
          onChange={(e) => handleChange('lineBoxHeight', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>20px</span>
          <span>50px</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-gray-700">
            Line Spacing: {dimensions.lineSpacing}px
          </label>
          <input
            type="number"
            min="10"
            max="40"
            step="0.1"
            value={dimensions.lineSpacing}
            onChange={(e) => handleChange('lineSpacing', parseFloat(e.target.value))}
            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
          />
        </div>
        <input
          type="range"
          min="10"
          max="40"
          step="0.1"
          value={dimensions.lineSpacing}
          onChange={(e) => handleChange('lineSpacing', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>10px</span>
          <span>40px</span>
        </div>
      </div>

      {/* Margin Left */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Left Margin: {dimensions.marginLeft}px
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={dimensions.marginLeft}
          onChange={(e) => handleChange('marginLeft', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>0px</span>
          <span>100px</span>
        </div>
      </div>

      {/* Margin Right */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Right Margin: {dimensions.marginRight}px
        </label>
        <input
          type="range"
          min="-800"
          max="100"
          step="5"
          value={dimensions.marginRight}
          onChange={(e) => handleChange('marginRight', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>-800px</span>
          <span>100px</span>
        </div>
      </div>

      {/* Margin Top */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Top Margin: {dimensions.marginTop}px
        </label>
        <input
          type="range"
          min="40"
          max="150"
          step="1"
          value={dimensions.marginTop}
          onChange={(e) => handleChange('marginTop', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>40px</span>
          <span>150px</span>
        </div>
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        💡 Changes apply to <strong>this page only</strong> and save automatically
      </div>
    </div>
  )
}
