export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  payment_gateway: string
  transaction_id?: string
  order_id: string
  payment_method?: string
  payment_response?: any
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  is_active: boolean
  payment_status: 'unpaid' | 'paid' | 'expired'
  amount_paid?: number
  paid_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface PaytmInitiateRequest {
  amount: number
  orderId: string
  customerId: string
  customerEmail: string
  customerPhone?: string
}

export interface PaytmInitiateResponse {
  success: boolean
  orderId?: string
  txnToken?: string
  amount?: number
  error?: string
}

export interface PaytmVerifyRequest {
  orderId: string
  txnId: string
}

export interface PaytmVerifyResponse {
  success: boolean
  verified: boolean
  status?: string
  amount?: number
  error?: string
}
