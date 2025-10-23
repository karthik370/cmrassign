'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const SignupForm = () => {
  const router = useRouter()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    const result = await signUp(email, password, fullName)

    if (result.success) {
      setSuccess(true)
      // Don't redirect - user needs to verify email first
      // Only redirect if email confirmation is NOT required (instant login)
      if (!result.needsEmailConfirmation) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } else {
      setError(result.error || 'Failed to sign up')
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-6 py-5 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Account Created Successfully!</h3>
              <p className="text-sm mb-3">
                We've sent a verification email to <strong>{email}</strong>
              </p>
              <div className="bg-green-100 border border-green-300 rounded p-3 text-sm">
                <p className="font-semibold mb-1">📧 Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Check your email inbox</li>
                  <li>Click the verification link</li>
                  <li>You'll be redirected to your dashboard</li>
                </ol>
              </div>
              <p className="text-xs mt-3 text-green-700">
                💡 Didn't receive the email? Check your spam folder or{' '}
                <Link href="/auth/signup" className="underline font-semibold">
                  try again
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
