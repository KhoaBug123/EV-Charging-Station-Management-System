# 🚀 Quick Start - Chạy Local SkaEV Project

## Tóm tắt 3 Bước Nhanh

```powershell
# Bước 1: Deploy Database
cd database
sqlcmd -S localhost -E -i DEPLOY_COMPLETE.sql

# Bước 2: Chạy Backend API  
.\run-backend.ps1

# Bước 3: Chạy Frontend (terminal mới)
.\run-frontend.ps1
```

Sau đó truy cập:
- **Frontend:** http://localhost:5173
- **Backend Swagger:** https://localhost:5001/swagger

---

## 📝 Chi tiết từng bước

### 1️⃣ Chuẩn bị Environment

**Cài đặt phần mềm cần thiết:**

✅ **SQL Server** (hoặc SQL Express):
```powershell
# Kiểm tra SQL Server đã cài chưa
sqlcmd -?
```

✅ **.NET SDK 8.0:**
```powershell
# Kiểm tra
dotnet --version
# Phải >= 8.0.0
```

✅ **Node.js 18+:**
```powershell
# Kiểm tra
node --version
npm --version
```

---

### 2️⃣ Setup Database

**Option A: Sử dụng script đơn giản (Khuyến nghị)**

```powershell
cd d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV\database
sqlcmd -S localhost -E -i DEPLOY_COMPLETE.sql
```

**Option B: Sử dụng SSMS**

1. Mở SQL Server Management Studio
2. Kết nối tới `localhost`
3. File → Open → `database/DEPLOY_COMPLETE.sql`
4. Execute (F5)

**Kết quả mong đợi:**
```
✅ 16 Tables created
✅ 15 Stored Procedures created
✅ 2 Views created
✅ 55 Indexes created
✅ 11 Triggers created
```

**Verify database:**
```sql
USE SkaEV_DB;
SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
-- Kết quả: 16
```

---

### 3️⃣ Chạy Backend API

**Option A: Sử dụng script (Đơn giản nhất)**

```powershell
cd d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV
.\run-backend.ps1
```

**Option B: Chạy trực tiếp**

```powershell
cd d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV\SkaEV.API
dotnet run
```

**Kết quả mong đợi:**
```
[INF] Starting SkaEV API...
[INF] Now listening on: http://localhost:5000
[INF] Now listening on: https://localhost:5001
```

**Test Backend:**

Mở trình duyệt: **https://localhost:5001/swagger**

Bạn sẽ thấy Swagger UI với tất cả API endpoints.

---

### 4️⃣ Chạy Frontend

**MỞ TERMINAL MỚI** (Backend phải chạy background)

**Option A: Sử dụng script**

```powershell
cd d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV
.\run-frontend.ps1
```

Script sẽ tự động:
- Kiểm tra `node_modules`
- Chạy `npm install` nếu chưa có
- Khởi động Vite dev server

**Option B: Chạy thủ công**

```powershell
cd d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV

# Cài dependencies (lần đầu tiên)
npm install

# Chạy dev server
npm run dev
```

**Kết quả mong đợi:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Test Frontend:**

Mở trình duyệt: **http://localhost:5173**

---

## 🎯 Kiểm tra toàn bộ hệ thống

### Test 1: Backend Health Check

```powershell
curl https://localhost:5001/health
# Hoặc mở trình duyệt: https://localhost:5001/health
```

Kết quả: `Healthy`

### Test 2: Frontend kết nối Backend

1. Mở http://localhost:5173
2. F12 → Console (không có error)
3. F12 → Network tab
4. Thử Register hoặc Login
5. Kiểm tra API calls tới `https://localhost:5001/api/...`

### Test 3: Full Authentication Flow

1. **Register:**
   - Frontend: Click "Register"
   - Nhập: email, password, fullname, phone
   - Submit
   - Check Console: `POST /api/auth/register` → Status 201

2. **Login:**
   - Frontend: Click "Login"
   - Nhập email/password vừa tạo
   - Submit
   - Check Console: `POST /api/auth/login` → Status 200
   - JWT token được lưu vào localStorage

