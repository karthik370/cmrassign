import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
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

    // Get user subscription
    const { data: subscription, error: subError } = await (supabaseAdmin as any)
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (subError) {
      console.error('❌ Failed to fetch subscription:', subError)
      return NextResponse.json({
        success: true,
        hasAccess: false,
        subscription: null,
      })
    }

    return NextResponse.json({
      success: true,
      hasAccess: (subscription as any).is_active,
      subscription: {
        isActive: (subscription as any).is_active,
        paymentStatus: (subscription as any).payment_status,
        amountPaid: (subscription as any).amount_paid,
        paidAt: (subscription as any).paid_at,
      },
    })
  } catch (error: any) {
    console.error('❌ Status check error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
