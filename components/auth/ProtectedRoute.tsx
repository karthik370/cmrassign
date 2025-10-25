'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from '@/components/ui/Loading'
import { Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    console.log('ProtectedRoute: loading=', loading, 'user=', user)
    if (!loading && !user) {
      console.log('No user, redirecting to login')
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleResendEmail = async () => {
    if (!user?.email) return
    
    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      })
      
      if (error) throw error
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch (error) {
      console.error('Error resending email:', error)
      alert('Failed to resend verification email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  if (loading && !user) {
    // Only show loading if we don't have cached user data
    console.log('ProtectedRoute: Loading...')
    return <Loading fullScreen text="Loading..." />
  }

  if (!user) {
    console.log('ProtectedRoute: No user found')
    return null
  }

  // Check if email is verified
  const emailVerified = user.email_confirmed_at || user.confirmed_at
  
  if (!emailVerified) {
    console.log('ProtectedRoute: Email not verified')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Mail size={48} className="text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verify Your Email
          </h1>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification email to:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-900">{user.email}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-blue-900 mb-2">📧 Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Refresh this page or login again</li>
            </ol>
          </div>
          
          <div className="space-y-3">
            {resent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✅ Verification email sent! Check your inbox.
              </div>
            ) : (
              <Button
                onClick={handleResendEmail}
                isLoading={resending}
                variant="outline"
                className="w-full"
              >
                <RefreshCw size={16} className="mr-2" />
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            )}
            
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              I've Verified - Refresh Page
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">
            💡 Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    )
  }

  console.log('ProtectedRoute: User authenticated and verified, rendering children')
  return <>{children}</>
}
