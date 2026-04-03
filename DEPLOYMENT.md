# SyncFlow Deployment Guide

## 🚀 Deploy Backend to Render

### 1. Prepare Your Backend
```bash
# Create production-ready backend
cd c:\wamp64\www\C-syncflow\backend

# Update render.yaml with your actual values
# Replace:
# - your_mongodb_connection_string_here
# - your_jwt_secret_here
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/login to your account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: syncflow-backend
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `NODE_ENV`: production
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
7. Click "Create Web Service"

### 3. Update Frontend API URL
After deployment, update your frontend to use the Render URL:
```javascript
// In frontend/src/pages/meetings.jsx and other files
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

---

## 🎨 Deploy Frontend to Vercel

### 1. Prepare Your Frontend
```bash
# Build the frontend
cd c:\wamp64\www\C-syncflow\frontend
npm run build
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build
6. Add Environment Variables:
   - `REACT_APP_API_URL`: Your Render backend URL
7. Click "Deploy"

### 3. Update API Calls
Ensure your frontend uses the deployed backend URL:
```javascript
// Example in API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## 🔗 Important Updates Needed

### Backend Changes (server.js):
```javascript
// Update CORS for production
app.use(cors({
  origin: ['https://your-app-name.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Frontend Changes:
```javascript
// Update API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## 📋 Environment Variables Setup

### Render (Backend):
- `NODE_ENV`: production
- `MONGO_URI`: mongodb+srv://username:password@cluster.mongodb.net/your-db
- `JWT_SECRET`: your-super-secret-jwt-key

### Vercel (Frontend):
- `REACT_APP_API_URL`: https://your-app-name.onrender.com

---

## 🧪 Testing After Deployment

1. **Backend Health Check**: Visit `https://your-app-name.onrender.com/`
2. **Frontend Load**: Visit `https://your-app-name.vercel.app`
3. **API Connectivity**: Test login/registration
4. **Meeting System**: Create and view meetings
5. **Real-time Features**: Test notifications

---

## 📝 Notes

- **Render**: Free tier includes sleep, may have cold starts
- **Vercel**: Excellent for React apps with automatic deployments
- **MongoDB**: Use MongoDB Atlas for cloud database
- **HTTPS**: Both platforms provide SSL certificates automatically
