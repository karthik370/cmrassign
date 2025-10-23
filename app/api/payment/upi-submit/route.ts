import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { utrNumber, amount, userEmail } = await request.json()

    if (!utrNumber || !userEmail) {
      return NextResponse.json({ 
        success: false, 
        error: 'UTR number and email are required' 
      }, { status: 400 })
    }

    // Get user by email
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    const user = users?.find(u => u.email === userEmail)

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Check if UTR already exists
    // @ts-ignore
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_id', utrNumber)
      .single()

    if (existingPayment) {
      return NextResponse.json({ 
        success: false, 
        error: 'This UTR number has already been submitted' 
      }, { status: 400 })
    }

    // Create payment record with UTR
    const orderId = `UPI_${user.id.substring(0, 8)}_${Date.now()}`

    // @ts-ignore
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: user.id,
        amount: amount || 30,
        currency: 'INR',
        status: 'pending',
        payment_gateway: 'upi_qr',
        order_id: orderId,
        transaction_id: utrNumber,
        payment_response: {
          user_email: userEmail,
          utr_number: utrNumber,
          payment_method: 'UPI',
          submitted_at: new Date().toISOString()
        } as any,
      } as any)
      .select()
      .single()

    if (paymentError) {
      console.error('❌ Failed to create payment record:', paymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to record payment' 
      }, { status: 500 })
    }

    console.log('✅ UPI payment submitted with UTR:', utrNumber)

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully',
      orderId: orderId,
    })
  } catch (error: any) {
    console.error('❌ UPI submit error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 })
  }
}
