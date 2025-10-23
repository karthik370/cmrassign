# Deployment Guide

This guide covers deploying the Handwriting PDF Generator to production.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured
- [ ] Database schema is deployed to Supabase
- [ ] Supabase RLS policies are enabled
- [ ] Cloudinary folders are created
- [ ] Authentication is properly configured
- [ ] All dependencies are installed
- [ ] Application builds successfully locally
- [ ] .env.local is NOT committed to Git

## Deploying to Vercel

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub Repository**
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/handwriting-pdf.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_APP_URL
NODE_ENV
MAX_FONT_SIZE_MB
MAX_PDF_SIZE_MB
MAX_PDF_PAGES
```

3. Set `NODE_ENV` to `production`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. You'll get a live URL: `https://your-project.vercel.app`

### Step 5: Update Environment Variables

1. Copy your Vercel deployment URL
2. Go back to Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Trigger a redeployment

### Step 6: Test Production Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Upload a font
4. Create a project
5. Generate a PDF
6. Verify all features work

## Custom Domain Setup

### Step 1: Add Domain to Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Click "Add"
3. Enter your domain (e.g., `handwriting-pdf.com`)
4. Click "Add"

### Step 2: Configure DNS

Vercel will provide DNS records. Add them to your domain registrar:

**For root domain (handwriting-pdf.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for Propagation

- DNS propagation can take 24-48 hours
- Use [whatsmydns.net](https://www.whatsmydns.net/) to check status
- Vercel will automatically provision SSL certificate

### Step 4: Update Environment

Update `NEXT_PUBLIC_APP_URL` to your custom domain and redeploy.

## Environment-Specific Configuration

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Staging
```env
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
```

### Preview (for PRs)
Vercel automatically creates preview deployments for pull requests.

## Database Considerations

### Connection Pooling
Supabase handles connection pooling automatically. No additional configuration needed.

### Backups
1. Go to Supabase Dashboard
2. Navigate to **Database** → **Backups**
3. Enable automatic backups
4. Configure backup retention

### Scaling
Monitor Supabase metrics:
- Database size
- Active connections
- Query performance
- API requests

Upgrade Supabase plan if needed.

## File Storage Considerations

### Cloudinary Limits
Free tier provides:
- 25 credits/month (~25GB bandwidth)
- 25GB storage
- 10GB monthly viewing bandwidth

Monitor usage in Cloudinary Dashboard.

### Optimization
- Enable Cloudinary auto-optimization
- Use Cloudinary transformations for thumbnails
- Implement caching headers
- Consider CDN for static assets

## Monitoring

### Vercel Analytics
1. In Vercel project, go to **Analytics**
2. Enable Web Analytics
3. Monitor:
   - Page views
   - Load times
   - Core Web Vitals

### Error Tracking
Consider adding:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay
- Custom logging to Supabase

### Uptime Monitoring
Use services like:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Enable Cloudinary auto-format
- Implement lazy loading

### Code Splitting
- Next.js does this automatically
- Use dynamic imports for heavy components

### Caching
```typescript
// In API routes
export const revalidate = 3600 // Cache for 1 hour
```

### Edge Functions
Consider moving API routes to Edge for better performance:
```typescript
export const runtime = 'edge'
```

## Security Hardening

### Headers
Add security headers in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ]
}
```

### Rate Limiting
Implement rate limiting for API routes:
- Font uploads: 10/hour
- PDF uploads: 20/hour
- PDF generation: 30/hour

### CORS
Configure CORS in API routes for external requests.

## Backup Strategy

### Database Backups
- Daily automatic backups (Supabase)
- Monthly manual exports
- Store backups in separate location

### File Backups
- Cloudinary has built-in redundancy
- Consider periodic exports to S3

### Code Backups
- GitHub serves as code backup
- Tag releases for easy rollback

## Rollback Procedure

### Vercel Rollback
1. Go to **Deployments**
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Database Rollback
1. Go to Supabase Dashboard
2. Navigate to **Database** → **Backups**
3. Restore from backup point

### Quick Fixes
For urgent fixes:
```bash
# Make fix
git add .
git commit -m "Hotfix: description"
git push

# Vercel auto-deploys
```

## Post-Deployment

### Testing
- Run through complete user flow
- Test on multiple browsers
- Test on mobile devices
- Test with different PDF types
- Test with various font files

### Monitoring
- Set up alerts for errors
- Monitor performance metrics
- Track user analytics
- Review logs regularly

### Documentation
- Document any production-specific configuration
- Keep deployment notes
- Update README with production URL

## Troubleshooting

### Build Failures
Check Vercel build logs:
- Missing environment variables
- TypeScript errors
- Missing dependencies

### Runtime Errors
Check Vercel Function logs:
- API route errors
- Database connection issues
- External service errors

### Performance Issues
- Check Vercel Analytics
- Review database query performance
- Monitor Cloudinary bandwidth
- Check for memory leaks

## Continuous Deployment

Vercel automatically deploys:
- **Main branch** → Production
- **Pull requests** → Preview deployments
- **Other branches** → Preview deployments

### GitHub Actions (Optional)
Add `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## Scaling Considerations

### Horizontal Scaling
Vercel handles this automatically with serverless functions.

### Database Scaling
Monitor and upgrade Supabase plan as needed:
- Free: 500MB, 2GB bandwidth
- Pro: 8GB, 100GB bandwidth
- Pay as you go: Unlimited

### File Storage Scaling
Upgrade Cloudinary plan:
- Free: 25 credits/month
- Plus: $89/month (133 credits)
- Advanced: Custom pricing

## Cost Management

### Monitor Usage
- Vercel bandwidth
- Supabase database size
- Cloudinary storage and bandwidth
- API requests

### Optimize Costs
- Implement caching
- Optimize images
- Clean up old files
- Archive inactive projects

### Budget Alerts
Set up alerts in:
- Vercel Dashboard
- Supabase Dashboard
- Cloudinary Dashboard

## Support and Maintenance

### Regular Maintenance
- Update dependencies monthly
- Review security advisories
- Monitor error rates
- Optimize slow queries

### User Support
- Set up support email
- Create help documentation
- Monitor user feedback
- Track feature requests

## Checklist: Before Going Live

- [ ] All features tested
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Error tracking enabled
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Documentation updated
- [ ] Support channels ready
- [ ] Performance optimized
- [ ] Legal pages added (Privacy, Terms)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-into-prod)
- [Cloudinary Optimization](https://cloudinary.com/documentation/image_optimization)

---

**Remember**: Always test changes in preview deployments before promoting to production!