3. **Access Protected Resources:**
   - Sau khi login, browse stations
   - Check Console: `GET /api/stations` → Status 200
   - Header có `Authorization: Bearer <token>`

---

## 🛠️ Troubleshooting

### ❌ "Cannot connect to SQL Server"

**Giải pháp:**

1. Kiểm tra SQL Server đang chạy:
```powershell
# Windows Services → SQL Server (MSSQLSERVER) → Status: Running
```

2. Kiểm tra connection string trong `SkaEV.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SkaEV_DB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

3. Nếu dùng SQL Express:
```json
"Server=localhost\\SQLEXPRESS;Database=SkaEV_DB;..."
```

---

### ❌ "Port 5001 already in use"

**Giải pháp:**

```powershell
# Tìm process đang dùng port 5001
netstat -ano | findstr :5001

# Kill process (replace <PID>)
taskkill /F /PID <PID>
```

Hoặc sửa port trong `SkaEV.API/appsettings.json`:
```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": { "Url": "http://localhost:5010" },
      "Https": { "Url": "https://localhost:5011" }
    }
  }
}
```

---

### ❌ "CORS policy blocked"

**Giải pháp:**

1. Đảm bảo backend chạy TRƯỚC frontend
2. Kiểm tra CORS config trong `SkaEV.API/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",  // ← Phải có frontend port
            "http://localhost:3000",
            "http://localhost:5174"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

3. Nếu dùng port khác, thêm vào `WithOrigins(...)`

---

### ❌ "npm install failed" hoặc "node_modules error"

**Giải pháp:**

```powershell
# Xóa node_modules và package-lock.json
rm -r node_modules
rm package-lock.json

# Xóa npm cache
npm cache clean --force

# Install lại
npm install
```

---

### ❌ "dotnet build failed" - "Not enough disk space"

**Giải pháp:**

```powershell
# Xóa NuGet cache
dotnet nuget locals all --clear

# Xóa bin và obj
cd SkaEV.API
rm -r bin
rm -r obj

# Restore và build lại
dotnet restore
dotnet build
```

---

## 📊 Cấu trúc khi chạy local

```
Terminals:

Terminal 1 (Backend):
├── cd SkaEV.API
├── dotnet run
└── Listening on: https://localhost:5001

Terminal 2 (Frontend):
├── npm run dev
└── Running on: http://localhost:5173

Browser:
├── Frontend: http://localhost:5173
├── Backend Swagger: https://localhost:5001/swagger
└── Backend Health: https://localhost:5001/health

Database:
└── SQL Server: localhost
    └── Database: SkaEV_DB
```

---

## 🔐 SSL Certificate Warning

Khi truy cập https://localhost:5001 lần đầu, trình duyệt sẽ cảnh báo certificate không tin cậy.

**Giải pháp:**

```powershell
# Trust dev certificate
dotnet dev-certs https --trust
```

Hoặc trong trình duyệt: Click "Advanced" → "Proceed to localhost"

---

## 📝 Default Test Accounts (Seed Data)

Nếu bạn đã chạy script seed data, có thể dùng các tài khoản test:

```
Admin:
- Email: admin@skaev.com
- Password: Admin@123

Staff:
- Email: staff@skaev.com
- Password: Staff@123

Customer:
- Email: customer@skaev.com
- Password: Customer@123
```

**Lưu ý:** Passwords này chỉ hoạt động nếu đã chạy seed data script. Nếu không, hãy Register tài khoản mới qua frontend.

---

## 🎉 Xong! Hệ thống đã chạy local

- ✅ Database: SQL Server local
- ✅ Backend: https://localhost:5001
- ✅ Frontend: http://localhost:5173

Bây giờ bạn có thể:
- Đăng ký/Đăng nhập user
- Tìm kiếm trạm sạc
- Tạo booking
- Quét QR code
- Quản lý hồ sơ

---

**Need help?** Check `LOCAL_SETUP_GUIDE.md` for detailed instructions.

**Last updated:** 13/10/2025
