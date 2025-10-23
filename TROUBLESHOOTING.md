# Troubleshooting Guide

Common issues and their solutions for the Handwriting PDF Generator.

## Installation Issues

### npm install fails

**Problem**: Dependencies fail to install

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

### Module not found errors

**Problem**: `Module not found: Can't resolve 'xxx'`

**Solution**:
```bash
# Ensure all dependencies are installed
npm install

# Check if the import path is correct
# Use @ for absolute imports: import { Button } from '@/components/ui/Button'
```

## Database Issues

### Cannot connect to Supabase

**Problem**: Database connection fails

**Checklist**:
1. ✓ Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. ✓ Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. ✓ Check Supabase project is active (not paused)
4. ✓ Verify you're using the correct project
5. ✓ Check for typos in environment variables

**Solution**:
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Restart dev server
npm run dev
```

### RLS policy errors

**Problem**: "Row Level Security policy violation"

**Solution**:
1. Check if RLS policies are enabled in Supabase
2. Verify policies match user authentication
3. Run the complete schema from `database/schema.sql`

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Enable RLS if needed
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Foreign key constraint errors

**Problem**: "Foreign key constraint violation"

**Solution**:
1. Ensure parent records exist before creating child records
2. Check cascade delete is configured
3. Verify user is authenticated

## Authentication Issues

### User cannot sign up

**Problem**: Sign up fails or doesn't send email

**Checklist**:
1. ✓ Email provider is enabled in Supabase
2. ✓ Email confirmation is configured
3. ✓ Check Supabase Auth settings
4. ✓ Verify environment variables

**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Ensure Email provider is enabled
3. Configure email templates
4. Check spam folder for confirmation emails

### Session expires immediately

**Problem**: User gets logged out right after login

**Solution**:
```typescript
// Check cookie settings
// Ensure domain is correct in production

// In development, use localhost
// In production, use your domain
```

### Middleware redirect loop

**Problem**: Infinite redirect between login and dashboard

**Solution**:
Check `middleware.ts`:
```typescript
// Ensure routes are correctly configured
const protectedRoutes = ['/dashboard', '/fonts', '/projects']
const authRoutes = ['/auth/login', '/auth/signup']

// Don't protect auth routes
```

## File Upload Issues

### Font upload fails

**Problem**: "Invalid font file" or upload error

**Checklist**:
1. ✓ File is actually .ttf or .otf
2. ✓ File is not corrupted
3. ✓ File size is under 5MB
4. ✓ Cloudinary credentials are correct

**Solution**:
```bash
# Verify file type (on Mac/Linux)
file your-font.ttf

# Should show: TrueType Font data

# Check file size
ls -lh your-font.ttf
```

**Test Cloudinary connection**:
```typescript
// In your API route, add logging
console.log('Cloudinary Config:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  // Don't log API secret!
})
```

### PDF upload fails

**Problem**: "PDF too large" or upload error

**Solutions**:
1. Compress PDF before uploading
2. Ensure PDF is not password protected
3. Verify PDF has 12 pages or less
4. Check file size is under 50MB

```bash
# Check PDF info (requires pdfinfo)
pdfinfo your-file.pdf

# Compress PDF (requires ghostscript)
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=compressed.pdf input.pdf
```

### Cloudinary errors

**Problem**: "Upload failed" or Cloudinary errors

**Solutions**:
1. Verify API credentials
2. Check Cloudinary dashboard for errors
3. Ensure folders exist (fonts, pdfs, processed_pdfs)
4. Check Cloudinary usage limits

```javascript
// Test Cloudinary upload
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
})

// Test upload
cloudinary.uploader.upload('test.jpg', (error, result) => {
  console.log(result, error)
})
```

## PDF Processing Issues

### PDF.js worker errors

**Problem**: "PDF.js worker undefined" or worker errors

**Solution**:
This is normal in development. The app uses a CDN fallback.

```typescript
// In pdf-analyzer.ts, worker is configured:
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}
```

### PDF generation fails

**Problem**: "Failed to generate PDF"

**Debugging steps**:
1. Check browser console for errors
2. Verify font file is valid
3. Ensure all page edits are saved
4. Check API logs in Vercel

```typescript
// Add detailed logging in generate route
try {
  console.log('Starting PDF generation...')
  console.log('Font URL:', fontUrl)
  console.log('Page edits count:', pageEdits.length)
  
  const pdfBytes = await generatePDFWithHandwriting(...)
  
  console.log('PDF generated, size:', pdfBytes.length)
} catch (error) {
  console.error('PDF generation error:', error)
  throw error
}
```

### Text doesn't appear in generated PDF

**Problem**: PDF generates but text is missing

**Causes**:
1. Font file is corrupted
2. Text coordinates are off-canvas
3. Font embedding failed

**Solution**:
1. Re-upload font file
2. Check text block coordinates
3. Verify font file is valid

## Editor Issues

### Font doesn't load in editor

**Problem**: Text appears in default font

**Solution**:
```typescript
// Check if font loaded successfully
console.log('Fonts loaded:', document.fonts)

