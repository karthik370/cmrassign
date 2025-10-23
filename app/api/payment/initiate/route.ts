import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const INSTAMOJO_PAYMENT_LINK = 'https://imjo.in/EtFATy' // Update this with new link if you create one

export async function POST(request: NextRequest) {
  try {
    // Get authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has active subscription
    // @ts-ignore - Supabase types not generated yet
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if ((subscription as any)?.is_active) {
      return NextResponse.json({ 
        success: false, 
        error: 'You already have an active subscription' 
      }, { status: 400 })
    }

    // Generate unique order ID for tracking
    const orderId = `PAY_${user.id.substring(0, 8)}_${Date.now()}`
    const amount = 30 // ₹30

    // Create payment attempt record in database
    // @ts-ignore - Supabase types not generated yet
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: user.id,
        amount: 30,
        currency: 'INR',
        status: 'pending',
        payment_gateway: 'instamojo_link',
        order_id: orderId,
        payment_response: {
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          payment_link: INSTAMOJO_PAYMENT_LINK,
          initiated_at: new Date().toISOString()
        } as any,
      } as any)
      .select()
      .single()

    if (paymentError) {
      console.error('❌ Failed to create payment record:', paymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to initialize payment' 
      }, { status: 500 })
    }

    console.log('✅ Payment attempt tracked:', orderId)

    return NextResponse.json({
      success: true,
      paymentUrl: INSTAMOJO_PAYMENT_LINK,
      orderId: orderId,
      amount: 30,
      userEmail: user.email,
    })
  } catch (error: any) {
    console.error('❌ Payment initiate error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 })
  }
}
