# 🚀 Deployment Checklist

Quick reference for deploying to GitHub + Netlify.

## ✅ Pre-Deployment (COMPLETED)

- [x] Git repository initialized
- [x] Initial commit created  
- [x] Branch renamed to `main`
- [x] `netlify.toml` created and configured
- [x] TypeScript build verified (no errors)
- [x] `.gitignore` properly configured
- [x] All dependencies installed
- [x] Development server tested

## 📋 Deployment Steps (TO DO)

### 1. Create GitHub Repository

**Option A: Web Interface**
```
1. Go to: https://github.com/new
2. Repository name: org-chart-cambridge
3. Description: Organizational chart plugin for Sigma Computing
4. ⚠️ DO NOT initialize with README/gitignore/license
5. Click "Create repository"
```

**Option B: GitHub CLI**
```bash
gh repo create org-chart-cambridge --public --source=. --remote=origin --push
```

### 2. Push to GitHub

Copy the commands from GitHub (after creating repo):

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/org-chart-cambridge.git

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/ramsmith/org-chart-cambridge.git
git push -u origin main
```

### 3. Deploy to Netlify

```
1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select repository: org-chart-cambridge
5. Build settings (auto-detected from netlify.toml):
   - Branch: main
   - Build command: npm run build
   - Publish directory: dist
6. Click "Deploy site"
```

### 4. Get Deployment URL

After deployment:
```
Your site will be at:
https://[site-name].netlify.app

Optional: Customize subdomain to:
https://org-chart-cambridge.netlify.app
```

### 5. Configure in Sigma

```
1. Open Sigma workbook
2. Add Custom Plugin element
3. Enter URL: https://org-chart-cambridge.netlify.app
4. Map data columns (see QUICKSTART.md)
5. Test ✅
```

## 🔧 Quick Commands Reference

```bash
# Current working directory
cd /Users/ram/Documents/Sigma-Plugins/sandbox/org-chart-cambridge

# Check git status
git status

# View commit history
git log --oneline

# Test build locally
npm run build

# Start dev server
npm run dev
```

## 📁 Important Files

| File | Status | Purpose |
|------|--------|---------|
| `netlify.toml` | ✅ Ready | Netlify configuration |
| `.gitignore` | ✅ Ready | Git exclusions |
| `package.json` | ✅ Ready | Dependencies |
| `dist/` | ✅ Built | Production build |
| `.git/` | ✅ Init | Git repository |

## ⚡ After Deployment

### Automatic Deploys

Every `git push` to main branch will:
1. Trigger Netlify build
2. Run `npm install`
3. Run `npm run build`
4. Deploy to production
5. Update live site

### Making Updates

```bash
# Make changes to code
# Test locally: npm run dev
# Build test: npm run build

# Commit and push
git add .
git commit -m "Your change description"
git push origin main

# Netlify auto-deploys ✅
```

## 🐛 Troubleshooting

### If build fails on Netlify:
1. Check deploy logs in Netlify dashboard
2. Verify build works locally: `npm run build`
3. Check TypeScript errors: `tsc --noEmit`

### If Sigma can't load plugin:
1. Check CORS headers in netlify.toml (already configured)
2. Verify URL is correct
3. Check browser console for errors

### If changes don't appear:
1. Hard refresh browser (Cmd+Shift+R)
2. Clear Netlify deploy cache
3. Check git push succeeded: `git log`

## 📊 Build Verification

Last successful build:
```bash
$ npm run build
✓ 670 modules transformed.
✓ built in 1.23s
```

Build output:
```
dist/index.html                   0.40 kB
dist/assets/index-Cvj8c080.css   10.46 kB
dist/assets/index-7WSuqcpL.js   267.75 kB
```

## 🎯 Success Criteria

Plugin is successfully deployed when:
- [ ] Code is on GitHub
- [ ] Netlify deploys successfully
- [ ] URL is accessible
- [ ] Plugin loads in Sigma
- [ ] Data displays correctly
- [ ] Search works
- [ ] Interactions work (expand/collapse, zoom, pan)

## 📚 Documentation

- `DEPLOYMENT.md` - Full deployment guide
- `QUICKSTART.md` - Quick start guide  
- `README.md` - Complete documentation
- `DEVELOPMENT.md` - Development guide

## 🆘 Need Help?

1. Check `DEPLOYMENT.md` for detailed instructions
2. View build logs in Netlify dashboard
3. Check browser console for errors
4. Verify git status: `git status`

---

**Status**: ✅ Ready for GitHub + Netlify deployment

**Next Action**: Create GitHub repository and push code

**Estimated Time**: 5-10 minutes

Good luck! 🚀

