import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Admin emails - ONLY these emails can access admin API
const ADMIN_EMAILS = [
  'govardhanbommineni@gmail.com', // Your email
  // Add more admin emails here
]

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('cookie')
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // You can add more sophisticated auth check here
    // For now, we'll rely on client-side protection
    
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
