# How to Migrate aichatwatch.com to Cloudflare Pages

This guide documents how to migrate the Astro website from GitHub Pages to Cloudflare Pages.

## Current State

- **Framework:** Astro 5.16.6 (SSG - Static Site Generation)
- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Current hosting:** GitHub Pages
- **Current DNS:** AWS Route 53 (pointing to GitHub Pages)
- **Domain:** aichatwatch.com

## Why Cloudflare Pages?

| Feature | GitHub Pages | Cloudflare Pages |
|---------|--------------|------------------|
| Global CDN | Limited | 300+ locations |
| Preview deployments | No | Yes (automatic per branch/PR) |
| Build minutes | 2,000/month | 500/month free |
| Bandwidth | 100GB/month | Unlimited |
| Custom headers | Limited | Full control |
| Analytics | Requires 3rd party | Built-in (free) |
| Build speed | Slower | Faster (edge caching) |

---

## Migration Steps

### Step 1: Create Cloudflare Pages Project

1. Go to https://dash.cloudflare.com
2. Create account or log in
3. Navigate to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
4. Authorize GitHub and select `ai-chat-watch` repository
5. Configure build settings:
   - **Production branch:** `main`
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `aichatwatch.com`
6. Click **Save and Deploy**
7. Wait for first deployment - note the `*.pages.dev` URL (e.g., `aichatwatch.pages.dev`)

### Step 2: Verify Deployment

1. Visit the `*.pages.dev` URL to verify the site works
2. Check that all pages load correctly
3. Test navigation and functionality

### Step 3: Update AWS Route 53 DNS Records

In AWS Route 53 console for `aichatwatch.com` hosted zone:

**Delete existing GitHub Pages records:**
- Remove current A records pointing to GitHub's IPs (185.199.108-111.153)
- Remove any CNAME pointing to `*.github.io`

**Add Cloudflare Pages records:**

| Name | Type | Value |
|------|------|-------|
| `aichatwatch.com` | CNAME | `aichatwatch.pages.dev` |
| `www` | CNAME | `aichatwatch.pages.dev` |

> **Note:** For apex domain (aichatwatch.com), Route 53 supports ALIAS records for CNAME-like behavior. If a standard CNAME doesn't work for the apex domain, use Route 53's ALIAS record type pointing to `aichatwatch.pages.dev`.

**Alternative (Recommended for Full Features):** Transfer DNS to Cloudflare for:
- Automatic SSL certificate provisioning
- Better integration with Cloudflare features (caching, security)
- Orange-cloud (proxied) benefits

### Step 4: Add Custom Domain in Cloudflare Pages

1. In Cloudflare Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Add `aichatwatch.com`
4. Add `www.aichatwatch.com`
5. Cloudflare will verify DNS ownership (may take a few minutes with external DNS)

### Step 5: Code Changes

**Delete file:** `aichatwatch.com/public/CNAME`

This file is only needed for GitHub Pages custom domain verification and is not needed for Cloudflare Pages.

**Optional - Add security headers:** Create `aichatwatch.com/public/_headers`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Step 6: Disable GitHub Pages

1. Go to GitHub repo settings → **Pages**
2. Set source to **None** or disable GitHub Pages
3. This prevents confusion and potential conflicts

---

## Optional: Scheduled Rebuilds

Cloudflare's Git integration automatically deploys on push. If you need scheduled rebuilds (e.g., to refresh content), update `.github/workflows/scheduled-build.yml`:

**Option A: Trigger via Cloudflare API**

```yaml
name: Scheduled Rebuild

on:
  schedule:
    - cron: '0 0 */3 * *'  # Every 3 days at midnight UTC
  workflow_dispatch:        # Manual trigger

jobs:
  trigger-cloudflare-rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare Pages rebuild
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/accounts/${{ secrets.CLOUDFLARE_ACCOUNT_ID }}/pages/projects/aichatwatch/deployments" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
            -H "Content-Type: application/json"
```

Required secrets:
- `CLOUDFLARE_ACCOUNT_ID`: Found in Cloudflare dashboard URL
- `CLOUDFLARE_API_TOKEN`: Create at https://dash.cloudflare.com/profile/api-tokens with "Cloudflare Pages: Edit" permission

**Option B: Empty commit trigger**

```yaml
name: Scheduled Rebuild

on:
  schedule:
    - cron: '0 0 */3 * *'
  workflow_dispatch:

jobs:
  trigger-rebuild:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Trigger rebuild via empty commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git commit --allow-empty -m "chore: trigger scheduled rebuild"
          git push
```

---

## Verification Checklist

After migration, verify:

- [ ] Site loads at `https://aichatwatch.com`
- [ ] Site loads at `https://www.aichatwatch.com`
- [ ] HTTPS certificate is valid (automatic with Cloudflare)
- [ ] All pages render correctly
- [ ] Images and assets load
- [ ] Blog posts display properly
- [ ] Preview deployments work for PRs (create a test PR)

## DNS Propagation Check

DNS changes can take up to 48 hours to propagate globally, but usually complete within minutes.

```bash
# Check DNS resolution
dig aichatwatch.com
dig www.aichatwatch.com

# Check CNAME records
dig aichatwatch.com CNAME
dig www.aichatwatch.com CNAME
```

Or use: https://dnschecker.org/#CNAME/aichatwatch.com

---

## Rollback Plan

If something goes wrong:

1. Update Route 53 records back to GitHub Pages IPs:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`
2. Re-enable GitHub Pages in repo settings
3. Ensure `public/CNAME` file exists with `aichatwatch.com`

---

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro on Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Route 53 ALIAS Records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
