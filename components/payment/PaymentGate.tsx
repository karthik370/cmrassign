'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePayment } from '@/hooks/usePayment'
import { useAuth } from '@/hooks/useAuth'
import { Lock, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface PaymentGateProps {
  children: React.ReactNode
  showPrompt?: boolean // If true, shows upgrade prompt instead of blocking
}

export const PaymentGate = ({ children, showPrompt = false }: PaymentGateProps) => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { hasAccess, loading: paymentLoading } = usePayment()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Show loading state
  if (authLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user has access, show content
  if (hasAccess) {
    return <>{children}</>
  }

  // If showPrompt is true, show inline prompt
  if (showPrompt) {
    return (
      <>
        {children}
        <UpgradePrompt />
      </>
    )
  }

  // Otherwise, show full-page payment required screen
  return <PaymentRequiredScreen />
}

// Full-page payment required screen
const PaymentRequiredScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 space-y-6">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="bg-primary-100 rounded-full p-6">
              <Lock size={64} className="text-primary-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Feature
            </h1>
            <p className="text-xl text-gray-600">
              Unlock full access to create unlimited handwritten PDFs
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 my-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-left">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold text-gray-900 mb-1">Unlimited Projects</h3>
              <p className="text-sm text-gray-600">Create as many PDFs as you need</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 text-left">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-1">All Fonts</h3>
              <p className="text-sm text-gray-600">Access entire handwriting collection</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 text-left">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-1">Instant Access</h3>
              <p className="text-sm text-gray-600">Start creating immediately</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 text-left">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-1">One-Time Payment</h3>
              <p className="text-sm text-gray-600">Pay once, use forever</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm opacity-90 mb-1">One-time payment</p>
                <p className="text-4xl font-bold">₹30</p>
                <p className="text-sm opacity-90 mt-1">Lifetime access • No subscription</p>
              </div>
              <Zap size={48} className="opacity-80" />
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/payment">
            <Button className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700">
              Unlock Full Access
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>

          {/* Back Link */}
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 underline">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

// Inline upgrade prompt (for showPrompt mode)
const UpgradePrompt = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lock size={24} />
          <div>
            <p className="font-semibold">Upgrade to unlock full features</p>
            <p className="text-sm opacity-90">One-time payment of ₹30 for lifetime access</p>
          </div>
        </div>
        <Link href="/payment">
          <Button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold whitespace-nowrap">
            Upgrade Now
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
