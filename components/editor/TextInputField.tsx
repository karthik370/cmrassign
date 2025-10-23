'use client'

import { useState, useEffect } from 'react'
import { TextBlock } from '@/types/project'
import { cn } from '@/lib/utils'

interface TextInputFieldProps {
  textBlock: TextBlock
  fontFamily: string
  maxCharacters?: number
  onChange: (textBlock: TextBlock) => void
}

export const TextInputField = ({
  textBlock,
  fontFamily,
  maxCharacters = 100,
  onChange,
}: TextInputFieldProps) => {
  const [text, setText] = useState(textBlock.text)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setText(textBlock.text)
  }, [textBlock.text])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    if (newText.length <= maxCharacters) {
      setText(newText)
      onChange({ ...textBlock, text: newText })
    }
  }

  const remainingChars = maxCharacters - text.length
  const isNearLimit = remainingChars < 10

  return (
    <div
      className="relative"
      style={{
        position: 'absolute',
        left: `${textBlock.x}px`,
        top: `${textBlock.y}px`,
        width: `${textBlock.width}px`,
        height: `${textBlock.height}px`,
      }}
    >
      {/* Lined paper background */}
      <div className="absolute inset-0 border-b-2 border-gray-400" />
      
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          fontFamily: fontFamily,
          fontSize: `${textBlock.fontSize}px`,
          color: textBlock.color === 'blue' ? '#000080' : '#000000',
          lineHeight: `${textBlock.height}px`,
        }}
        className={cn(
          'w-full h-full bg-transparent outline-none px-2',
          isFocused ? 'bg-blue-50 bg-opacity-20' : '',
          'placeholder:text-gray-400 placeholder:italic'
        )}
        placeholder="Paste or type your text here..."
      />
      {isFocused && (
        <div
          className={cn(
            'absolute -bottom-6 right-0 text-xs px-2 py-1 rounded shadow-sm',
            isNearLimit ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
          )}
        >
          {text.length} / {maxCharacters}
        </div>
      )}
    </div>
  )
}
