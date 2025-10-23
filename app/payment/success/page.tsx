'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export const dynamic = 'force-dynamic'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle size={64} className="text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-600">
              Your account has been activated
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold mb-2">
              ✅ You now have full access!
            </p>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>✓ Unlimited project creation</li>
              <li>✓ All handwriting fonts unlocked</li>
              <li>✓ Multi-page PDF support</li>
              <li>✓ Full customization tools</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full py-4 text-lg font-semibold"
          >
            Go to Dashboard
            <ArrowRight size={20} className="ml-2" />
          </Button>

          {/* Auto Redirect Info */}
          <p className="text-sm text-gray-500">
            Auto-redirecting in {countdown} seconds...
          </p>
        </div>

        {/* Support Link */}
        <p className="mt-6 text-sm text-gray-600">
          Need help?{' '}
          <Link href="/support" className="text-primary-600 hover:underline font-semibold">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
