import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Admin emails - ONLY these emails can access admin API
const ADMIN_EMAILS = [
  'govardhanbommineni@gmail.com', // Your email
  // Add more admin emails here
]

export async function GET(request: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header')
      return NextResponse.json({ success: false, error: 'Unauthorized - No token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify user with token
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)

    console.log('🔍 Admin check - User:', adminUser?.email || 'no user')

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
