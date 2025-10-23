'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

export const usePayment = () => {
  const { user } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (user) {
      checkPaymentStatus()
      
      // Poll payment status every 10 seconds to detect admin activations
      const interval = setInterval(() => {
        checkPaymentStatus()
      }, 10000) // Check every 10 seconds
      
      return () => clearInterval(interval)
    } else {
      setLoading(false)
      setHasAccess(false)
    }
  }, [user])

  const checkPaymentStatus = async () => {
    try {
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      const response = await fetch('/api/payment/status', {
        headers: {
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setHasAccess(data.hasAccess)
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Failed to check payment status:', error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  const initiatePayment = async () => {
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      })

      const data = await response.json()
      console.log('Payment initiate response:', data)

      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate payment')
      }

      console.log('Payment URL from API:', data.paymentUrl)
      return data
    } catch (error: any) {
      console.error('Payment initiation error:', error)
      throw error
    }
  }

  const verifyPayment = async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        }),
      })

      const data = await response.json()
      
      if (data.success && data.verified) {
        // Refresh payment status
        await checkPaymentStatus()
      }

      return data
    } catch (error: any) {
      console.error('Payment verification error:', error)
      throw error
    }
  }

  return {
    hasAccess,
    loading,
    subscription,
    initiatePayment,
    verifyPayment,
    checkPaymentStatus,
  }
}
