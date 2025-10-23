# ✅ Razorpay Payment - Quick Setup Checklist

## 🚀 Follow these steps in order:

### 1️⃣ Install Package (5 minutes)

```bash
npm install razorpay
```

---

### 2️⃣ Get Razorpay Test Keys (10 minutes)

1. Go to https://dashboard.razorpay.com/
2. Sign up (use email/Google)
3. Skip KYC for now (can test without it)
4. Go to **Settings** → **API Keys**
5. Click **Generate Test Key**
6. Copy **Key ID** and **Key Secret**

**You'll get keys like:**
- Key ID: `rzp_test_XXXXXXXXXXXX`
- Key Secret: `YYYYYYYYYYYYYYYY`

---

### 3️⃣ Setup Environment Variables (2 minutes)

Create `.env.local` file (if not exists):

```env
# Supabase (should already be here)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay - ADD THESE
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_test_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

**Replace** the X's with your actual keys!

---

### 4️⃣ Setup Database (5 minutes)

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy entire content from `supabase_payment_schema.sql`
4. Paste and click **Run**
5. Should see "Success" message

---

### 5️⃣ Start Development Server (1 minute)

```bash
npm run dev
```

---

### 6️⃣ Test Payment (5 minutes)

1. Open http://localhost:3000
2. **Sign up** for account
3. **Try to create project** → Should show payment required
4. Click **"Unlock Access"**
5. Click **"Pay ₹50"**
6. Use test card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - Name: Any name
7. Complete payment
8. Should redirect to success page
9. Try creating project → Should work! ✅

---

## ✅ That's It! You're Done!

**Total Time:** ~30 minutes

---

## 🧪 Test Cards for Different Scenarios

### Successful Payment:
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

### Failed Payment (to test error handling):
```
Card: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

### Test UPI:
- `success@razorpay` - Success
- `failure@razorpay` - Failure

---

## 🐛 Quick Troubleshooting

**Payment button doesn't work?**
```
1. Check browser console for errors
2. Verify .env.local has all 3 Razorpay variables
3. Restart dev server after adding env variables
```

**"Unauthorized" error?**
```
1. Make sure you're logged in
2. Check Supabase connection
3. Clear browser cache
```

**Database error?**
```
1. Verify SQL script ran successfully
2. Check tables exist in Supabase
3. Verify RLS policies are enabled
```

---

## 🎯 After Testing Works

### For Production:

1. **Complete Razorpay KYC** (takes 24-48 hours)
   - PAN card
   - Bank details
   - Address proof

2. **Generate Live Keys**
   - Dashboard → Settings → API Keys
   - Generate Live Key

3. **Update .env.local**
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX  # Change test to live
   RAZORPAY_KEY_SECRET=your_live_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
   ```

4. **Deploy to Production**
   - Vercel/Netlify/etc.
   - Add environment variables in hosting platform
   - Test with real ₹1 payment first

---

## 📚 Need More Help?

Read these files in order:
1. `RAZORPAY_SETUP_INSTRUCTIONS.md` - First run npm install
2. `RAZORPAY_PRODUCTION_SETUP.md` - Complete guide
3. `PAYMENT_INTEGRATION_EXAMPLES.md` - Code examples

---

## 💡 Pro Tips

✅ **Test thoroughly** with test keys first
✅ **Never commit** .env.local to Git
✅ **Save your keys** securely (password manager)
✅ **Enable 2FA** on Razorpay account
✅ **Monitor payments** in Razorpay dashboard
✅ **Test refunds** process before going live

---

## 🎉 Success Indicators

After successful setup, you should see:

- ✅ Payment button opens Razorpay checkout
- ✅ Test card payment completes
- ✅ Database updated with payment record
- ✅ User subscription activated
- ✅ Redirect to success page
- ✅ User can now create projects

---

**Happy Coding!** 🚀

Need help? Check the console logs - they're very descriptive!
