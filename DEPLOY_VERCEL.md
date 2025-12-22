# Hướng dẫn Deploy lên Vercel

## Cách 1: Deploy qua Vercel CLI (Khuyến nghị)

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login vào Vercel
```bash
vercel login
```

### Bước 3: Deploy dự án
```bash
cd d:\Downloads\enterprise-kms
vercel
```

Làm theo hướng dẫn trên màn hình:
- Set up and deploy? → Yes
- Which scope? → Chọn account của bạn
- Link to existing project? → No
- What's your project's name? → enterprise-kms (hoặc tên bạn muốn)
- In which directory is your code located? → ./ (nhấn Enter)
- Want to override the settings? → No (đã có vercel.json)

### Bước 4: Deploy production
```bash
vercel --prod
```

## Cách 2: Deploy qua Vercel Dashboard (Đơn giản hơn)

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit for enterprise KMS"
git remote add origin https://github.com/YOUR_USERNAME/enterprise-kms.git
git push -u origin main
```

### Bước 2: Kết nối với Vercel
1. Truy cập: https://vercel.com/
2. Đăng nhập bằng GitHub
3. Click "Add New Project"
4. Import repository "enterprise-kms"
5. Configure Project:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Bước 3: Deploy
- Click "Deploy"
- Chờ vài phút để Vercel build và deploy
- Nhận được URL: `https://enterprise-kms.vercel.app` (hoặc tên bạn đặt)

## Cấu hình đã sẵn sàng

✅ **vercel.json** - Đã cấu hình routing cho SPA
✅ **.vercelignore** - Loại trừ các file không cần thiết
✅ **package.json** - Có build script
✅ **dist/** - Folder build đã được tạo

## Cấu trúc Deploy
```
enterprise-kms/
├── dist/                    # Build output (đã tạo)
│   ├── index.html
│   └── assets/
│       └── index-xxx.js    # 975KB (đã minify)
├── vercel.json             # Vercel config (đã tạo)
├── .vercelignore           # Ignore files (đã tạo)
└── package.json            # Dependencies
```

## Kiểm tra sau khi Deploy

1. Truy cập URL được cung cấp
2. Kiểm tra các trang:
   - Dashboard
   - Document Repository
   - Reports (trang vừa nâng cấp)
   - Space Manager
3. Test các chức năng filter và export CSV

## Environment Variables (Nếu cần)

Nếu dự án cần API keys (như GEMINI_API_KEY):

### Trên Vercel Dashboard:
1. Vào Project Settings
2. Chọn tab "Environment Variables"
3. Thêm:
   - Name: `GEMINI_API_KEY`
   - Value: `your-api-key-here`
   - Environment: Production, Preview, Development

### Hoặc qua CLI:
```bash
vercel env add GEMINI_API_KEY
```

## Tối ưu hóa (Tùy chọn)

### Giảm kích thước bundle
Dự án hiện tại có bundle ~975KB. Để tối ưu:

1. Code splitting:
```typescript
// Trong App.tsx, lazy load các routes
const Reports = lazy(() => import('./pages/Reports'));
const DocumentRepository = lazy(() => import('./pages/DocumentRepository'));
```

2. Tree shaking: Đã tự động với Vite

3. Compression: Vercel tự động gzip/brotli

## Cập nhật sau này

Mỗi khi có thay đổi:
```bash
git add .
git commit -m "Update features"
git push
```

Vercel sẽ tự động rebuild và deploy.

Hoặc dùng CLI:
```bash
vercel --prod
```

## Xem logs và analytics

- Truy cập Vercel Dashboard
- Chọn project "enterprise-kms"
- Xem:
  - Deployments (lịch sử deploy)
  - Logs (build logs, runtime logs)
  - Analytics (traffic, performance)

## Lưu ý

- ✅ Build đã thành công
- ⚠️ Bundle size lớn (975KB) - có thể tối ưu sau
- ✅ Không có lỗi nghiêm trọng
- ✅ Routing đã được cấu hình cho SPA

## Liên hệ hỗ trợ
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vite.dev/
