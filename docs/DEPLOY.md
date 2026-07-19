# Deploying

launchfolio is plain static files — host it anywhere. Three targets are wired up.

Copy `deploy.config.example` → `deploy.config` and fill in your values first
(`deploy.config` is gitignored).

---

## GitHub Pages (free, zero infra)
1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: “GitHub Actions”.**
3. The included `.github/workflows/deploy-pages.yml` publishes on every push to `main`.

Custom domain: add it under Settings → Pages, and create a `CNAME` DNS record pointing to
`<user>.github.io` (or an `A`/`ALIAS` for an apex domain).

---

## Azure App Service (Windows)
Prereqs: [Azure CLI](https://learn.microsoft.com/cli/azure/), `az login`, and `zip`.

One-time (create the app):
```bash
az group create -n my-portfolio-rg -l westeurope
az appservice plan create -g my-portfolio-rg -n my-plan --sku B1
az webapp create -g my-portfolio-rg -p my-plan -n my-portfolio-app
```
Set `AZURE_RESOURCE_GROUP` / `AZURE_APP_NAME` in `deploy.config`, then:
```bash
npm run deploy:azure
```
`web.config` (included) sets `index.html` as the default document and the custom 404.
Custom domain + free TLS: `az webapp config hostname add …` then create a managed
certificate and bind it (see Azure docs).

---

## AWS (S3 + CloudFront)
Prereqs: [AWS CLI](https://aws.amazon.com/cli/) with credentials.

One-time setup:
```bash
# 1. Bucket (private; served via CloudFront)
aws s3api create-bucket --bucket my-portfolio-bucket \
  --region eu-central-1 --create-bucket-configuration LocationConstraint=eu-central-1

# 2. Create a CloudFront distribution with:
#    - Origin = the S3 bucket (use Origin Access Control)
#    - Default root object = index.html
#    - Custom error response: 404 -> /404.html (HTTP 404)
#    - ACM certificate (in us-east-1) if you want a custom domain + HTTPS
# The console wizard is the easiest path; note the Distribution ID.
```
Set `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DISTRIBUTION_ID`, `AWS_REGION` in `deploy.config`, then:
```bash
npm run deploy:aws
```
This syncs the site and invalidates the CDN. (Leave the distribution id blank to skip
invalidation, e.g. if you use S3 static-website hosting directly.)

---

## Netlify / Cloudflare Pages / Vercel
No build command; publish directory is the repo root (`.`). Connect the repo in the
dashboard and deploy — that's it.
