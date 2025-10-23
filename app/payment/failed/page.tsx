'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  const getErrorMessage = () => {
    switch (reason) {
      case 'invalid':
        return 'Payment verification failed. Invalid checksum.'
      case 'notfound':
        return 'Payment record not found in our system.'
      case 'error':
        return 'An error occurred while processing your payment.'
      default:
        return 'Your payment was not successful. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Failed Icon */}
          <div className="flex justify-center">
            <div className="bg-red-100 rounded-full p-6">
              <XCircle size={64} className="text-red-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600">
              {getErrorMessage()}
            </p>
          </div>

          {/* Error Info */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold mb-2">
              ⚠️ Don't worry!
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• No money has been deducted</li>
              <li>• You can try payment again</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/payment')}
              className="w-full py-4 text-lg font-semibold"
            >
              <RefreshCcw size={20} className="mr-2" />
              Try Again
            </Button>

            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full py-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-6 text-sm text-gray-600">
          Payment issues?{' '}
          <Link href="/support" className="text-primary-600 hover:underline font-semibold">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
