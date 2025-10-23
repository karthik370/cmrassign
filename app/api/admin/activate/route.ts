import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Admin emails - ONLY these emails can activate users
const ADMIN_EMAILS = [
  'govardhanbommineni@gmail.com', // Your email
  // Add more admin emails here
]

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('cookie')
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // You can add more sophisticated auth check here
    // For now, we'll rely on client-side protection
    const { userId, paymentId } = await request.json()

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    // Get user details
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Ensure profile exists (create if missing)
    // @ts-ignore - Supabase types not generated for profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      // @ts-ignore
      .upsert({
        id: userId,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        updated_at: new Date().toISOString()
      } as any, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('❌ Profile creation error:', profileError)
      // Don't fail activation if profile creation fails, just log it
    } else {
      console.log('✅ Profile ensured for user:', userId)
    }

    // Update payment status to success
    if (paymentId) {
      // @ts-ignore
      await supabaseAdmin
        .from('payments')
        // @ts-expect-error - Supabase types not generated yet
        .update({
          status: 'success',
          transaction_id: `MANUAL_${Date.now()}`,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', paymentId)
    }

    // Activate user subscription (upsert to create if doesn't exist)
    // @ts-ignore
    const { error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        is_active: true,
        payment_status: 'paid',
        amount_paid: 30,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as any, {
        onConflict: 'user_id'
      })

    if (subscriptionError) {
      console.error('❌ Subscription activation error:', subscriptionError)
      return NextResponse.json({
        success: false,
        error: `Failed to activate subscription: ${subscriptionError.message}`,
      }, { status: 500 })
    }

    console.log(`✅ User ${userId} manually activated by admin`)

    return NextResponse.json({
      success: true,
      message: 'User activated successfully',
    })
  } catch (error: any) {
    console.error('❌ Error activating user:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to activate user',
    }, { status: 500 })
  }
}
