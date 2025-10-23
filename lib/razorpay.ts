import crypto from 'crypto'

// Instamojo Configuration
const INSTAMOJO_CONFIG = {
  API_KEY: process.env.INSTAMOJO_API_KEY || '',
  AUTH_TOKEN: process.env.INSTAMOJO_AUTH_TOKEN || '',
  SALT: process.env.INSTAMOJO_SALT || '',
  ENDPOINT: process.env.INSTAMOJO_ENDPOINT || 'https://test.instamojo.com/api/1.1/',
}

/**
 * Create Instamojo payment request
 */
export async function createInstamojoPayment(params: {
  amount: number // in rupees
  purpose: string
  buyerName: string
  email: string
  phone?: string
  redirectUrl: string
  webhookUrl?: string
}) {
  try {
    const response = await fetch(`${INSTAMOJO_CONFIG.ENDPOINT}payment-requests/`, {
      method: 'POST',
      headers: {
        'X-Api-Key': INSTAMOJO_CONFIG.API_KEY,
        'X-Auth-Token': INSTAMOJO_CONFIG.AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purpose: params.purpose,
        amount: params.amount.toString(),
        buyer_name: params.buyerName,
        email: params.email,
        phone: params.phone || '',
        redirect_url: params.redirectUrl,
        webhook: params.webhookUrl || '',
        send_email: false,
        send_sms: false,
        allow_repeated_payments: false,
      }),
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        paymentRequest: data.payment_request,
        longurl: data.payment_request.longurl,
      }
    } else {
      return {
        success: false,
        error: data.message || 'Failed to create payment',
      }
    }
  } catch (error: any) {
    console.error('❌ Instamojo payment creation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create payment',
    }
  }
}

/**
 * Verify Instamojo payment
 */
export async function verifyInstamojoPayment(paymentId: string) {
  try {
    const response = await fetch(`${INSTAMOJO_CONFIG.ENDPOINT}payments/${paymentId}/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': INSTAMOJO_CONFIG.API_KEY,
        'X-Auth-Token': INSTAMOJO_CONFIG.AUTH_TOKEN,
      },
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        payment: data.payment,
        status: data.payment.status, // 'Credit' means successful
      }
    } else {
      return {
        success: false,
        error: data.message || 'Failed to verify payment',
      }
    }
  } catch (error: any) {
    console.error('❌ Instamojo verify payment error:', error)
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    }
  }
}

/**
 * Get payment request details
 */
export async function getPaymentRequestDetails(paymentRequestId: string) {
  try {
    const response = await fetch(`${INSTAMOJO_CONFIG.ENDPOINT}payment-requests/${paymentRequestId}/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': INSTAMOJO_CONFIG.API_KEY,
        'X-Auth-Token': INSTAMOJO_CONFIG.AUTH_TOKEN,
      },
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        paymentRequest: data.payment_request,
      }
    } else {
      return {
        success: false,
        error: data.message || 'Failed to fetch payment request',
      }
    }
  } catch (error: any) {
    console.error('❌ Instamojo fetch payment request error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch payment request',
    }
  }
}

/**
 * Verify webhook signature from Instamojo
 */
export function verifyInstamojoWebhook(payload: any, signature: string): boolean {
  try {
    const mac = crypto
      .createHmac('sha1', INSTAMOJO_CONFIG.SALT)
      .update(JSON.stringify(payload))
      .digest('hex')

    return mac === signature
  } catch (error) {
    console.error('❌ Webhook verification error:', error)
    return false
  }
}

export { INSTAMOJO_CONFIG }
