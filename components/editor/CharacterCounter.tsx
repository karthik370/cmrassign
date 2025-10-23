'use client'

import { Hash } from 'lucide-react'
import { TextBlock } from '@/types/project'

interface CharacterCounterProps {
  textBlocks: TextBlock[]
}

export const CharacterCounter = ({ textBlocks }: CharacterCounterProps) => {
  const totalCharacters = textBlocks.reduce(
    (sum, block) => sum + block.text.length,
    0
  )

  const filledFields = textBlocks.filter((block) => block.text.length > 0).length
  const totalFields = textBlocks.length

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Hash size={16} />
        Statistics
      </h3>
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Total Characters:</span>
          <span className="font-medium">{totalCharacters}</span>
        </div>
        <div className="flex justify-between">
          <span>Filled Fields:</span>
          <span className="font-medium">
            {filledFields} / {totalFields}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${(filledFields / totalFields) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
