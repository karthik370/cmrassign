# Handwriting PDF Generator - Setup Guide

This guide will walk you through setting up the Handwriting PDF Generator application.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** ([Download](https://git-scm.com/))

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd hw
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
   - Enter project name
   - Create a secure database password (save this!)
   - Choose a region close to your users
   - Click "Create new project"

### Run Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Open the file `database/schema.sql` from this project
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click "Run" to execute the schema

### Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)

### Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. To enable Google OAuth (optional):
   - Go to **Providers** → **Google**
   - Follow instructions to set up Google OAuth
   - Add credentials

## Step 4: Set Up Cloudinary

### Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Complete registration

### Get API Credentials

1. Go to your Cloudinary Dashboard
2. Find your credentials:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### Create Upload Folders

1. In Cloudinary Dashboard, go to **Media Library**
2. Create these folders:
   - `fonts`
   - `pdfs`
   - `processed_pdfs`

## Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Limits
MAX_FONT_SIZE_MB=5
MAX_PDF_SIZE_MB=50
MAX_PDF_PAGES=12
```

## Step 6: Run the Application

### Development Mode

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Step 7: Test the Application

1. **Create an Account**
   - Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
   - Sign up with your email

2. **Create a Font** (using Calligraphr)
   - Go to Instructions page
   - Follow the guide to create a font on Calligraphr.com
   - Download the `.ttf` file

3. **Upload Font**
   - Navigate to Fonts → Upload Font
   - Upload your `.ttf` file

4. **Create a Project**
   - Go to Projects → New Project
   - Select your font
   - Upload a PDF (max 12 pages)

5. **Edit PDF**
   - Add text using your handwriting font
   - Changes auto-save

6. **Generate PDF**
   - Click "Generate PDF"
   - Download your completed PDF

## Deployment to Vercel

### Prerequisites

- Vercel account ([Sign up](https://vercel.com))
- GitHub account

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel project settings, go to **Environment Variables**
   - Add all variables from `.env.local`
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a live URL (e.g., `your-app.vercel.app`)

5. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
   - Redeploy

### Custom Domain (Optional)

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Troubleshooting

### Database Connection Issues

- Verify Supabase URL and keys are correct
- Check if Supabase project is active
- Ensure RLS policies are enabled

### File Upload Issues

- Verify Cloudinary credentials
- Check Cloudinary folder names
- Ensure API limits aren't exceeded

### PDF Generation Issues

- Check if `pdf-lib` is installed correctly
- Verify font file is valid
- Check browser console for errors

### Authentication Issues

- Verify email provider is enabled in Supabase
- Check if email confirmation is required
- Ensure cookies are enabled in browser

## Common Errors

### "Module not found" errors

```bash
npm install
npm run dev
```

### "Invalid API key" for Cloudinary

- Double-check API credentials in `.env.local`
- Ensure no extra spaces in keys

### PDF.js Worker Errors

This is normal in development. The app uses a CDN fallback for the worker.

## Support

For issues and questions:

1. Check this documentation
2. Review error messages in browser console
3. Check Supabase logs
4. Check Cloudinary logs

## Next Steps

- Customize the UI (edit Tailwind config)
- Add more PDF page detection algorithms
- Implement rate limiting
- Add analytics
- Add email notifications
- Create mobile app version

## Security Notes

- Never commit `.env.local` to Git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Keep `CLOUDINARY_API_SECRET` secret
- Use environment variables for all secrets
- Enable HTTPS in production
- Review and update CORS settings

## Performance Tips

- Use Vercel Edge Functions for API routes
- Enable Cloudinary transformations
- Implement caching for fonts
- Use lazy loading for images
- Optimize PDF file sizes

## License

MIT License - See LICENSE file for details
