# Cloudflare Pages Deployment Guide

This guide will walk you through deploying your interactive lessons to Cloudflare Pages. No coding experience is required!

## Prerequisites

1. A Cloudflare account (free) - [Sign up here](https://dash.cloudflare.com/sign-up/pages)
2. Your project code in a GitHub, GitLab, or Bitbucket repository

## Step 1: Prepare Your Repository

1. Create a new repository on GitHub (or your preferred Git provider)
2. Upload your project files to this repository
   - You can drag and drop files directly to GitHub's web interface
   - Or use GitHub Desktop if you prefer a graphical interface

## Step 2: Deploy to Cloudflare Pages

1. Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/)
2. In the left sidebar, click on "Pages"
3. Click "Create a project"
4. Connect your Git provider (GitHub/GitLab/Bitbucket)
5. Select your repository

### Project Setup

1. **Project name**: Choose a name (e.g., "interactive-lessons")
2. **Production branch**: Select "main" or "master" (whichever you're using)
3. **Framework preset**: Select "None" (we're using vanilla HTML/JS)
4. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave as default)
5. Click "Save and Deploy"

## Step 3: Configure Your Domain (Optional)

1. After deployment, go to your project in Cloudflare Pages
2. Click on "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to connect your domain

## Step 4: Verify Your Deployment

1. Once deployed, you'll get a URL like: `https://your-project.pages.dev`
2. Visit the URL to ensure everything works
3. Test on different devices and browsers

## Common Issues & Solutions

### 1. Build Failures
- **Issue**: Build fails with errors
- **Solution**:
  1. Check the build logs in Cloudflare Pages
  2. Make sure all files are committed to your repository
  3. Ensure `package.json` has all required dependencies

### 2. Missing Styles/JavaScript
- **Issue**: Page loads but looks broken
- **Solution**:
  1. Check if all file paths in your HTML are correct
  2. Make sure all assets are in the right directories
  3. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)

### 3. 404 Errors
- **Issue**: Some pages don't load
- **Solution**:
  1. Check if all file names match exactly (case-sensitive)
  2. Make sure links in your HTML are correct
  3. Add a `_redirects` file in your public folder if using client-side routing

## Updating Your Site

1. Make changes to your files
2. Commit and push to your repository
3. Cloudflare Pages will automatically detect changes and trigger a new deployment

## Need Help?

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Contact Support](https://support.cloudflare.com/)

## Troubleshooting

### I don't see my changes
- Wait a few minutes for the deployment to complete
- Clear your browser cache
- Check the deployment status in Cloudflare Pages

### Build is stuck
- Go to your project in Cloudflare Pages
- Click on the deployment that's stuck
- Click "Retry deployment"

### Custom domain not working
- Double-check your DNS settings
- Make sure you've added the required DNS records
- It can take up to 24 hours for DNS changes to propagate

## Advanced Configuration

### Environment Variables
If your project needs environment variables:
1. Go to your project in Cloudflare Pages
2. Click on "Settings" > "Environment variables"
3. Add your variables (e.g., `API_KEY=your_key`)

### Custom Build Command
If you need to customize the build process, edit the `build` script in your `package.json` file.

## Congratulations! 🎉

Your interactive lessons are now live on Cloudflare Pages! Share your site with others and gather feedback.

---
*Last updated: June 2023*
