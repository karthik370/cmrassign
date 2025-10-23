'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: () => void
}

export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="text-green-600" size={24} />,
    error: <XCircle className="text-red-600" size={24} />,
    warning: <AlertCircle className="text-yellow-600" size={24} />,
    info: <AlertCircle className="text-blue-600" size={24} />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg',
        'transition-all duration-300',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full',
        bgColors[type]
      )}
    >
      {icons[type]}
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  )
}

// Toast Container Component
export const ToastContainer = () => {
  return <div id="toast-container" className="fixed top-4 right-4 z-50" />
}
