import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for all possible Supabase cookie variations
  const allCookies = request.cookies.getAll()
  const supabaseCookies = allCookies.filter(cookie => cookie.name.includes('sb-'))
  
  console.log('Middleware - Path:', request.nextUrl.pathname)
  console.log('Supabase cookies found:', supabaseCookies.map(c => c.name))
  
  // Check for auth token in various possible cookie names
  const hasSession = allCookies.some(cookie => 
    cookie.name.includes('auth-token') || 
    cookie.name.includes('access-token') ||
    cookie.name.includes('session')
  )
  
  console.log('Has session:', hasSession)

  // For now, allow all access - let client-side handle auth
  // This is a temporary fix while we debug cookies
  return NextResponse.next()
  
  /* Original logic - commented out for debugging
  // Protected routes
  const protectedRoutes = ['/dashboard', '/fonts', '/projects', '/instructions']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !hasSession) {
    console.log('Middleware - Redirecting to login (no session)')
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (
    hasSession &&
    (request.nextUrl.pathname.startsWith('/auth/login') ||
      request.nextUrl.pathname.startsWith('/auth/signup'))
  ) {
    console.log('Middleware - Redirecting to dashboard (has session)')
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }
  */
}

export const config = {
  matcher: ['/dashboard/:path*', '/fonts/:path*', '/projects/:path*', '/auth/:path*', '/instructions/:path*'],
}