// Verify font URL is accessible
fetch(fontUrl)
  .then(r => console.log('Font accessible:', r.ok))
  .catch(e => console.error('Font not accessible:', e))
```

### Auto-save not working

**Problem**: Changes don't save

**Debugging**:
1. Check browser console for errors
2. Verify network requests are sent
3. Check API route is working

```typescript
// Add logging to useAutoSave hook
const { isSaving, error } = useAutoSave(data, saveFunction)

useEffect(() => {
  if (error) console.error('Auto-save error:', error)
  if (isSaving) console.log('Saving...')
}, [isSaving, error])
```

### Canvas not displaying PDF

**Problem**: PDF doesn't render in editor

**Solutions**:
1. Check PDF URL is accessible
2. Verify react-pdf is installed correctly
3. Check browser console for CORS errors

```bash
# Reinstall react-pdf
npm uninstall react-pdf pdfjs-dist
npm install react-pdf@^7.7.0 pdfjs-dist@^4.0.379
```

## Performance Issues

### Slow page loads

**Solutions**:
1. Enable Next.js caching
2. Optimize images with Cloudinary
3. Implement lazy loading
4. Use React.memo for components

```typescript
// Memoize expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // component code
})
```

### Large font files

**Problem**: Slow font loading

**Solution**:
1. Use font subsetting (only needed characters)
2. Compress font files
3. Implement font caching

### Database slow queries

**Problem**: Slow data fetching

**Solutions**:
1. Add database indexes (already included in schema)
2. Limit query results
3. Use pagination
4. Enable Supabase query caching

## Production Issues

### Environment variables not working

**Problem**: "undefined" in production

**Solution**:
1. Verify all env vars are set in Vercel
2. Check variable names match exactly
3. Redeploy after adding variables
4. Use `NEXT_PUBLIC_` prefix for client-side vars

### Build fails on Vercel

**Problem**: Build error during deployment

**Common causes**:
1. TypeScript errors
2. Missing environment variables
3. Build command issues

**Solution**:
```bash
# Test build locally
npm run build

# Fix TypeScript errors
npm run type-check

# Check Vercel logs for specific errors
```

### API routes timeout

**Problem**: "Function execution timeout"

**Solution**:
1. Optimize long-running processes
2. Increase timeout in Vercel (Pro plan)
3. Break into smaller operations
4. Use background jobs for heavy processing

## Browser-Specific Issues

### Safari issues

**Problem**: Features don't work in Safari

**Solutions**:
1. Check for webkit-specific CSS issues
2. Verify JavaScript compatibility
3. Test with Safari Developer Tools

### Mobile issues

**Problem**: UI broken on mobile

**Solutions**:
1. Test responsive design
2. Check touch event handlers
3. Verify mobile viewport settings

```html
<!-- Ensure viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Common Error Messages

### "Unauthorized"
- Check if user is logged in
- Verify authentication token
- Check RLS policies

### "Project not found"
- Verify project ID is correct
- Check user owns the project
- Ensure project exists in database

### "Failed to fetch"
- Check network connection
- Verify API endpoint is correct
- Check CORS configuration
- Verify API route is deployed

### "Maximum payload size exceeded"
- File is too large
- Compress before uploading
- Check size limits

## Getting Help

If you're still stuck:

1. **Check logs**:
   - Browser console
   - Vercel function logs
   - Supabase logs
   - Cloudinary logs

2. **Search documentation**:
   - Next.js docs
   - Supabase docs
   - Cloudinary docs

3. **Common debugging steps**:
   ```bash
   # Clear everything
   rm -rf .next node_modules
   npm install
   npm run dev
   
   # Check environment
   echo $NEXT_PUBLIC_SUPABASE_URL
   
   # Test database connection
   curl $NEXT_PUBLIC_SUPABASE_URL
   ```

4. **Create minimal reproduction**:
   - Isolate the issue
   - Create simple test case
   - Share code snippets

5. **Check GitHub issues**:
   - Search existing issues
   - Create new issue with details

## Debug Mode

Enable debug logging:

```typescript
// Add to lib/utils.ts
export const DEBUG = process.env.NODE_ENV === 'development'

export const debug = (...args: any[]) => {
  if (DEBUG) console.log('[DEBUG]', ...args)
}

// Use in your code
debug('Font loading:', fontUrl)
```

## Health Check

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  })
}
```

Visit `/api/health` to verify app is running.

---

**Still need help?** Open an issue on GitHub with:
- Error message
- Steps to reproduce
- Environment (OS, browser, Node version)
- Screenshots (if applicable)
