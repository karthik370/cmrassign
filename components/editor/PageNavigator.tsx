'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PageNavigatorProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PageNavigator = ({
  currentPage,
  totalPages,
  onPageChange,
}: PageNavigatorProps) => {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-center gap-4 bg-white border-t px-4 py-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <ChevronLeft size={18} />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Page</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = Number(e.target.value)
            if (page >= 1 && page <= totalPages) {
              onPageChange(page)
            }
          }}
          className="w-16 px-2 py-1 border rounded text-center"
        />
        <span className="text-sm text-gray-600">of {totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        Next
        <ChevronRight size={18} />
      </Button>
    </div>
  )
}
