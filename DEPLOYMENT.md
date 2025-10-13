# 🚀 Vercel Deployment Guide

Complete guide to deploy Glimtrics to production.

---

## 📋 **Pre-Deployment Checklist**

### ✅ **1. Code Ready**
- [x] All features working locally
- [x] Build passes (`npm run build`)
- [x] No TypeScript errors
- [x] All commits pushed to GitHub

### ✅ **2. Environment Variables**
You'll need these in Vercel:

```env
# Database (Supabase)
DATABASE_URL=
DIRECT_URL=

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=

# UploadThing
UPLOADTHING_TOKEN=

# OpenAI
OPENAI_API_KEY=

# Paddle Payments
PADDLE_API_KEY=
PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_PRO_PRICE_ID=
NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID=
```

### ✅ **3. Third-Party Services**
- [ ] Supabase database created
- [ ] UploadThing project setup
- [ ] OpenAI API key obtained
- [ ] Paddle account verified
- [ ] Paddle production products created

---

## 🎯 **Step-by-Step Deployment**

### **Step 1: Push to GitHub**

```bash
git status
git add -A
git commit -m "Ready for production deployment"
git push origin master
```

### **Step 2: Create Vercel Account**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### **Step 3: Import Project**

1. Click **"Add New"** → **"Project"**
2. Find **"glimtrics"** repository
3. Click **"Import"**

### **Step 4: Configure Build Settings**

Vercel should auto-detect Next.js. Verify:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **Step 5: Add Environment Variables**

Click **"Environment Variables"** and add all variables from your `.env` file:

**Database:**
```
DATABASE_URL=your_supabase_connection_string
DIRECT_URL=your_supabase_direct_url
```

**Auth:**
```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your_secret
```

**UploadThing:**
```
UPLOADTHING_TOKEN=your_token
```

**OpenAI:**
```
OPENAI_API_KEY=sk-proj-your_key
```

**Paddle:**
```
PADDLE_API_KEY=pdl_live_your_key
PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_your_token
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_PRO_PRICE_ID=pri_your_pro_price
NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID=pri_your_business_price
```

### **Step 6: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your site will be live at `https://your-project.vercel.app`

---

## 🔧 **Post-Deployment Configuration**

### **1. Update Paddle Webhook**

Go to Paddle Dashboard → Developer Tools → Notifications:
```
Webhook URL: https://your-domain.vercel.app/api/paddle/webhook
```

### **2. Update OAuth Providers**

**Google Cloud Console:**
```
Authorized redirect URIs:
https://your-domain.vercel.app/api/auth/callback/google
```

**GitHub OAuth Settings:**
```
Authorization callback URL:
https://your-domain.vercel.app/api/auth/callback/github
```

### **3. Update UploadThing**

Go to UploadThing Dashboard → Settings:
```
Allowed Origins:
https://your-domain.vercel.app
```

### **4. Test Production**

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] File upload works
- [ ] AI insights generate
- [ ] Paddle checkout opens
- [ ] Analytics charts display

---

## 🌐 **Custom Domain (Optional)**

### **Add Domain in Vercel**

1. Go to Project → Settings → Domains
2. Add your domain (e.g., `glimtrics.com`)
3. Update DNS records as instructed by Vercel

### **Update Environment Variables**

```env
NEXTAUTH_URL=https://glimtrics.com
```

### **Update All Services**

- Paddle webhook URL
- OAuth redirect URIs
- UploadThing allowed origins

---

## 🐛 **Troubleshooting**

### **Build Fails**

Check build logs for errors:
```bash
# Test locally first
npm run build
```

Common issues:
- Missing environment variables
- TypeScript errors
- Import path issues

### **Database Connection Fails**

Verify Supabase connection strings:
```
DATABASE_URL: Must have ?pgbouncer=true
DIRECT_URL: Direct connection without pgbouncer
```

### **NextAuth Errors**

```
Error: NEXTAUTH_URL not set
Solution: Add to Vercel environment variables
```

### **File Upload Fails**

Check UploadThing settings:
- Token is correct
- Domain is whitelisted
- File size limits configured

### **Paddle Checkout Doesn't Open**

Verify:
- Production client token starts with `live_`
- Price IDs are from production catalog
- Environment is set to `production`

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics** (Built-in)

Automatically tracks:
- Page views
- Performance
- Errors

### **Add Custom Analytics** (Optional)

**PostHog:**
```bash
npm install posthog-js
```

**Plausible:**
Add script to `app/layout.tsx`

---

## 🔒 **Security Best Practices**

### **Environment Variables**
- ✅ Never commit `.env` to git
- ✅ Use different keys for production
- ✅ Rotate secrets regularly

### **Database**
- ✅ Use Row Level Security in Supabase
- ✅ Limit connection pooling
- ✅ Monitor query performance

### **API Keys**
- ✅ Set usage limits on OpenAI
- ✅ Enable Paddle fraud detection
- ✅ Use UploadThing file scanning

---

## 🚀 **Continuous Deployment**

Every `git push` to master will automatically:
1. Trigger Vercel build
2. Run type checks
3. Deploy if successful
4. Update production

To deploy from branch:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# Vercel creates preview deployment
```

---

## 📈 **Performance Optimization**

### **Already Implemented:**
- ✅ Static page generation
- ✅ Image optimization (Next.js)
- ✅ Code splitting
- ✅ Tree shaking

### **Additional Optimizations:**

**1. Add Redis Caching** (Optional)
```bash
npm install @vercel/kv
```

**2. Enable Edge Functions** (Optional)
```ts
export const runtime = 'edge';
```

**3. Add CDN for Assets**
Use Vercel's built-in CDN (automatic)

---

## ✅ **Deployment Complete!**

Glimtrics is now live! 🎉

**Next Steps:**
1. Share your app link
2. Monitor for errors
3. Collect user feedback
4. Iterate and improve

**Marketing:**
- Twitter/X announcement
- Indie Hackers launch
- Product Hunt submission
- Reddit/Discord communities

---

## 🆘 **Need Help?**

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Community Discord
- GitHub Issues

**Congratulations on shipping your SaaS! 🚀**
