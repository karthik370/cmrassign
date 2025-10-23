import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyChecksum } from '@/lib/paytm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📥 Paytm callback received:', body)

    const { ORDERID, TXNID, STATUS, CHECKSUMHASH, ...otherParams } = body

    // Verify checksum
    const isValidChecksum = verifyChecksum(
      otherParams,
      CHECKSUMHASH,
      process.env.PAYTM_MERCHANT_KEY || ''
    )

    if (!isValidChecksum) {
      console.error('❌ Invalid checksum from Paytm')
      return NextResponse.redirect(new URL('/payment/failed?reason=invalid', request.url))
    }

    // Get payment from database
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_id', ORDERID)
      .single()

    if (!payment) {
      console.error('❌ Payment not found for order:', ORDERID)
      return NextResponse.redirect(new URL('/payment/failed?reason=notfound', request.url))
    }

    const isSuccess = STATUS === 'TXN_SUCCESS'

    // Update payment record
    await supabaseAdmin
      .from('payments')
      .update({
        status: isSuccess ? 'success' : 'failed',
        transaction_id: TXNID,
        payment_response: body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    // If payment successful, activate subscription
    if (isSuccess) {
      await supabaseAdmin
        .from('user_subscriptions')
        .update({
          is_active: true,
          payment_status: 'paid',
          amount_paid: payment.amount,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', payment.user_id)

      console.log(`✅ Payment successful and subscription activated for user ${payment.user_id}`)
      
      return NextResponse.redirect(new URL('/payment/success', request.url))
    } else {
      console.log(`❌ Payment failed for order ${ORDERID}`)
      return NextResponse.redirect(new URL('/payment/failed', request.url))
    }
  } catch (error: any) {
    console.error('❌ Payment callback error:', error)
    return NextResponse.redirect(new URL('/payment/failed?reason=error', request.url))
  }
}
