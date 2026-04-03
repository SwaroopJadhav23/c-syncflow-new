# SyncFlow Frontend

## Quick Deploy Instructions for Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd c:\wamp64\www\C-syncflow\frontend
vercel --prod
```

### Method 2: Manual Drag & Drop
1. Run `npm run build` in frontend folder
2. Drag the `build` folder to [vercel.com](https://vercel.com)
3. Configure as static site

### Method 3: Fix Repository Issues
Check if these files exist in your repo root:
- ✅ `frontend/package.json`
- ✅ `frontend/public/index.html`
- ✅ `frontend/src/App.js`

### Environment Variables for Vercel:
```
REACT_APP_API_URL=https://c-syncflow-mxgm.onrender.com
```

### Current Status:
- Backend: ✅ Live on Render
- Frontend: 🔄 Deployment issues on Vercel
- Solution: Try CLI or manual deployment
