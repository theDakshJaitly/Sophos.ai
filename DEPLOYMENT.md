# Deployment Guide

This guide covers deploying Sophos.ai to production.

---

## Architecture Overview

Sophos.ai consists of two main components:
- **Frontend**: Next.js application
- **Backend**: Express.js API server

Both need to be deployed separately and configured to communicate.

---

## Frontend Deployment (Vercel)

Vercel is the recommended platform for Next.js applications.

### Prerequisites
- Vercel account
- GitHub repository
- Supabase project

### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the root directory

3. **Configure Environment Variables**
   
   In Vercel project settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

4. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

## Backend Deployment (Railway)

Railway is recommended for the Express.js backend.

### Prerequisites
- Railway account
- GitHub repository with backend code
- Environment variables ready

### Steps

1. **Prepare Backend**
   
   Ensure `package.json` has:
   ```json
   {
     "scripts": {
       "start": "node dist/index.js",
       "build": "tsc",
       "dev": "nodemon src/index.ts"
     }
   }
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Create New Project → Deploy from GitHub
   - Select your repository
   - Choose `SophosBackEnd` directory if monorepo

3. **Configure Environment Variables**
   
   In Railway project → Variables, add:
   ```
   PORT=3001
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_key
   GROQ_API_KEY=your_groq_key (optional)
   GOOGLE_API_KEY=your_google_key (optional)
   NODE_ENV=production
   ```

4. **Build Configuration**
   
   In Settings → Build:
   - Root Directory: `SophosBackEnd` (if monorepo)
   - Build Command: `npm run build`
   - Start Command: `npm start`

5. **Deploy**
   - Railway will auto-deploy on push to main
   - Get your public URL from the deployment
   - Update frontend's `NEXT_PUBLIC_API_URL` with this URL

### Health Check Endpoint

Add health check to `src/index.ts`:
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

Test: `curl https://your-backend.railway.app/health`

---

## Alternative Deployment Options

### Frontend Alternatives

#### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Select Next.js preset
3. Configure environment variables
4. Deploy

### Backend Alternatives

#### Render
1. Create new Web Service
2. Connect GitHub repository
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables

#### Heroku
```bash
# Install Heroku CLI
heroku create sophos-backend

# Set environment variables
heroku config:set SUPABASE_URL=...
heroku config:set OPENAI_API_KEY=...

# Deploy
git push heroku main
```

#### DigitalOcean App Platform
Similar to Render, with GitHub integration

---

## Database Setup (Supabase)

Supabase is already cloud-hosted, no additional deployment needed.

### Production Checklist

1. **Enable Row Level Security** on all tables
2. **Set up backups** (automatic on paid plans)
3. **Review auth settings**:
   - Enable email confirmations
   - Configure OAuth redirect URLs
   - Set password requirements

4. **Configure CORS** in Supabase API settings
   ```
   Allowed origins: https://your-frontend.vercel.app
   ```

5. **Monitor usage** to stay within tier limits

---

## Environment Variables Summary

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend (.env)
```bash
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_... (optional)
GOOGLE_API_KEY=... (optional)
NODE_ENV=production
```

---

## Post-Deployment

### 1. Test Functionality
- [ ] User authentication (email & Google)
- [ ] PDF upload and processing
- [ ] YouTube video processing
- [ ] GitHub repository processing
- [ ] Chat functionality
- [ ] Quiz generation
- [ ] Notes generation

### 2. Monitor Performance
- Check Vercel Analytics for frontend metrics
- Monitor Railway logs for backend errors
- Track Supabase usage and query performance

### 3. Set up Monitoring (Optional)

#### Sentry for Error Tracking
```bash
npm install @sentry/nextjs @sentry/node
```

Configure in frontend and backend to catch production errors.

#### Logging
Use Winston or Pino in backend:
```bash
npm install winston
```

### 4. Security Hardening

- **API Rate Limiting**: Consider adding rate limiting to backend
- **CORS**: Restrict to production domain only
- **Headers**: Set security headers in Vercel
  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  }
  ```

---

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **Pull Requests** → Preview deployments  
3. **Main branch** → Production deployment

Configure branch settings in platform dashboards.

---

## Rollback Strategy

### Vercel
- Go to Deployments tab
- Find previous working deployment
- Click "Promote to Production"

### Railway
- Go to Deployments
- Select previous deployment
- Click "Redeploy"

---

## Cost Estimates

### Free Tier (Development)
- Vercel: Free (Hobby plan)
- Railway: $5/month credits
- Supabase: Free (500MB database)
- OpenAI: Pay-as-you-go (~$1-5/month for light usage)

### Production (Moderate Usage)
- Vercel Pro: $20/month
- Railway: ~$10-20/month
- Supabase Pro: $25/month
- OpenAI: ~$20-50/month (depends on usage)

**Total**: ~$75-115/month for moderate usage

---

## Troubleshooting

### Frontend Build Fails
- Check environment variables are set
- Verify Next.js version compatibility
- Check for TypeScript errors: `npm run type-check`

### Backend Crashes
- Check Railway logs for errors
- Verify all environment variables are set
- Test database connection
- Check OpenAI API key validity

### CORS Errors
- Verify frontend URL in backend CORS config
- Check Supabase CORS settings
- Ensure API URL is correct in frontend

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure service role key has permissions

---

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Review Supabase usage monthly
- Update dependencies monthly
- Backup database regularly (if no auto-backup)

### Scaling Considerations
- Vercel scales automatically
- Railway: upgrade plan for more resources
- Supabase: upgrade tier for more storage/bandwidth
- OpenAI: monitor token usage

---

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
