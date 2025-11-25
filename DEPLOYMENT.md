# AppBaran - Deployment Guide

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages with the custom domain `https://appbaran.minitomate.com`.

### Initial Setup Steps

1. **Create a GitHub Repository** (if not already created):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Configure GitHub Secrets**:
   Go to your repository on GitHub → Settings → Secrets and variables → Actions → New repository secret
   
   Add these three secrets:
   - `VITE_AIRTABLE_TOKEN`: Your Airtable API token
   - `VITE_AIRTABLE_BASE_ID`: Your Airtable base ID
   - `VITE_AIRTABLE_TABLE_NAME`: Your Airtable table name

3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Under "Build and deployment"
   - Source: Select "GitHub Actions"

4. **Configure Custom Domain** (DNS Setup):
   In your DNS provider (where `minitomate.com` is registered), add these records:
   
   ```
   Type: CNAME
   Name: appbaran
   Value: YOUR_USERNAME.github.io
   TTL: 3600 (or Auto)
   ```

5. **Set Custom Domain in GitHub**:
   - Go to Settings → Pages
   - Under "Custom domain", enter: `appbaran.minitomate.com`
   - Click Save
   - Wait for DNS check to complete (may take a few minutes)
   - Enable "Enforce HTTPS" once DNS is verified

### Automatic Deployment

Every time you push to the `main` branch, GitHub Actions will:
1. Build the application
2. Deploy it to GitHub Pages
3. Make it available at `https://appbaran.minitomate.com`

### Manual Deployment (Alternative)

If you prefer manual deployment:

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Deploy manually:
   ```bash
   npm run deploy
   ```

### Important Notes

- The CNAME file in the `public/` folder ensures your custom domain persists after each deployment
- Environment variables are securely injected during the GitHub Actions build process
- Make sure to never commit your `.env` file to the repository
