# Supabase Email Verification Setup Guide

## ✅ Code Implementation Complete!

The email verification flow has been implemented in the code. Now you need to configure Supabase settings.

## 🔧 Supabase Dashboard Configuration

### Step 1: Enable Email Confirmation

1. Go to your **Supabase Dashboard**
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Email** provider
5. **Enable** "Confirm email" option
6. Click **Save**

### Step 2: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Customize the email (optional):
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your email:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
   ```
4. Click **Save**

### Step 3: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your app URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
4. Click **Save**

## 📧 Email Verification Flow

### User Journey:

1. **User signs up** with email and password
   - Account is created but NOT active
   - Success message shown: "Check your email"

2. **User receives email** from Supabase
   - Contains verification link
   - Link format: `https://your-project.supabase.co/auth/v1/verify?token=...&type=signup&redirect_to=http://localhost:3000/auth/callback`

3. **User clicks link**
   - Redirected to `/auth/callback`
   - Code exchanged for session
   - User logged in automatically

4. **Redirected to dashboard**
   - URL: `/dashboard?verified=true`
   - Account fully activated!

## 🔍 Testing the Flow

### Test Email Verification:

1. **Sign up** at `/auth/signup`
2. **Check console** logs for Supabase response
3. **Check email** inbox
4. **Click verification link**
5. **Should redirect** to dashboard

### Common Issues:

**❌ Not receiving emails?**
- Check Supabase email settings are enabled
- Check spam folder
- Verify Site URL is correct
- Check email service is configured (Supabase uses its own SMTP by default)

**❌ Verification link doesn't work?**
- Ensure redirect URL is in allowed list
- Check callback route at `/auth/callback`
- Verify code in URL parameter

**❌ Redirects to login with error?**
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Check callback route logs

## 🎯 What Was Implemented:

### ✅ Code Changes:

1. **`hooks/useAuth.ts`**
   - Added `emailRedirectTo` parameter
   - Returns `needsEmailConfirmation` flag

2. **`components/auth/SignupForm.tsx`**
   - Shows "Check your email" message
   - No auto-redirect (waits for email verification)
   - Clear instructions for user

3. **`app/auth/callback/route.ts`**
   - Proper error handling
   - Exchanges code for session
   - Redirects to dashboard on success
   - Shows errors if verification fails

### ✅ Features:

- ✅ Email confirmation required
- ✅ Proper redirect after verification
- ✅ Error handling for failed verifications
- ✅ Clear user instructions
- ✅ Success messages
- ✅ Fallback to login on errors

## 🚀 Deployment Checklist:

### Before Deploying to Production:

- [ ] Enable email confirmation in Supabase
- [ ] Set production Site URL
- [ ] Add production redirect URLs
- [ ] Test email delivery in production
- [ ] Customize email template (optional)
- [ ] Set up custom SMTP (optional, for custom domain emails)

## 📝 Environment Variables Required:

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## ✨ That's It!

Your email verification is now properly configured. Users will:
1. Sign up
2. Receive verification email
3. Click link
4. Get logged in automatically
5. Land on dashboard

**Everything is handled automatically!** 🎉
