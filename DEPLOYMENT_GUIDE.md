# Hướng dẫn Deploy Ứng dụng Quản lý Hợp đồng

## Tổng quan
Ứng dụng bao gồm:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + TypeScript + Vite

## 1. Chuẩn bị môi trường Production

### 1.1 Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contract_management?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=5000

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### 1.2 Cấu hình Frontend Environment

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Contract Management System
```

## 2. Deploy Backend (Node.js + Express)

### 2.1 Sử dụng Heroku

1. **Cài đặt Heroku CLI**
```bash
# Windows
# Tải từ: https://devcenter.heroku.com/articles/heroku-cli

# Kiểm tra cài đặt
heroku --version
```

2. **Tạo ứng dụng Heroku**
```bash
# Đăng nhập Heroku
heroku login

# Tạo app
heroku create your-app-name-backend

# Thêm MongoDB Atlas
heroku addons:create mongolab:sandbox
```

3. **Cấu hình Heroku**
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set FRONTEND_URL=https://your-frontend-domain.com

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 2.2 Sử dụng Railway

1. **Tạo tài khoản Railway**
   - Truy cập: https://railway.app
   - Đăng ký tài khoản

2. **Deploy từ GitHub**
   - Connect GitHub repository
   - Chọn thư mục `backend/`
   - Cấu hình environment variables
   - Deploy tự động

### 2.3 Sử dụng DigitalOcean App Platform

1. **Tạo App**
   - Truy cập: https://cloud.digitalocean.com/apps
   - Chọn "Create App"
   - Connect GitHub repository

2. **Cấu hình**
   - Source: `backend/`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment Variables: Thêm các biến từ `.env`

## 3. Deploy Frontend (React + Vite)

### 3.1 Sử dụng Vercel

1. **Cài đặt Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel

# Hoặc deploy từ GitHub
# - Connect GitHub repository
# - Chọn thư mục frontend/
# - Build Command: npm run build
# - Output Directory: dist
```

### 3.2 Sử dụng Netlify

1. **Tạo tài khoản Netlify**
   - Truy cập: https://netlify.com
   - Đăng ký tài khoản

2. **Deploy từ GitHub**
   - Connect GitHub repository
   - Build settings:
     - Base directory: `frontend/`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`

### 3.3 Sử dụng GitHub Pages

1. **Cấu hình Vite**
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
  build: {
    outDir: 'dist'
  }
})
```

2. **Deploy Script**
```json
// package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## 4. Cấu hình Database (MongoDB Atlas)

### 4.1 Tạo MongoDB Atlas Cluster

1. **Tạo tài khoản**
   - Truy cập: https://cloud.mongodb.com
   - Đăng ký tài khoản

2. **Tạo Cluster**
   - Chọn "Build a Database"
   - Chọn "M0 Sandbox" (Free tier)
   - Chọn region gần nhất
   - Tạo cluster

3. **Cấu hình Security**
   - Database Access: Tạo user với password
   - Network Access: Thêm IP address (0.0.0.0/0 cho tất cả)

4. **Lấy Connection String**
   - Database → Connect → Connect your application
   - Copy connection string
   - Thay `<password>` bằng password đã tạo

### 4.2 Seed Data cho Production

```bash
# Chạy script seed data
cd backend
node simple-seed.js
```

## 5. Cấu hình Domain và SSL

### 5.1 Custom Domain

1. **Backend (Heroku)**
```bash
# Thêm custom domain
heroku domains:add api.yourdomain.com

# Cấu hình DNS
# CNAME api.yourdomain.com -> your-app.herokuapp.com
```

2. **Frontend (Vercel/Netlify)**
   - Thêm custom domain trong dashboard
   - Cấu hình DNS A record

### 5.2 SSL Certificate
- Heroku: Tự động có SSL
- Vercel/Netlify: Tự động có SSL
- Railway: Tự động có SSL

## 6. Monitoring và Logs

### 6.1 Backend Monitoring

```bash
# Heroku logs
heroku logs --tail

# Railway logs
railway logs

# DigitalOcean logs
# Xem trong dashboard
```

### 6.2 Frontend Monitoring

- Vercel: Analytics trong dashboard
- Netlify: Analytics trong dashboard
- GitHub Pages: Không có monitoring built-in

## 7. CI/CD Pipeline

### 7.1 GitHub Actions

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 8. Backup và Recovery

### 8.1 Database Backup

```bash
# MongoDB Atlas tự động backup
# Hoặc manual backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/dbname"
```

### 8.2 Code Backup

```bash
# GitHub tự động backup
# Hoặc manual backup
git clone https://github.com/username/repository.git
```

## 9. Performance Optimization

### 9.1 Backend Optimization

```javascript
// Caching với Redis
const redis = require('redis');
const client = redis.createClient();

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 9.2 Frontend Optimization

```javascript
// Code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Image optimization
// Sử dụng WebP format
// Lazy loading images
```

## 10. Security Best Practices

### 10.1 Backend Security

```javascript
// Helmet.js cho security headers
const helmet = require('helmet');
app.use(helmet());

// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Input validation
const Joi = require('joi');
```

### 10.2 Frontend Security

```javascript
// Content Security Policy
// HTTPS only
// XSS protection
```

## 11. Troubleshooting

### 11.1 Common Issues

1. **CORS Error**
   - Kiểm tra FRONTEND_URL trong backend
   - Cấu hình CORS đúng

2. **Database Connection**
   - Kiểm tra MONGODB_URI
   - Kiểm tra network access trong MongoDB Atlas

3. **Build Errors**
   - Kiểm tra dependencies
   - Kiểm tra TypeScript errors

### 11.2 Debug Commands

```bash
# Backend logs
heroku logs --tail

# Frontend build
npm run build

# Database connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"
```

## 12. Cost Estimation

### 12.1 Free Tiers
- **Heroku**: 550 hours/month free
- **Vercel**: Unlimited static sites
- **MongoDB Atlas**: 512MB free
- **Railway**: $5/month credit

### 12.2 Paid Options
- **Heroku**: $7/month (Hobby)
- **Vercel**: $20/month (Pro)
- **MongoDB Atlas**: $9/month (M2)
- **Railway**: $5/month

## 13. Checklist Deploy

- [ ] Cấu hình environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Cấu hình database
- [ ] Test API endpoints
- [ ] Test frontend functionality
- [ ] Cấu hình custom domain
- [ ] Setup monitoring
- [ ] Backup strategy
- [ ] Security review

## 14. Support và Maintenance

### 14.1 Monitoring
- Uptime monitoring
- Error tracking
- Performance monitoring

### 14.2 Updates
- Regular dependency updates
- Security patches
- Feature updates

---

**Lưu ý**: Đây là hướng dẫn tổng quát. Các bước cụ thể có thể khác nhau tùy thuộc vào platform bạn chọn.
