'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePayment } from '@/hooks/usePayment'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Check, Zap, Shield, Lock, Smartphone, QrCode, Copy, Sparkles, FileText, Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function PaymentPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { hasAccess, loading: paymentLoading, initiatePayment } = usePayment()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [utrNumber, setUtrNumber] = useState('')
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/payment')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!paymentLoading && hasAccess) {
      router.push('/dashboard')
    }
  }, [hasAccess, paymentLoading, router])

  const handleShowQR = () => {
    setShowQR(true)
  }

  const handleSubmitUTR = async () => {
    if (!utrNumber || utrNumber.length < 10) {
      setError('Please enter a valid UTR/Transaction ID (minimum 10 characters)')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Track payment with UTR
      const response = await fetch('/api/payment/upi-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utrNumber: utrNumber.trim(),
          amount: 30,
          userEmail: user?.email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentSubmitted(true)
      } else {
        throw new Error(data.error || 'Failed to submit payment')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to submit payment proof')
    } finally {
      setIsProcessing(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            One-Time Payment
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Full Access
          </h1>
          <p className="text-xl text-gray-600">
            Start creating unlimited handwritten PDFs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pricing Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-sm font-semibold">
              Best Value
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">₹30</span>
                <span className="text-gray-500">one-time</span>
              </div>
              <p className="text-gray-600">Lifetime access • No subscription</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Unlimited Projects</p>
                  <p className="text-sm text-gray-600">Create as many PDFs as you want</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">All Handwriting Fonts</p>
                  <p className="text-sm text-gray-600">Access to entire font library</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Multi-Page Support</p>
                  <p className="text-sm text-gray-600">Generate PDFs with unlimited pages</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Customization Tools</p>
                  <p className="text-sm text-gray-600">Colors, sizes, spacing & more</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Instant Download</p>
                  <p className="text-sm text-gray-600">Download PDFs immediately</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {paymentSubmitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <Check className="mx-auto text-green-600 mb-3" size={48} />
                <h3 className="text-xl font-bold text-green-900 mb-2">Payment Submitted!</h3>
                <p className="text-green-700 mb-4">
                  Your payment proof has been submitted successfully.
                </p>
                <div className="bg-green-100 border border-green-300 rounded p-3 text-sm text-green-800">
                  <p className="font-semibold mb-1">⏱️ Next Steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-left ml-2">
                    <li>Admin will verify your payment</li>
                    <li>Activation within 1 hour</li>
                    <li>You'll get email notification</li>
                    <li>Refresh page to check status</li>
                  </ul>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 w-full"
                >
                  Refresh Page
                </Button>
              </div>
            ) : !showQR ? (
              <Button
                onClick={handleShowQR}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Smartphone size={20} className="mr-2" />
                Pay ₹30 via UPI
              </Button>
            ) : (
              <div className="space-y-4">
                {/* UPI QR Code */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-500 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <QrCode className="text-green-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">Scan QR Code</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 inline-block mb-4">
                    <Image
                      src="/upi-qr.jpg"
                      alt="UPI QR Code"
                      width={250}
                      height={250}
                      className="rounded-lg"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    Scan with any UPI app:
                  </p>
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
                    <span>📱 PhonePe</span>
                    <span>•</span>
                    <span>📱 Google Pay</span>
                    <span>•</span>
                    <span>📱 Paytm</span>
                  </div>
                </div>

                {/* UTR Submission */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 mb-3">After Payment:</p>
                  
                  <Input
                    label="UTR / Transaction ID"
                    placeholder="Enter 12-digit UTR number"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    disabled={isProcessing}
                  />
                  
                  <p className="text-xs text-blue-700 mt-2 mb-3">
                    💡 Find UTR in your UPI app payment history
                  </p>
                  
                  <Button
                    onClick={handleSubmitUTR}
                    className="w-full"
                    isLoading={isProcessing}
                    disabled={isProcessing || !utrNumber}
                  >
                    {isProcessing ? 'Submitting...' : 'Submit Payment Proof'}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield size={14} />
              <span>100% Secure UPI Payment</span>
            </div>
          </div>

          {/* Features Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Pay?</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start gap-2">
                  <Zap className="text-yellow-500 flex-shrink-0 mt-1" size={18} />
                  <span>Instant activation - start creating immediately</span>
                </p>
                <p className="flex items-start gap-2">
                  <FileText className="text-blue-500 flex-shrink-0 mt-1" size={18} />
                  <span>Professional handwriting fonts</span>
                </p>
                <p className="flex items-start gap-2">
                  <Download className="text-green-500 flex-shrink-0 mt-1" size={18} />
                  <span>No watermarks or limitations</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">✨ Money-Back Guarantee</h3>
              <p className="text-gray-700 text-sm">
                Not satisfied? Contact us within 7 days for a full refund. No questions asked!
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/dashboard" 
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                ← Back to dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted payment methods</p>
          <div className="flex items-center justify-center gap-6 flex-wrap opacity-60">
            <span className="text-2xl font-bold text-blue-600">Instamojo</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">UPI</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">Cards</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">Net Banking</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">Wallets</span>
          </div>
        </div>
      </div>
    </div>
  )
}
