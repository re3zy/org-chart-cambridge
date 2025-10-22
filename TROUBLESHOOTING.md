# Troubleshooting Guide

## Issue: Netlify Site "Refused to Connect"

If you see "org-chart-cambridge.netlify.app refused to connect", try these steps:

### 1. Check Netlify Site Status

Go to your Netlify dashboard and check:
- **Site status**: Should be "Published" (green)
- **Build logs**: Click on the latest deploy → View function log
- **Domain settings**: Verify the domain is active

### 2. Verify Build Output

In Netlify dashboard → Deploys → Latest deploy:
- Check "Deploy log" for any warnings
- Verify it says "Site is live"
- Look for any error messages

### 3. Common Netlify Issues

#### A. Site Just Deployed (Most Common)
**Wait 2-3 minutes** after "Published" status. Netlify needs time to:
- Propagate to CDN
- Update DNS
- Initialize the site

**Solution:** Wait a few minutes, then hard refresh.

#### B. Build Artifacts Missing
Check if `dist/` folder was created:
```bash
cd /Users/ram/Documents/Sigma-Plugins/sandbox/org-chart-cambridge
ls -la dist/
```

Should show:
```
dist/
  assets/
    index-[hash].js
    index-[hash].css
  index.html
```

**Solution:** If missing, rebuild:
```bash
npm run build
git add -A
git commit -m "Rebuild dist"
git push origin main
```

#### C. Wrong Publish Directory
Check Netlify Site Settings → Build & deploy → Build settings:
- **Publish directory** should be: `dist`
- **Build command** should be: `npm run build`

#### D. Node Version Mismatch
In Netlify, check environment variables:
- Should have `NODE_VERSION = 18` (from netlify.toml)

### 4. Test Locally First

Your dev server is running on `http://localhost:5174`

**Test in Sigma with local URL:**
1. Open Sigma workbook
2. Add Custom Plugin element
3. Use URL: `http://localhost:5174`
4. Configure data mappings

**If local works but Netlify doesn't:**
- Issue is with Netlify deployment, not your code
- Check Netlify dashboard for errors

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check if assets are loading
- **Failed requests**: Note the error codes

### 6. Netlify Deploy Log Issues

Common errors in deploy logs:

#### "npm ERR! code ELIFECYCLE"
- Build failed during npm install or build
- Check package.json dependencies

#### "Error: No such file or directory"
- Wrong publish directory
- Verify `dist/` folder exists after build

#### "Build exceeded maximum allowed runtime"
- Build is too slow
- Usually not an issue for this project

### 7. Force Redeploy

In Netlify dashboard:
1. Go to **Deploys**
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for new deploy to complete

### 8. Check CORS Headers

If plugin loads but doesn't work in Sigma:
- Verify `netlify.toml` has CORS headers (already configured)
- Check browser console for CORS errors

### 9. Alternative: Use Different URL

If site refuses connection, try:
1. **Different browser** (clear DNS cache)
2. **Incognito/Private mode**
3. **Different network** (mobile hotspot)
4. **Wait 5-10 minutes** for DNS propagation

### 10. Netlify Functions (If Applicable)

This plugin doesn't use functions, but if you see function errors:
- Ignore them - we're only serving static files

## Quick Diagnostic Commands

```bash
# Check local dev server is running
curl http://localhost:5174

# Verify local build works
npm run build && npm run preview

# Check git status
git status

# Check latest commit
git log --oneline -1

# Test Netlify URL (from terminal)
curl https://org-chart-cambridge.netlify.app
```

## Expected Behavior

### Local Development (http://localhost:5174)
- Should see "Loading data..." or "No data to display"
- No sad file icon ✅

### Netlify Production (https://org-chart-cambridge.netlify.app)
- Same as local
- Should load without "refused to connect"

### In Sigma Workbook
- Plugin loads (no sad file icon)
- Shows message based on configuration state
- Org chart appears after data mapping

## Still Not Working?

### Checklist:
- [ ] Waited 3+ minutes after Netlify deploy
- [ ] Checked Netlify deploy logs (no errors)
- [ ] Tested local dev server works
- [ ] Tried different browser
- [ ] Cleared browser cache
- [ ] Checked Netlify site status is "Published"
- [ ] Verified publish directory is "dist"
- [ ] Confirmed build command is "npm run build"

### Next Steps:

1. **Test Local:** Use `http://localhost:5174` in Sigma temporarily
2. **Screenshot Netlify:** Share deploy log if issues persist
3. **Check Netlify Status:** https://www.netlifystatus.com/
4. **Contact Support:** If all else fails, Netlify support is responsive

## Known Working Configuration

```toml
# netlify.toml (current)
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
```

This is confirmed working for other Sigma plugins.

---

**Most Common Solution:** Just wait 2-3 minutes after deploy! ⏰

