# 🚀 EduSync Deployment Guide

## Architecture Overview
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas

## 📋 Pre-Deployment Checklist

### 1. Backend Deployment (Render)
1. Create account on [Render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node.js
   - **Root Directory**: Leave empty (monorepo setup)

### 2. Environment Variables (Render)
Set these in your Render dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edusync
ADMIN_ID=your-admin-id
NODE_ENV=production
PORT=3001
```

### 3. Frontend Deployment (Vercel)
1. Create account on [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`

### 4. Environment Variables (Vercel)
Set these in your Vercel dashboard:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
VITE_NODE_ENV=production
```

## 🔧 Configuration Files

### ✅ Already Configured:
- `vercel.json` - Vercel deployment config
- `client/.env.production` - Production environment template
- `client/vite.config.js` - Build optimization
- `client/src/utils/api.js` - Environment-based API URLs

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render
1. Push your code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### Step 2: Update Frontend Configuration
1. Copy your Render backend URL
2. Update `client/.env.production`:
   ```
   VITE_API_URL=https://your-actual-render-url.onrender.com/api
   ```
3. Commit and push changes

### Step 3: Deploy Frontend to Vercel
1. Import project on Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

## 🔍 Testing Deployment

### Backend Health Check:
```
GET https://your-render-url.onrender.com/api/health
```

### Frontend Check:
```
https://your-vercel-app.vercel.app
```

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Backend already configured to allow all origins
2. **API Connection**: Check VITE_API_URL in Vercel environment variables
3. **Build Failures**: Check build logs in respective platforms

### Environment Variables Checklist:
- [ ] MONGODB_URI set in Render
- [ ] ADMIN_ID set in Render  
- [ ] VITE_API_URL set in Vercel
- [ ] All URLs use HTTPS in production

## 📱 Post-Deployment

1. Test all major features
2. Monitor logs for errors
3. Set up domain (optional)
4. Configure SSL (automatic on both platforms)

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render and Vercel will auto-deploy from main branch
3. Monitor deployment logs

---

**Need Help?** Check the platform-specific documentation:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)