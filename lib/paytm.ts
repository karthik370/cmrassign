import Razorpay from 'razorpay'
import crypto from 'crypto'

// Razorpay Configuration
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

/**
 * Create Razorpay order
 */
export async function createRazorpayOrder(params: {
  amount: number // in rupees
  orderId: string
  customerEmail?: string
  customerPhone?: string
}) {
  try {
    const order = await razorpayInstance.orders.create({
      amount: params.amount * 100, // Convert to paise (₹50 = 5000 paise)
      currency: 'INR',
      receipt: params.orderId,
      notes: {
        customer_email: params.customerEmail || '',
        customer_phone: params.customerPhone || '',
      },
    })

    return {
      success: true,
      order,
    }
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create order',
    }
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex')

    return expectedSignature === signature
  } catch (error) {
    console.error('❌ Signature verification error:', error)
    return false
  }
}

/**
 * Fetch payment details from Razorpay
 */
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId)
    return {
      success: true,
      payment,
    }
  } catch (error: any) {
    console.error('❌ Razorpay fetch payment error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch payment',
    }
  }
}

/**
 * Fetch order details from Razorpay
 */
export async function fetchOrderDetails(orderId: string) {
  try {
    const order = await razorpayInstance.orders.fetch(orderId)
    return {
      success: true,
      order,
    }
  } catch (error: any) {
    console.error('❌ Razorpay fetch order error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch order',
    }
  }
}
