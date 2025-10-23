import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle error from Supabase
  if (error) {
    console.error('❌ Email verification error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  // Handle successful verification
  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('❌ Session exchange error:', exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      console.log('✅ Email verified successfully!')
      // Redirect to dashboard after successful verification
      return NextResponse.redirect(new URL('/dashboard?verified=true', request.url))
    } catch (error: any) {
      console.error('❌ Callback error:', error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
