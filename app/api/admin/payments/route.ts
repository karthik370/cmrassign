import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Admin emails - ONLY these emails can access admin API
const ADMIN_EMAILS = [
  'govardhanbommineni@gmail.com', // Your email
  // Add more admin emails here
]

export async function GET(request: NextRequest) {
  try {
    // Get session from cookies
    const cookieHeader = request.headers.get('cookie') || ''
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    // Try to get admin user from session
    let adminUser = null
    const accessToken = cookies['sb-access-token'] || cookies['supabase-access-token']
    
    if (accessToken) {
      const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(accessToken)
      adminUser = authUser
    }

    // Check if user is admin
    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email || '')) {
      console.log('❌ Admin access denied for:', adminUser?.email || 'no user')
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access only' }, { status: 401 })
    }

    console.log('✅ Admin access granted for:', adminUser.email)
    
    // Get all payments
    // @ts-ignore
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({
        success: true,
        payments: [],
      })
    }

    // Get user IDs
    const userIds = payments.map((p: any) => p.user_id)
    
    // Fetch users from auth.users
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    // Create user map
    const userMap = new Map()
    users?.forEach((user: any) => {
      userMap.set(user.id, {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      })
    })
    
    // Get user subscriptions
    // @ts-ignore
    const { data: subscriptions } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .in('user_id', userIds)

    const subscriptionMap = new Map()
    subscriptions?.forEach((sub: any) => {
      subscriptionMap.set(sub.user_id, sub)
    })

    // Combine all data
    const paymentsWithStatus = payments.map((payment: any) => ({
      ...payment,
      user: userMap.get(payment.user_id) || { id: payment.user_id, email: 'Unknown' },
      subscription: subscriptionMap.get(payment.user_id)
    }))

    return NextResponse.json({
      success: true,
      payments: paymentsWithStatus,
    })
  } catch (error: any) {
    console.error('❌ Error in admin payments:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 })
  }
}
