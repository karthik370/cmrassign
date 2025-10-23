# 🚀 Production Deployment Guide

## **Platform: Vercel (Recommended)**

### **Why Vercel?**
✅ Free hosting for Next.js  
✅ Automatic deployments from GitHub  
✅ Built-in CDN & SSL  
✅ API routes work out of the box  
✅ Environment variables support  
✅ Custom domains  

---

## **Step 1: Get Supabase Service Role Key**

1. Go to https://supabase.com/dashboard
2. Select your project: `qmhwgctoffvccquhvand`
3. Go to **Settings** → **API**
4. Copy **service_role key** (secret)
5. Save it - you'll need it in Step 5

---

## **Step 2: Enable Email Verification in Supabase**

### **Configure Email Settings:**

1. **Go to Supabase Dashboard** → **Authentication** → **Email Templates**

2. **Confirm Signup Template** - Update redirect URL:
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your email:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
   ```

3. **Go to Authentication** → **URL Configuration**
   - **Site URL**: `https://your-domain.vercel.app`
   - **Redirect URLs**: Add `https://your-domain.vercel.app/auth/callback`

4. **Email Auth Settings**:
   - Enable "Confirm email"
   - Enable "Email Confirmations"
   - Set "Confirmation email expiry" to 24 hours

---

## **Step 3: Update Auth Callback**

Create auth callback route:

**File: `app/auth/callback/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard after email confirmation
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

---

## **Step 4: Push to GitHub**

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for production deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## **Step 5: Deploy to Vercel**

### **A. Sign up & Connect:**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Select the repository

### **B. Configure Build Settings:**

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### **C. Add Environment Variables:**

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://qmhwgctoffvccquhvand.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (from Step 1)
CLOUDINARY_CLOUD_NAME=ddrsyt38h
CLOUDINARY_API_KEY=366679359961143
CLOUDINARY_API_SECRET=8cZ0Tmzn6XY6CDkMeLY39u0-iD0
NODE_ENV=production
MAX_FONT_SIZE_MB=5
MAX_PDF_SIZE_MB=50
MAX_PDF_PAGES=12
```

### **D. Deploy:**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Get your live URL: `https://your-project.vercel.app`

---

## **Step 6: Update Supabase URLs**

1. Go back to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Update:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: 
     - `https://your-project.vercel.app/**`
     - `https://your-project.vercel.app/auth/callback`

---

## **Step 7: Test Production**

### **Test Checklist:**

- [ ] **Homepage loads**: Visit `https://your-project.vercel.app`
- [ ] **Sign up with email**
- [ ] **Check email for verification link**
- [ ] **Click verification link** → Should redirect to dashboard
- [ ] **Login works**
- [ ] **Create project** (with local font)
- [ ] **Upload PDF**
- [ ] **Edit pages** (text + drawings)
- [ ] **Save changes** → Check Supabase database
- [ ] **Generate PDF** → Download works
- [ ] **Payment flow** (if applicable)
- [ ] **Font upload** → Saves to Cloudinary
- [ ] **All API calls work** (check browser console)

---

## **Step 8: Custom Domain (Optional)**

### **Add Custom Domain:**

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Add your domain: `yoursite.com`

2. **Update DNS** (at your domain registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (5-60 minutes)

4. **Update Supabase Site URL** to your custom domain

---

## **Common Issues & Fixes**

### **Issue 1: Environment Variables Not Working**

**Fix:**
- Go to Vercel → Project → Settings → Environment Variables
- Make sure all variables are added
- Redeploy after adding variables

### **Issue 2: API Routes 404**

**Fix:**
- Ensure `app/api` folder structure is correct
- Check build logs in Vercel for errors
- API routes are automatic in Next.js (no extra config needed)

### **Issue 3: Email Verification Not Working**

**Fix:**
- Check Supabase Auth → URL Configuration
- Make sure redirect URLs include production domain
- Test email template in Supabase dashboard

### **Issue 4: Database Connection Errors**

**Fix:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase project is active
- Verify internet connection from Vercel

### **Issue 5: File Uploads Failing**

**Fix:**
- Verify Cloudinary credentials in environment variables
- Check Cloudinary dashboard for quota limits
- Enable CORS in Cloudinary settings if needed

---

## **Monitoring & Logs**

### **View Logs:**
1. Vercel Dashboard → Your Project → **Deployments**
2. Click latest deployment
3. View **Function Logs** for API errors
4. View **Build Logs** for deployment issues

### **Database Monitoring:**
- Supabase Dashboard → **Database** → **Logs**
- Monitor query performance
- Check connection pool usage

---

## **Security Checklist**

- [ ] ✅ Environment variables not in code
- [ ] ✅ Service role key only in server (not exposed to client)
- [ ] ✅ RLS (Row Level Security) enabled in Supabase
- [ ] ✅ HTTPS enabled (automatic with Vercel)
- [ ] ✅ Email verification required
- [ ] ✅ API routes protected with authentication
- [ ] ✅ File upload size limits enforced
- [ ] ✅ Project limits enforced (5 max)

---

## **Post-Deployment**

### **Auto-Deploy on Push:**

Every time you push to GitHub `main` branch:
1. Vercel automatically builds
2. Runs tests (if configured)
3. Deploys new version
4. Updates live site

### **Rollback if Needed:**

1. Vercel Dashboard → Deployments
2. Find previous working version
3. Click **"Promote to Production"**

---

## **Cost Breakdown**

| Service | Cost |
|---------|------|
| **Vercel** | Free (Hobby plan) |
| **Supabase** | Free (up to 500MB database) |
| **Cloudinary** | Free (25GB storage, 25GB bandwidth) |
| **Total** | **₹0/month** |

### **When to Upgrade:**

- Vercel: > 100GB bandwidth/month
- Supabase: > 500MB database or > 2GB file storage
- Cloudinary: > 25GB storage

---

## **Quick Reference**

### **Your Production URLs:**

- **Website**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/*`
- **Supabase**: `https://qmhwgctoffvccquhvand.supabase.co`
- **Cloudinary**: `https://res.cloudinary.com/ddrsyt38h`

### **Important Links:**

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Cloudinary Dashboard**: https://cloudinary.com/console

---

## **Support**

If something doesn't work:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Check Supabase logs
4. Verify all environment variables are set

**Your app is ready for production!** 🚀
