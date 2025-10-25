# Email Templates for Supabase

## 📧 How to Set Up Email Templates

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. Choose the template type (Confirm Signup, Reset Password, etc.)
4. Paste the HTML code below
5. Click **Save**

---

## ✅ Confirm Signup Template

Use this template for email verification when users sign up:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #0f172a;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            border-radius: 16px 16px 0 0;
        }
        .logo {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #d1d5db;
            font-size: 14px;
            font-family: 'Courier New', monospace;
        }
        .content {
            background: white;
            padding: 40px 30px;
            border-radius: 0 0 16px 16px;
        }
        .title {
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
            text-align: center;
        }
        .message {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
        }
        .button:hover {
            box-shadow: 0 6px 8px rgba(99, 102, 241, 0.4);
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .code-block {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 16px 0;
            font-family: 'Courier New', monospace;
            color: #374151;
            font-size: 14px;
        }
        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CMR ASSIGNMENT</div>
            <div class="subtitle">&gt; Handwriting PDF System</div>
        </div>
        <div class="content">
            <h1 class="title">🎉 Welcome to CMR Assignment!</h1>
            <p class="message">
                Thank you for signing up! We're excited to have you on board.
            </p>
            <p class="message">
                To get started with creating handwritten PDFs, please verify your email address by clicking the button below:
            </p>
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✓ Verify Email Address
                </a>
            </div>
            <p class="message" style="text-align: center; color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:
            </p>
            <div class="code-block">
                {{ .ConfirmationURL }}
            </div>
            <div class="warning">
                ⚠️ <strong>Security Notice:</strong> This verification link expires in 24 hours. If you didn't create an account, please ignore this email.
            </div>
            <div class="footer">
                <p>
                    <strong>What's next?</strong><br>
                    ✓ Upload or choose from 50+ handwriting fonts<br>
                    ✓ Create unlimited PDF projects<br>
                    ✓ Download assignment-ready documents
                </p>
                <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
                    © 2025 CMR Assignment. All rights reserved.<br>
                    This email was sent to {{ .Email }}
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 🔄 Reset Password Template

Use this template for password reset emails:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #0f172a;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            border-radius: 16px 16px 0 0;
        }
        .logo {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #d1d5db;
            font-size: 14px;
            font-family: 'Courier New', monospace;
        }
        .content {
            background: white;
            padding: 40px 30px;
            border-radius: 0 0 16px 16px;
        }
        .title {
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
            text-align: center;
        }
        .message {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
        }
        .code-block {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 16px 0;
            font-family: 'Courier New', monospace;
            color: #374151;
            font-size: 14px;
            word-break: break-all;
        }
        .warning {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #991b1b;
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CMR ASSIGNMENT</div>
            <div class="subtitle">&gt; Handwriting PDF System</div>
        </div>
        <div class="content">
            <h1 class="title">🔒 Reset Your Password</h1>
            <p class="message">
                We received a request to reset your password for your CMR Assignment account.
            </p>
            <p class="message">
                Click the button below to create a new password:
            </p>
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🔑 Reset Password
                </a>
            </div>
            <p class="message" style="text-align: center; color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:
            </p>
            <div class="code-block">
                {{ .ConfirmationURL }}
            </div>
            <div class="warning">
                ⚠️ <strong>Important:</strong> This password reset link expires in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.
            </div>
            <div class="footer">
                <p style="color: #9ca3af; font-size: 12px;">
                    © 2025 CMR Assignment. All rights reserved.<br>
                    This email was sent to {{ .Email }}
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 📬 Magic Link Template (Optional)

If you enable magic link login:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #0f172a;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            border-radius: 16px 16px 0 0;
        }
        .logo {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #d1d5db;
            font-size: 14px;
            font-family: 'Courier New', monospace;
        }
        .content {
            background: white;
            padding: 40px 30px;
            border-radius: 0 0 16px 16px;
        }
        .title {
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
            text-align: center;
        }
        .message {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
        }
        .code-block {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 16px 0;
            font-family: 'Courier New', monospace;
            color: #374151;
            font-size: 14px;
            word-break: break-all;
        }
        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #92400e;
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CMR ASSIGNMENT</div>
            <div class="subtitle">&gt; Handwriting PDF System</div>
        </div>
        <div class="content">
            <h1 class="title">✨ Your Magic Login Link</h1>
            <p class="message">
                Click the button below to securely log in to your CMR Assignment account:
            </p>
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🚀 Log In to CMR Assignment
                </a>
            </div>
            <p class="message" style="text-align: center; color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:
            </p>
            <div class="code-block">
                {{ .ConfirmationURL }}
            </div>
            <div class="warning">
                ⚠️ <strong>Security Notice:</strong> This link expires in 1 hour and can only be used once. If you didn't request this login link, please ignore this email.
            </div>
            <div class="footer">
                <p style="color: #9ca3af; font-size: 12px;">
                    © 2025 CMR Assignment. All rights reserved.<br>
                    This email was sent to {{ .Email }}
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 🎨 Template Variables Available

Supabase provides these variables you can use in templates:

- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Verification/reset token
- `{{ .TokenHash }}` - Hashed token
- `{{ .ConfirmationURL }}` - Complete URL with token (recommended)
- `{{ .SiteURL }}` - Your site URL from settings

---

## 📋 Setup Instructions

### 1. Go to Supabase Dashboard
- Open your project
- Navigate to **Authentication** → **Email Templates**

### 2. For Each Template:
- **Confirm Signup**: Paste the Confirm Signup template
- **Reset Password**: Paste the Reset Password template  
- **Magic Link**: Paste the Magic Link template (if using)

### 3. Customize (Optional):
- Change colors to match your brand
- Update footer text
- Add your company address/contact info

### 4. Test:
- Create a test account
- Request password reset
- Check if emails arrive with proper branding

---

## 🎯 Features in These Templates

✅ **Professional Design** - Modern, clean layout
✅ **Branded** - "CMR ASSIGNMENT" logo and colors
✅ **Responsive** - Works on mobile and desktop
✅ **Security Notices** - Clear warnings about link expiration
✅ **Fallback Link** - Copy-paste option if button doesn't work
✅ **Clear CTAs** - Big, obvious action buttons
✅ **Informative** - Tells users what to expect next

---

## 🔧 Additional Configuration

In Supabase Dashboard → **Project Settings** → **Auth**:

1. **Site URL**: Set to your production domain
2. **Email Rate Limits**: Configure as needed
3. **Email Change**: Enable if users can change email
4. **SMTP Provider**: Configure for production (optional)

---

**Your emails will now look professional and match your CMR Assignment branding! 🎉**
