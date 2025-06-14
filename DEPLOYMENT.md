
# GitHub Pages Deployment Guide

## Setup Instructions

1. **Update Repository Name**: In `vite.config.ts`, replace `your-repo-name` with your actual GitHub repository name.

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Set Source to "GitHub Actions"

3. **Environment Variables** (if using Supabase):
   - Go to repository Settings → Secrets and variables → Actions
   - Add your environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**:
   - Push to the main branch
   - GitHub Actions will automatically build and deploy
   - Your site will be available at: `https://your-username.github.io/your-repo-name/`

## Manual Deployment

If you prefer manual deployment:

```bash
npm run build
# Upload the dist/ folder contents to your hosting provider
```

## Important Notes

- The site uses client-side routing, which is handled by the 404.html redirect
- All routes will work correctly on GitHub Pages
- The base URL is automatically configured for production builds
- Admin features require proper Supabase configuration
