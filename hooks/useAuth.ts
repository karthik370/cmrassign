'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Supabase auth error:', error)
        
        // Provide better error messages
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before signing in. Check your inbox for the verification link.')
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.')
        }
        
        throw error
      }

      console.log('Auth successful:', data)
      return { success: true, data }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Check if email confirmation is required
      const needsEmailConfirmation = data.user && !data.session

      return { 
        success: true, 
        data,
        needsEmailConfirmation 
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/auth/login')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
