import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyInstamojoPayment } from '@/lib/instamojo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_id, payment_request_id } = body

    if (!payment_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment ID is required' 
      }, { status: 400 })
    }

    // Verify payment with Instamojo
    const paymentVerification = await verifyInstamojoPayment(payment_id)

    if (!paymentVerification.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment verification failed' 
      }, { status: 400 })
    }

    // Get payment from database
    const { data: payment, error: paymentError} = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_id', payment_request_id || paymentVerification.payment.payment_request_id)
      .single() as any

    if (paymentError || !payment) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment not found' 
      }, { status: 404 })
    }

    const isSuccess = paymentVerification.status === 'Credit'
    const amount = parseFloat(paymentVerification.payment.amount)

    // Update payment record
    await supabaseAdmin
      .from('payments')
      // @ts-expect-error - Supabase types not generated yet
      .update({
        status: isSuccess ? 'success' : 'failed',
        transaction_id: payment_id,
        payment_response: paymentVerification.payment as any,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', (payment as any).id)

    // If payment successful, activate subscription
    if (isSuccess) {
      await supabaseAdmin
        .from('user_subscriptions')
        // @ts-expect-error - Supabase types not generated yet
        .update({
          is_active: true,
          payment_status: 'paid',
          amount_paid: amount,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq('user_id', (payment as any).user_id)

      console.log(`✅ Payment verified and subscription activated for user ${(payment as any).user_id}`)
    }

    return NextResponse.json({
      success: true,
      verified: isSuccess,
      status: paymentVerification.status,
      amount,
    })
  } catch (error: any) {
    console.error('❌ Payment verify error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Verification failed',
    }, { status: 500 })
  }
}
