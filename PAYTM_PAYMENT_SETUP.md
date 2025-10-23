# 💳 Paytm Payment Integration - Complete Setup Guide

## ✅ Implementation Complete!

A secure payment system has been implemented with Paytm gateway integration. Users must pay ₹50 to unlock full access.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Paytm Configuration](#paytm-configuration)
4. [Environment Variables](#environment-variables)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)
7. [Usage Guide](#usage-guide)

---

## 🔧 Prerequisites

### 1. Paytm Merchant Account

- Go to [Paytm Business](https://business.paytm.com/)
- Sign up for a merchant account
- Complete KYC verification
- Get your credentials:
  - Merchant ID (MID)
  - Merchant Key
  - Website Name

### 2. Paytm Test Credentials (For Development)

For testing, use Paytm's staging environment:
- MID: Provided by Paytm
- Merchant Key: Provided by Paytm
- Website: `WEBSTAGING`

---

## 🗄️ Database Setup

### Step 1: Run SQL Script in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **SQL Editor**
3. Copy contents from `supabase_payment_schema.sql`
4. Run the script

This will create:
- `payments` table - Track all payment transactions
- `user_subscriptions` table - Track user access status
- RLS policies - Secure data access
- Triggers - Auto-create subscription on signup
- Functions - Check user access status

### Step 2: Verify Tables Created

Run this query to verify:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payments', 'user_subscriptions');
```

---

## 💰 Paytm Configuration

### For Testing (Staging Environment)

1. **Get Test Credentials**
   - Contact Paytm support for staging credentials
   - Or use provided test MID/Key

2. **Test Payment Flow**
   - Use staging URLs (already configured)
   - Test cards provided by Paytm
   - No real money involved

### For Production

1. **Complete Merchant Setup**
   - Complete KYC
   - Add bank details
   - Get production credentials

2. **Update Environment Variables**
   - Change URLs to production
   - Use production MID and Key
   - Update callback URL

3. **Configure Webhook**
   - Set callback URL in Paytm dashboard
   - Format: `https://yourdomain.com/api/payment/callback`

---

## 🔐 Environment Variables

### Add to `.env.local`:

```env
# Paytm Configuration
PAYTM_MID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBSTAGING
PAYTM_CHANNEL_ID=WEB
PAYTM_INDUSTRY_TYPE=Retail

# Paytm Callback URL
PAYTM_CALLBACK_URL=http://localhost:3000/api/payment/callback

# Paytm API URLs (Staging)
PAYTM_TXN_URL=https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction
PAYTM_STATUS_URL=https://securegw-stage.paytm.in/v3/order/status

# For Production, use:
# PAYTM_TXN_URL=https://securegw.paytm.in/theia/api/v1/initiateTransaction
# PAYTM_STATUS_URL=https://securegw.paytm.in/v3/order/status
# PAYTM_CALLBACK_URL=https://yourdomain.com/api/payment/callback

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🧪 Testing

### Test Payment Flow

1. **Sign Up** → Create a new account
2. **Attempt to Create Project** → Payment required screen appears
3. **Click "Unlock Access"** → Redirects to payment page
4. **Click "Pay ₹50"** → Paytm checkout opens
5. **Complete Payment** → Use test credentials
6. **Verification** → Auto-redirected to dashboard
7. **Create Project** → Now unlocked!

### Test Cards (Paytm Staging)

Paytm provides test cards - contact their support for:
- Test card numbers
- Test UPI IDs
- Test wallet credentials

### Verify Database Updates

```sql
-- Check user subscription status
SELECT * FROM user_subscriptions WHERE user_id = 'your_user_id';

-- Check payment records
SELECT * FROM payments WHERE user_id = 'your_user_id';
```

---

## 🚀 Production Deployment

### Checklist

- [ ] Complete Paytm KYC and merchant verification
- [ ] Get production MID and Merchant Key
- [ ] Update environment variables with production values
- [ ] Change Paytm URLs to production endpoints
- [ ] Set production callback URL in Paytm dashboard
- [ ] Test with small amount first
- [ ] Enable production mode in code (if any flags)
- [ ] Monitor payment logs
- [ ] Setup payment failure alerts

### Security Best Practices

✅ **Implemented:**
- Checksum verification
- Server-side payment verification
- RLS policies in database
- Authenticated API routes
- HTTPS required (in production)
- Payment status cross-verification

---

## 📚 Usage Guide

### For Developers

#### Protect a Route with Payment

```tsx
import { PaymentGate } from '@/components/payment/PaymentGate'

export default function ProtectedPage() {
  return (
    <PaymentGate>
      {/* Your protected content */}
      <YourComponent />
    </PaymentGate>
  )
}
```

#### Check Payment Status Programmatically

```tsx
import { usePayment } from '@/hooks/usePayment'

function MyComponent() {
  const { hasAccess, loading } = usePayment()

  if (loading) return <div>Loading...</div>
  
  if (!hasAccess) {
    return <div>Please upgrade to access this feature</div>
  }

  return <div>Premium content!</div>
}
```

#### Manually Initiate Payment

```tsx
const { initiatePayment } = usePayment()

const handleUpgrade = async () => {
  try {
    const paymentData = await initiatePayment()
    // Payment modal will open automatically
  } catch (error) {
    console.error('Payment failed:', error)
  }
}
```

---

## 🎯 User Flow

```
1. User signs up
        ↓
2. Free tier (no access to create projects)
        ↓
3. Tries to create project
        ↓
4. Payment required screen shown
        ↓
5. Clicks "Unlock Access" (₹50)
        ↓
6. Redirected to /payment page
        ↓
7. Clicks "Pay Now"
        ↓
8. Paytm checkout opens
        ↓
9. User completes payment
        ↓
10. Callback → /api/payment/callback
        ↓
11. Verify with Paytm
        ↓
12. Update database
        ↓
13. Redirect to /payment/success
        ↓
14. Auto-redirect to dashboard
        ↓
15. ✅ Full access unlocked!
```

---

## 🔍 Troubleshooting

### Payment Not Completing

- Check Paytm dashboard for transaction status
- Verify callback URL is accessible
- Check server logs for errors
- Ensure checksum is correct

### User Shows Unpaid After Payment

- Run verification manually: `/api/payment/verify`
- Check `payments` table status
- Verify `user_subscriptions.is_active` is true
- Check Paytm transaction status

### Callback Not Working

- Verify callback URL in Paytm dashboard
- Check if URL is publicly accessible
- Ensure POST method is allowed
- Check server logs

### Common Error Codes

- `401` - Authentication failed
- `404` - Payment record not found
- `400` - Invalid request/checksum
- `500` - Server error (check logs)

---

## 📊 Database Schema

### `payments` Table

```sql
id               UUID (Primary Key)
user_id          UUID (Foreign Key → auth.users)
amount           DECIMAL
currency         VARCHAR (default: 'INR')
status           VARCHAR (pending/success/failed)
payment_gateway  VARCHAR (default: 'paytm')
transaction_id   VARCHAR (unique)
order_id         VARCHAR (unique)
payment_response JSONB
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

### `user_subscriptions` Table

```sql
id             UUID (Primary Key)
user_id        UUID (Foreign Key → auth.users, unique)
is_active      BOOLEAN (default: false)
payment_status VARCHAR (unpaid/paid/expired)
amount_paid    DECIMAL
paid_at        TIMESTAMP
expires_at     TIMESTAMP (null for lifetime)
created_at     TIMESTAMP
updated_at     TIMESTAMP
```

---

## 🎉 Features Implemented

✅ **Payment Gateway Integration**
- Paytm checkout
- Secure checksum verification
- Multiple payment methods (UPI, Cards, Wallets, Net Banking)

✅ **Database Management**
- Payment tracking
- Subscription status
- Automatic triggers
- RLS security

✅ **API Routes**
- `/api/payment/initiate` - Start payment
- `/api/payment/verify` - Verify payment
- `/api/payment/callback` - Paytm webhook
- `/api/payment/status` - Check subscription

✅ **UI Components**
- Payment page with pricing
- Success page with confetti
- Failed page with retry
- Payment gate component
- Upgrade prompts

✅ **Security**
- Server-side verification
- Checksum validation
- RLS policies
- Authenticated routes
- No client-side payment logic

---

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review server logs
3. Check Paytm dashboard
4. Verify database records
5. Contact Paytm support for gateway issues

---

## 🚨 Important Notes

⚠️ **Never commit** Paytm credentials to Git
⚠️ **Always verify** payments server-side
⚠️ **Use HTTPS** in production
⚠️ **Monitor** payment logs regularly
⚠️ **Test thoroughly** before going live

---

**That's it! Your payment system is fully configured and ready to use!** 🎉

For any issues, refer to this guide or check the inline code comments.
