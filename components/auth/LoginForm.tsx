'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const LoginForm = () => {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('Attempting sign in...')
      const result = await signIn(email, password)
      console.log('Sign in result:', result)

      if (result.success) {
        console.log('Sign in successful, redirecting to dashboard...')
        // Small delay to ensure session is set, then hard redirect
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 500)
      } else {
        console.error('Sign in failed:', result.error)
        setError(result.error || 'Failed to sign in')
      }
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message || 'An unexpected error occurred')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary-600 hover:underline block"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  )
}
