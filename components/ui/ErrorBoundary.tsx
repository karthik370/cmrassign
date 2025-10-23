'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="mx-auto text-red-600 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 rounded p-3 mb-6 text-left">
                <code className="text-xs text-red-600">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
