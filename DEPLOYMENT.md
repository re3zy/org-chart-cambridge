# Deployment Guide - GitHub + Netlify

This guide walks you through deploying the Org Chart Plugin to GitHub and automatically deploying it with Netlify.

## Prerequisites

- GitHub account
- Netlify account (can sign up with GitHub)
- Git installed locally (✅ Already done!)

## Step 1: Create GitHub Repository

### Option A: GitHub Web Interface

1. **Go to GitHub** → https://github.com/new
2. **Repository name**: `org-chart-cambridge` (or your preferred name)
3. **Description**: "Organizational chart plugin for Sigma Computing"
4. **Visibility**: Choose Public or Private
5. **⚠️ DO NOT initialize with README, .gitignore, or license** (we already have these)
6. **Click "Create repository"**

### Option B: GitHub CLI

```bash
gh repo create org-chart-cambridge --public --source=. --remote=origin --push
```

## Step 2: Push to GitHub

After creating the repository on GitHub, you'll see commands like these. Run them:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/org-chart-cambridge.git

# Push code to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/ramsmith/org-chart-cambridge.git
git push -u origin main
```

### Verify Upload

Visit your repository URL to confirm all files are uploaded:
```
https://github.com/YOUR_USERNAME/org-chart-cambridge
```

## Step 3: Deploy to Netlify

### Method 1: Netlify Web Interface (Recommended)

1. **Go to Netlify** → https://app.netlify.com
2. **Sign in** with your GitHub account (if not already)
3. **Click "Add new site" → "Import an existing project"**
4. **Choose "Deploy with GitHub"**
5. **Authorize Netlify** to access your GitHub (if first time)
6. **Select your repository**: `org-chart-cambridge`
7. **Configure build settings** (should auto-detect from netlify.toml):
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build` (auto-detected)
   - **Publish directory**: `dist` (auto-detected)
   - **Node version**: 18 (from netlify.toml)
8. **Click "Deploy site"**

### Method 2: Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: org-chart-cambridge (or auto-generated)
# - Build command: npm run build
# - Publish directory: dist

# Deploy
netlify deploy --prod
```

## Step 4: Get Your Deployment URL

After deployment completes, Netlify will provide:

**Temporary URL** (example):
```
https://silly-name-123456.netlify.app
```

**Custom Domain** (optional):
```
https://org-chart-cambridge.netlify.app
```

### Set Custom Subdomain

1. Go to **Site settings** → **Domain management**
2. Click **Options** → **Edit site name**
3. Change to: `org-chart-cambridge`
4. Save

Your plugin will be available at:
```
https://org-chart-cambridge.netlify.app
```

## Step 5: Configure in Sigma Computing

1. **Open your Sigma workbook**
2. **Add Custom Plugin element**
3. **Enter your Netlify URL**:
   ```
   https://org-chart-cambridge.netlify.app
   ```
4. **Configure data mappings** (see QUICKSTART.md)
5. **Test and verify** ✅

## Automatic Deployments

✅ **Already configured!** Every time you push to GitHub main branch, Netlify will automatically:

1. Pull latest changes
2. Run `npm install`
3. Run `npm run build`
4. Deploy to production
5. Send deployment notification

### View Build Logs

Go to Netlify dashboard → Your site → **Deploys** to see:
- Build logs
- Deploy previews
- Rollback options

## Environment Variables (if needed)

If you need to add environment variables:

### In Netlify Dashboard

1. Go to **Site settings**
2. **Build & deploy** → **Environment**
3. **Add environment variable**
4. Example:
   - Key: `VITE_API_KEY`
   - Value: `your-api-key`

### Access in Code

```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

## Making Updates

### Development Workflow

```bash
# 1. Make changes to code
# 2. Test locally
npm run dev

# 3. Verify build works
npm run build

# 4. Commit changes
git add .
git commit -m "Description of changes"

# 5. Push to GitHub (triggers auto-deploy)
git push origin main
```

### Deploy Previews (for branches)

Create a feature branch:
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

Netlify will create a **deploy preview** with unique URL for testing before merging.

## Troubleshooting

### Build Failed on Netlify

**Check build logs:**
1. Go to Netlify dashboard → **Deploys**
2. Click failed deploy
3. Check **Deploy log**

**Common issues:**

#### Missing dependencies
```bash
# Solution: Ensure package.json has all dependencies
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### TypeScript errors
```bash
# Solution: Fix errors locally first
npm run build  # Should succeed locally
```

#### Node version mismatch
```toml
# netlify.toml already sets Node 18
[build.environment]
  NODE_VERSION = "18"
```

### CORS Issues in Sigma

If you get CORS errors:

1. **Check netlify.toml** (already configured):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

2. **Redeploy** to ensure headers are applied

### Custom Domain Issues

If custom domain not working:
1. Check DNS settings
2. Wait for DNS propagation (can take 24-48 hours)
3. Verify SSL certificate is active

## Rollback

If a deployment breaks something:

1. Go to Netlify dashboard → **Deploys**
2. Find a working deployment
3. Click **⋯** → **Publish deploy**
4. Confirms rollback

## Cost

**Netlify Free Tier includes:**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic SSL
- ✅ Deploy previews
- ✅ Form handling
- ✅ Unlimited sites

**More than enough for this plugin!**

## Security Best Practices

1. **Never commit secrets** to Git:
   - Use environment variables in Netlify
   - Add `.env` to `.gitignore` (already done)

2. **Keep dependencies updated**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Review Netlify build logs** for warnings

4. **Use deploy previews** for testing changes

## Monitoring

### Netlify Analytics (Optional, Paid)

Enable in Netlify dashboard to track:
- Page views
- Unique visitors
- Top pages
- Traffic sources

### Free Monitoring

Use browser console in Sigma:
- Check for JavaScript errors
- Monitor network requests
- Verify data loading

## Additional Resources

- **Netlify Docs**: https://docs.netlify.com/
- **GitHub Docs**: https://docs.github.com/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

## Quick Reference

### Your Repository
```
https://github.com/YOUR_USERNAME/org-chart-cambridge
```

### Your Netlify Site
```
https://org-chart-cambridge.netlify.app
```

### Key Files for Deployment

| File | Purpose |
|------|---------|
| `netlify.toml` | Netlify build configuration |
| `.gitignore` | Files to exclude from Git |
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite build settings |
| `tsconfig.json` | TypeScript compiler settings |

### Essential Commands

```bash
# Local development
npm run dev

# Test production build
npm run build
npm run preview

# Git workflow
git add .
git commit -m "Message"
git push origin main

# Check status
git status
git log --oneline
```

## Support

- **Netlify Support**: https://answers.netlify.com/
- **GitHub Support**: https://support.github.com/
- **Project Issues**: Create issue on your GitHub repo

---

## ✅ Checklist

- [x] Git repository initialized
- [x] Initial commit created
- [x] Branch renamed to `main`
- [x] netlify.toml configured
- [x] TypeScript build verified
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Automatic deployments working
- [ ] Plugin tested in Sigma

**Next Steps:**
1. Create GitHub repository
2. Push code with commands in Step 2
3. Deploy to Netlify using Step 3

Good luck! 🚀

