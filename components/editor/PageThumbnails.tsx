'use client'

import { FileText, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageThumbnailsProps {
  totalPages: number
  currentPage: number
  filledPages: number[]
  onPageSelect: (page: number) => void
}

export const PageThumbnails = ({
  totalPages,
  currentPage,
  filledPages,
  onPageSelect,
}: PageThumbnailsProps) => {
  return (
    <div className="w-48 bg-white border-r h-full overflow-y-auto p-3">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Pages</h3>
      <div className="space-y-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage
          const isFilled = filledPages.includes(pageNum)

          return (
            <button
              key={pageNum}
              onClick={() => onPageSelect(pageNum)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-100 border-2 border-primary-500'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              )}
            >
              <FileText
                size={18}
                className={isActive ? 'text-primary-600' : 'text-gray-500'}
              />
              <span
                className={cn(
                  'text-sm font-medium flex-1 text-left',
                  isActive ? 'text-primary-700' : 'text-gray-700'
                )}
              >
                Page {pageNum}
              </span>
              {isFilled && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
