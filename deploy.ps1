# Deployment Script for Contract Management System
# Chạy script này để deploy ứng dụng

param(
    [string]$Environment = "production",
    [string]$Platform = "heroku"
)

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Kiểm tra prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Kiểm tra npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Kiểm tra Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git version: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Building application..." -ForegroundColor Yellow

# Build backend
Write-Host "📦 Building backend..." -ForegroundColor Cyan
Set-Location backend
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend package.json not found" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Cyan
Set-Location ../frontend
if (Test-Path "package.json") {
    npm install
    npm run build
    Write-Host "✅ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend package.json not found" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "`n🌐 Deployment options:" -ForegroundColor Yellow
Write-Host "1. Heroku (Backend + Frontend)" -ForegroundColor White
Write-Host "2. Vercel (Frontend) + Railway (Backend)" -ForegroundColor White
Write-Host "3. Netlify (Frontend) + DigitalOcean (Backend)" -ForegroundColor White
Write-Host "4. Manual deployment guide" -ForegroundColor White

$choice = Read-Host "`nSelect deployment option (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n🚀 Deploying to Heroku..." -ForegroundColor Green
        
        # Kiểm tra Heroku CLI
        try {
            $herokuVersion = heroku --version
            Write-Host "✅ Heroku CLI found: $herokuVersion" -ForegroundColor Green
        } catch {
            Write-Host "❌ Heroku CLI not found. Please install it first:" -ForegroundColor Red
            Write-Host "   https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
            exit 1
        }
        
        # Deploy backend
        Write-Host "📤 Deploying backend to Heroku..." -ForegroundColor Cyan
        Set-Location backend
        git add .
        git commit -m "Deploy backend to production"
        heroku create contract-management-backend
        git push heroku main
        Set-Location ..
        
        # Deploy frontend
        Write-Host "📤 Deploying frontend to Heroku..." -ForegroundColor Cyan
        Set-Location frontend
        git add .
        git commit -m "Deploy frontend to production"
        heroku create contract-management-frontend
        git push heroku main
        Set-Location ..
        
        Write-Host "✅ Deployment completed!" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "`n🚀 Deploying to Vercel + Railway..." -ForegroundColor Green
        
        # Kiểm tra Vercel CLI
        try {
            $vercelVersion = vercel --version
            Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
        } catch {
            Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        # Deploy frontend to Vercel
        Write-Host "📤 Deploying frontend to Vercel..." -ForegroundColor Cyan
        Set-Location frontend
        vercel --prod
        Set-Location ..
        
        Write-Host "📤 Deploy backend to Railway manually:" -ForegroundColor Yellow
        Write-Host "   1. Go to https://railway.app" -ForegroundColor White
        Write-Host "   2. Connect your GitHub repository" -ForegroundColor White
        Write-Host "   3. Select backend folder" -ForegroundColor White
        Write-Host "   4. Configure environment variables" -ForegroundColor White
        
        Write-Host "✅ Frontend deployed to Vercel!" -ForegroundColor Green
    }
    
    "3" {
        Write-Host "`n🚀 Deploying to Netlify + DigitalOcean..." -ForegroundColor Green
        
        Write-Host "📤 Deploy frontend to Netlify:" -ForegroundColor Yellow
        Write-Host "   1. Go to https://netlify.com" -ForegroundColor White
        Write-Host "   2. Connect your GitHub repository" -ForegroundColor White
        Write-Host "   3. Set build command: npm run build" -ForegroundColor White
        Write-Host "   4. Set publish directory: dist" -ForegroundColor White
        
        Write-Host "📤 Deploy backend to DigitalOcean:" -ForegroundColor Yellow
        Write-Host "   1. Go to https://cloud.digitalocean.com/apps" -ForegroundColor White
        Write-Host "   2. Create new app" -ForegroundColor White
        Write-Host "   3. Connect GitHub repository" -ForegroundColor White
        Write-Host "   4. Select backend folder" -ForegroundColor White
        Write-Host "   5. Configure environment variables" -ForegroundColor White
        
        Write-Host "✅ Deployment guide provided!" -ForegroundColor Green
    }
    
    "4" {
        Write-Host "`n📖 Opening deployment guide..." -ForegroundColor Green
        if (Test-Path "DEPLOYMENT_GUIDE.md") {
            Start-Process "DEPLOYMENT_GUIDE.md"
        } else {
            Write-Host "❌ Deployment guide not found" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "❌ Invalid option selected" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Configure environment variables" -ForegroundColor White
Write-Host "   2. Set up database (MongoDB Atlas)" -ForegroundColor White
Write-Host "   3. Test your application" -ForegroundColor White
Write-Host "   4. Configure custom domain (optional)" -ForegroundColor White

Write-Host "`n📚 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
