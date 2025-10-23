# 🔒 Payment Integration Examples

## How to Protect Routes with Payment Gate

### Example 1: Protect Entire Dashboard

```tsx
// app/dashboard/page.tsx
import { PaymentGate } from '@/components/payment/PaymentGate'

export default function DashboardPage() {
  return (
    <PaymentGate>
      <div>
        {/* Your dashboard content */}
        <h1>Dashboard</h1>
        <ProjectList />
      </div>
    </PaymentGate>
  )
}
```

### Example 2: Protect Project Creation

```tsx
// app/projects/new/page.tsx
import { PaymentGate } from '@/components/payment/PaymentGate'
import { ProjectCreationForm } from '@/components/projects/ProjectCreationForm'

export default function NewProjectPage() {
  return (
    <PaymentGate>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
        <ProjectCreationForm />
      </div>
    </PaymentGate>
  )
}
```

### Example 3: Protect API Route

```tsx
// app/api/projects/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ CHECK PAYMENT STATUS
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('is_active')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.is_active) {
      return NextResponse.json({ 
        error: 'Payment required',
        message: 'Please upgrade to create projects',
        requiresPayment: true
      }, { status: 402 }) // 402 Payment Required
    }

    // ... rest of project creation logic
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### Example 4: Show Upgrade Prompt (Partial Block)

```tsx
// components/ProjectList.tsx
import { PaymentGate } from '@/components/payment/PaymentGate'

export function ProjectList() {
  return (
    <PaymentGate showPrompt={true}>
      <div>
        <h2>Your Projects</h2>
        {/* Show limited content */}
        <p>Upgrade to create unlimited projects</p>
        {/* Upgrade banner shows at bottom */}
      </div>
    </PaymentGate>
  )
}
```

### Example 5: Conditional Feature Display

```tsx
'use client'

import { usePayment } from '@/hooks/usePayment'
import { Lock } from 'lucide-react'
import Link from 'next/link'

export function FeatureCard({ feature }: { feature: string }) {
  const { hasAccess, loading } = usePayment()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none">
          <p>{feature}</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Link href="/payment">
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <Lock size={20} />
              Unlock Feature
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p>{feature}</p>
      {/* Full feature access */}
    </div>
  )
}
```

### Example 6: Client-Side Payment Check

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePayment } from '@/hooks/usePayment'

export function ProtectedComponent() {
  const router = useRouter()
  const { hasAccess, loading } = usePayment()

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.push('/payment')
    }
  }, [hasAccess, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return null // Will redirect
  }

  return (
    <div>
      {/* Protected content */}
    </div>
  )
}
```

### Example 7: Handle Payment in Create Project Button

```tsx
'use client'

import { useState } from 'react'
import { usePayment } from '@/hooks/usePayment'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function CreateProjectButton() {
  const router = useRouter()
  const { hasAccess, loading } = usePayment()
  const [isCreating, setIsCreating] = useState(false)

  const handleClick = () => {
    if (!hasAccess) {
      router.push('/payment')
      return
    }

    // Create project logic
    setIsCreating(true)
    // ... create project
  }

  return (
    <Button 
      onClick={handleClick}
      isLoading={isCreating}
      disabled={loading}
    >
      {!hasAccess && <span>🔒</span>}
      Create Project
    </Button>
  )
}
```

### Example 8: Middleware Protection (Optional)

```tsx
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if route requires payment
  const protectedRoutes = ['/projects/new', '/editor']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Check payment status
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('is_active')
      .eq('user_id', session.user.id)
      .single()

    if (!subscription?.is_active) {
      return NextResponse.redirect(new URL('/payment', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/projects/:path*', '/editor/:path*'],
}
```

---

## 🎯 Quick Integration Checklist

### To protect project creation:

1. ✅ Run SQL script in Supabase
2. ✅ Add environment variables
3. ✅ Wrap `/projects/new` page with `<PaymentGate>`
4. ✅ Add payment check in project creation API
5. ✅ Test the flow

### Minimal Example:

```tsx
// Just wrap your page/component
import { PaymentGate } from '@/components/payment/PaymentGate'

export default function Page() {
  return (
    <PaymentGate>
      {/* Your content */}
    </PaymentGate>
  )
}
```

That's it! The PaymentGate component handles:
- ✅ Loading states
- ✅ Authentication check
- ✅ Payment status check
- ✅ Redirect to payment if needed
- ✅ Show content if paid

---

## 📝 Notes

- Use `<PaymentGate>` for full-page protection
- Use `<PaymentGate showPrompt={true}>` for partial blocking with upgrade banner
- Use `usePayment()` hook for programmatic checks
- Add server-side checks in API routes for security
- Always verify payment status server-side before allowing critical operations

---

**Choose the approach that best fits your needs!** 🚀
