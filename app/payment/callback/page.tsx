'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get('payment_id')
      const paymentRequestId = searchParams.get('payment_request_id')
      const paymentStatus = searchParams.get('payment_status')

      if (!paymentId || paymentStatus !== 'Credit') {
        router.push('/payment/failed')
        return
      }

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_id: paymentId,
            payment_request_id: paymentRequestId,
          }),
        })

        const data = await response.json()

        if (data.success && data.verified) {
          router.push('/payment/success')
        } else {
          router.push('/payment/failed')
        }
      } catch (err: any) {
        console.error('Verification error:', err)
        setError('Failed to verify payment')
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/payment')}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8">
        <Loader2 className="animate-spin h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verifying Payment...
        </h1>
        <p className="text-gray-600">
          Please wait while we confirm your payment.
        </p>
      </div>
    </div>
  )
}
