# 3Jars Web Deployment Guide

This guide will help you deploy your 3Jars app to the web, making it publicly accessible from anywhere.

## Option 1: Deploy to Vercel (Recommended - Free)

Vercel is the company behind Next.js and offers the easiest deployment experience.

### Prerequisites
- GitHub account (free at github.com)
- Vercel account (free at vercel.com)

### Step-by-Step Deployment

#### 1. Push Your Code to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit of 3Jars app"

# Create a new repository on GitHub.com
# Then add the remote origin
git remote add origin https://github.com/YOUR_USERNAME/3jars.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 2. Deploy with Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project name? 3jars
# - Which directory is your code in? ./
# - Want to override settings? No
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_PARENT_PASSWORD=your_password
   ```
5. Click "Deploy"

### Custom Domain (Optional)
```bash
# In Vercel Dashboard > Settings > Domains
# Add your custom domain (e.g., 3jars.yourdomain.com)
# Follow DNS configuration instructions
```

## Option 2: Deploy to Netlify (Alternative - Free)

### Step-by-Step
1. Push code to GitHub (same as above)
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in Site Settings → Environment Variables
7. Deploy

## Option 3: Self-Hosted VPS (Advanced)

### Using a VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt-get install nginx
```

#### 2. Deploy Application
```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/3jars.git
cd 3jars

# Install dependencies
npm install

# Create .env.local with your variables
nano .env.local

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "3jars" -- start
pm2 save
pm2 startup
```

#### 3. Configure Nginx
```nginx
# /etc/nginx/sites-available/3jars
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/3jars /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (HTTPS)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Security Checklist

### Before Going Public

1. **Environment Variables**
   - ✅ All sensitive data in environment variables
   - ✅ Never commit `.env.local` to git
   - ✅ Use strong parent password

2. **Supabase Security**
   - ✅ Enable Row Level Security (RLS)
   - ✅ Add authentication policies
   - ✅ Review database permissions

3. **Application Security**
   - ✅ Update all dependencies: `npm update`
   - ✅ Run security audit: `npm audit fix`
   - ✅ Test all password-protected features

4. **Database Policies** (Add to Supabase SQL Editor)
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jars ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (example - adjust based on your auth strategy)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

## Monitoring & Maintenance

### Setup Monitoring

1. **Vercel Analytics** (Built-in)
   - Enable in Vercel Dashboard → Analytics

2. **Supabase Monitoring**
   - Check Dashboard → Reports for usage

3. **Error Tracking (Optional)**
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
```

### Regular Maintenance

- **Weekly**: Check Supabase usage and limits
- **Monthly**: Review and backup database
- **Quarterly**: Update dependencies and security patches

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

2. **Environment variables not loading**
   - Ensure variables are added in hosting platform
   - Restart/redeploy after adding variables

3. **Database connection issues**
   - Check Supabase URL is correct
   - Verify API keys are valid
   - Check Supabase project is not paused

## Cost Considerations

### Free Tier Limits

**Vercel Free**
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS

**Supabase Free**
- ✅ 500MB database
- ✅ 2GB storage
- ✅ 50,000 monthly active users

**When to Upgrade**
- More than 50 active families using the app
- Need more than 500MB of transaction data
- Want custom domain with better performance

## Quick Deploy Commands

### One-Click Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/3jars&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_PARENT_PASSWORD)

### Deploy Script
Create `deploy.sh`:
```bash
#!/bin/bash
echo "Building application..."
npm run build

echo "Running tests..."
npm test

echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
```

## Support & Help

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Summary

**Fastest Path to Public Web:**
1. Push to GitHub (5 minutes)
2. Connect to Vercel (2 minutes)
3. Add environment variables (1 minute)
4. Deploy (3 minutes)

Total time: ~15 minutes to have your app live on the web!

Your app will be available at:
- Vercel: `https://3jars.vercel.app`
- Custom: `https://3jars.yourdomain.com`

Remember to test thoroughly before sharing the URL with other families!