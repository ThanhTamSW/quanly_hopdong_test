# 🚀 Quick Deploy Guide

## Tùy chọn 1: Deploy miễn phí (Recommended)

### Backend: Railway
1. Truy cập https://railway.app
2. Đăng ký tài khoản
3. Connect GitHub repository
4. Chọn thư mục `backend/`
5. Cấu hình environment variables:
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Random secret key
   - `FRONTEND_URL`: URL frontend của bạn

### Frontend: Vercel
1. Truy cập https://vercel.com
2. Đăng ký tài khoản
3. Connect GitHub repository
4. Chọn thư mục `frontend/`
5. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Database: MongoDB Atlas
1. Truy cập https://cloud.mongodb.com
2. Tạo cluster miễn phí
3. Tạo user và password
4. Whitelist IP addresses
5. Lấy connection string

## Tùy chọn 2: Deploy với Heroku

### Backend + Frontend: Heroku
```bash
# Cài đặt Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Deploy backend
cd backend
heroku create your-app-backend
git push heroku main

# Deploy frontend
cd ../frontend
heroku create your-app-frontend
git push heroku main
```

## Tùy chọn 3: Deploy với Netlify + Railway

### Frontend: Netlify
1. Truy cập https://netlify.com
2. Connect GitHub repository
3. Build settings:
   - Base directory: `frontend/`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

### Backend: Railway
1. Truy cập https://railway.app
2. Connect GitHub repository
3. Chọn thư mục `backend/`

## Cấu hình Database

### MongoDB Atlas Setup
1. Tạo cluster miễn phí
2. Tạo database user
3. Whitelist IP addresses (0.0.0.0/0 cho tất cả)
4. Lấy connection string
5. Thay `<password>` bằng password thực

### Seed Data
```bash
cd backend
node simple-seed.js
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contract_management
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Contract Management System
```

## Testing Deployment

### Backend API Test
```bash
# Test health endpoint
curl https://your-backend-domain.com/api/health

# Test login
curl -X POST https://your-backend-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Frontend Test
1. Truy cập URL frontend
2. Kiểm tra login functionality
3. Test các chức năng chính

## Troubleshooting

### Common Issues
1. **CORS Error**: Kiểm tra FRONTEND_URL trong backend
2. **Database Connection**: Kiểm tra MONGODB_URI
3. **Build Errors**: Kiểm tra dependencies

### Debug Commands
```bash
# Backend logs
heroku logs --tail

# Frontend build
npm run build

# Database connection
mongosh "your-connection-string"
```

## Cost Estimation

### Free Tiers
- **Railway**: $5/month credit
- **Vercel**: Unlimited static sites
- **MongoDB Atlas**: 512MB free
- **Netlify**: 100GB bandwidth free

### Total Cost: $0-5/month

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Configure database
4. ✅ Test application
5. ✅ Setup custom domain (optional)
6. ✅ Configure monitoring
7. ✅ Setup backup strategy

---

**Lưu ý**: Đây là hướng dẫn nhanh. Xem `DEPLOYMENT_GUIDE.md` để biết chi tiết đầy đủ.
