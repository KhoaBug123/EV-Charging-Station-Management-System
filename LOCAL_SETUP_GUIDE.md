# Hướng dẫn Chạy Local - SkaEV Project

**Ngày cập nhật:** 13/10/2025  
**Môi trường:** Windows + SQL Server + Node.js + .NET 8

---

## 📋 Yêu cầu Hệ thống

### Phần mềm cần cài đặt:

1. **SQL Server 2019+** (hoặc SQL Server Express)
   - Download: https://www.microsoft.com/sql-server/sql-server-downloads
   - Hoặc dùng SQL Server LocalDB

2. **SQL Server Management Studio (SSMS)** - Tùy chọn
   - Download: https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms

3. **.NET SDK 8.0**
   - Download: https://dotnet.microsoft.com/download/dotnet/8.0
   - Kiểm tra: `dotnet --version`

4. **Node.js 18+**
   - Download: https://nodejs.org/
   - Kiểm tra: `node --version` và `npm --version`

5. **Visual Studio Code** (Khuyến nghị)
   - Extensions: C# Dev Kit, Prettier, ESLint

---

## 🚀 Bước 1: Setup Database (SQL Server)

### Option 1: Sử dụng SSMS (Dễ nhất)

1. Mở **SQL Server Management Studio (SSMS)**
2. Kết nối vào SQL Server instance của bạn (localhost hoặc tên máy)
3. Mở file: `database/DEPLOY_COMPLETE.sql`
4. Click **Execute** (hoặc nhấn F5)
5. Kiểm tra database `SkaEV_DB` đã được tạo thành công

### Option 2: Sử dụng Command Line (sqlcmd)

```powershell
# Kiểm tra SQL Server đã cài đặt chưa
sqlcmd -?

# Chạy script tạo database
cd "d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV\database"
sqlcmd -S localhost -E -i DEPLOY_COMPLETE.sql

# Hoặc nếu dùng authentication
sqlcmd -S localhost -U sa -P YourPassword -i DEPLOY_COMPLETE.sql
```

### Option 3: Sử dụng Azure Data Studio

1. Mở Azure Data Studio
2. Kết nối vào SQL Server
3. Right-click connection → New Query
4. Copy nội dung file `DEPLOY_COMPLETE.sql` và paste
5. Run query

### ✅ Kiểm tra Database đã tạo thành công:

```sql
-- Mở SQL query và chạy:
USE SkaEV_DB;
GO

-- Kiểm tra số lượng tables (phải có 16 tables)
SELECT COUNT(*) AS TotalTables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Kiểm tra stored procedures (phải có 15 procedures)
SELECT COUNT(*) AS TotalProcedures FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE';

-- Xem danh sách tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME;
```

Kết quả mong đợi:
- **16 tables:** users, user_profiles, vehicles, charging_stations, charging_posts, charging_slots, bookings, soc_tracking, invoices, qr_codes, notifications, system_logs, reviews, pricing_rules, station_staff
- **15 stored procedures:** sp_authenticate_user, sp_create_user, sp_search_stations_by_location, sp_get_available_slots, sp_create_booking, sp_scan_qr_code, sp_start_charging, sp_update_soc_progress, sp_complete_charging, sp_cancel_booking, sp_get_user_booking_history, sp_get_booking_soc_history, sp_create_notification, sp_get_station_analytics, sp_get_system_health

---

## 🔧 Bước 2: Cấu hình Backend (ASP.NET Core)

### 2.1. Kiểm tra Connection String

Mở file: `SkaEV.API/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SkaEV_DB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**Điều chỉnh nếu cần:**

- **SQL Server Express:** `Server=localhost\\SQLEXPRESS;...`
- **SQL Server với tên instance:** `Server=YOUR_COMPUTER_NAME\\SQLEXPRESS;...`
- **SQL Authentication:** `Server=localhost;Database=SkaEV_DB;User Id=sa;Password=YourPassword;TrustServerCertificate=True`
- **SQL LocalDB:** `Server=(localdb)\\MSSQLLocalDB;Database=SkaEV_DB;...`

### 2.2. Restore NuGet Packages

```powershell
cd "d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV\SkaEV.API"
dotnet restore
```

### 2.3. Build Backend

```powershell
dotnet build
```

**Nếu build thành công, bạn sẽ thấy:**
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

### 2.4. Chạy Backend API

```powershell
dotnet run
```

**Hoặc dùng script có sẵn:**
```powershell
.\start-api.ps1
```

**Kết quả mong đợi:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
```

### ✅ Kiểm tra Backend đã chạy:

1. Mở trình duyệt: **https://localhost:5001/swagger**
2. Bạn sẽ thấy **Swagger UI** với danh sách tất cả API endpoints
3. Click "Authorize" và test JWT authentication

**Test API đơn giản:**
```bash
# Kiểm tra health check
curl https://localhost:5001/health
```

---

## 🎨 Bước 3: Chạy Frontend (React + Vite)

### 3.1. Install Dependencies

```powershell
cd "d:\University\SWP\FPTU_FA25_SWP391_G4_Topic3_SkaEV"
npm install
```

**Nếu gặp lỗi, thử:**
```powershell
# Xóa node_modules và package-lock.json
rm -r node_modules
rm package-lock.json
npm install
```

### 3.2. Kiểm tra API URL trong Frontend

Mở file: `src/services/api.js`

```javascript
const API_BASE_URL = 'https://localhost:5001/api';
// Hoặc
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';
```

**Tạo file `.env` (nếu chưa có):**
```env
VITE_API_URL=https://localhost:5001/api
```

### 3.3. Chạy Development Server

```powershell
npm run dev
```

**Kết quả mong đợi:**
```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### ✅ Kiểm tra Frontend đã chạy:

Mở trình duyệt: **http://localhost:5173**

Bạn sẽ thấy trang chủ của SkaEV.

---

## 🔄 Bước 4: Test Kết nối Frontend-Backend

### 4.1. Kiểm tra CORS

Backend đã được cấu hình CORS cho:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Create React App)
- `http://localhost:5174` (Vite alternative)

**Nếu dùng port khác**, cập nhật trong `SkaEV.API/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174",
            "http://localhost:YOUR_PORT" // Thêm port của bạn
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

### 4.2. Test Authentication Flow

1. Mở frontend: http://localhost:5173
2. Click vào **Register** (Đăng ký)
3. Điền thông tin và submit
4. Check Console (F12) để xem API request/response
5. Thử **Login** với tài khoản vừa tạo

### 4.3. Test API Calls

Mở **Browser DevTools (F12) → Network Tab**

Khi bạn thao tác trên frontend, bạn sẽ thấy các API calls:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/stations`
- `POST /api/bookings`
- etc.

**Kiểm tra:**
- ✅ Status Code: 200 (Success) hoặc 201 (Created)
- ❌ Status Code: 401 (Unauthorized) - Cần login
- ❌ Status Code: 500 (Server Error) - Kiểm tra backend logs

---

## 📝 Dữ liệu Test (Seed Data)

### Tạo User Admin để test:

```sql
USE SkaEV_DB;
GO

-- Tạo admin user (password: Admin@123)
INSERT INTO users (email, password_hash, full_name, phone_number, role, is_active)
VALUES (
    'admin@skaev.com',
    '$2a$11$xS5ZGzxDQDmGXvZmGVlHXeqkT0mGWKGPZYOQVKLmMXqK1T0mGWKGP', -- Hashed: Admin@123
    'System Administrator',
    '0901234567',
    'admin',
    1
);

-- Tạo staff user (password: Staff@123)
INSERT INTO users (email, password_hash, full_name, phone_number, role, is_active)
VALUES (
    'staff@skaev.com',
    '$2a$11$yT6AbydEQEmHywamHWmIYfrlU1nHXLHQAZPPRWLnNYrL1U0nHXLHQ', -- Hashed: Staff@123
    'Station Staff',
    '0901234568',
    'staff',
    1
);

-- Tạo customer user (password: Customer@123)
INSERT INTO users (email, password_hash, full_name, phone_number, role, is_active)
VALUES (
    'customer@skaev.com',
    '$2a$11$zU7BczeFRFnIxzbmIXnJZgsqmV2oIYMIRBQQSXMoOZsM1V0oIYMIR', -- Hashed: Customer@123
    'Test Customer',
    '0901234569',
    'customer',
    1
);
```

**⚠️ Lưu ý:** Passwords trên là ví dụ. Backend sử dụng BCrypt để hash passwords. Khi register qua API, password sẽ tự động được hash.

### Tạo Charging Station mẫu:

```sql
-- Tạo trạm sạc mẫu tại FPTU HCM
INSERT INTO charging_stations (
    station_name, address, city, latitude, longitude,
    total_posts, available_posts, operating_hours, amenities, status
)
VALUES (
    'FPTU HCM Charging Station',
    'Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
    'Ho Chi Minh City',
    10.8411276,
    106.8097910,
    4,
    4,
    '24/7',
    '["WiFi", "Cafe", "Restroom", "Parking"]',
    'active'
);

-- Tạo charging posts cho station vừa tạo
DECLARE @station_id INT = SCOPE_IDENTITY();

INSERT INTO charging_posts (station_id, post_number, post_type, power_output, connector_types, total_slots, available_slots, status)
VALUES 
    (@station_id, 'POST-01', 'DC', 50.00, '["CCS2", "CHAdeMO"]', 2, 2, 'available'),
    (@station_id, 'POST-02', 'AC', 22.00, '["Type2"]', 2, 2, 'available'),
    (@station_id, 'POST-03', 'DC', 150.00, '["CCS2"]', 1, 1, 'available'),
    (@station_id, 'POST-04', 'AC', 7.00, '["Type2"]', 2, 2, 'available');
```

---

## 🐛 Troubleshooting (Xử lý lỗi)

### ❌ Lỗi: "Cannot connect to SQL Server"

**Giải pháp:**
1. Kiểm tra SQL Server đã chạy chưa:
   - Windows Services → SQL Server (MSSQLSERVER) → Status: Running
2. Kiểm tra connection string trong `appsettings.json`
3. Test connection bằng SSMS hoặc sqlcmd
4. Nếu dùng SQL Express: `Server=localhost\\SQLEXPRESS`

### ❌ Lỗi: "Login failed for user"

**Giải pháp:**
1. Dùng **Trusted_Connection=True** (Windows Authentication)
2. Hoặc tạo SQL Login và dùng User Id/Password
3. Enable SQL Server Authentication trong SQL Server Configuration

### ❌ Lỗi: "CORS policy blocked"

**Giải pháp:**
1. Kiểm tra frontend port có trong CORS configuration không
2. Backend phải chạy trước frontend
3. Restart cả backend và frontend

### ❌ Lỗi: "dotnet command not found"

**Giải pháp:**
1. Cài đặt .NET SDK 8.0: https://dotnet.microsoft.com/download
2. Restart terminal sau khi cài
3. Kiểm tra: `dotnet --version`

### ❌ Lỗi: "npm command not found"

**Giải pháp:**
1. Cài đặt Node.js: https://nodejs.org/
2. Restart terminal sau khi cài
3. Kiểm tra: `node --version` và `npm --version`

### ❌ Lỗi: "Port 5001 is already in use"

**Giải pháp:**
```powershell
# Tìm process đang dùng port 5001
netstat -ano | findstr :5001

# Kill process (replace PID với số process ID)
taskkill /F /PID <PID>
```

### ❌ Lỗi Build: "There is not enough space on the disk"

**Giải pháp:**
```powershell
# Xóa NuGet cache
dotnet nuget locals all --clear

# Xóa bin và obj folders
rm -r SkaEV.API/bin
rm -r SkaEV.API/obj

# Restore lại
dotnet restore
```

---

## 📂 Cấu trúc Project

```
FPTU_FA25_SWP391_G4_Topic3_SkaEV/
├── database/
│   └── DEPLOY_COMPLETE.sql          # Script tạo database
├── SkaEV.API/                        # Backend ASP.NET Core
│   ├── Domain/Entities/              # 16 entity classes
│   ├── Application/                  # Services, DTOs
│   │   ├── Services/                 # AuthService, StationService, BookingService
│   │   └── DTOs/                     # Request/Response models
│   ├── Infrastructure/               # DbContext, Repositories
│   │   └── Data/SkaEVDbContext.cs
│   ├── Controllers/                  # API Controllers
│   ├── Program.cs                    # App configuration
│   ├── appsettings.json              # Configuration
│   └── SkaEV.API.csproj              # Project file
├── src/                              # Frontend React
│   ├── components/                   # React components
│   ├── pages/                        # Page components
│   ├── services/api.js               # API service
│   ├── store/                        # Zustand stores
│   └── App.jsx                       # Main app component
├── package.json                      # Frontend dependencies
├── vite.config.js                    # Vite configuration
└── README.md                         # Project documentation
```

---

## 🌐 URL và Endpoints

### Frontend:
- **Development:** http://localhost:5173
- **Production Build:** `npm run build` → `dist/` folder

### Backend API:
- **HTTP:** http://localhost:5000
- **HTTPS:** https://localhost:5001
- **Swagger UI:** https://localhost:5001/swagger
- **Health Check:** https://localhost:5001/health

### API Endpoints:
- **Auth:** `/api/auth/login`, `/api/auth/register`
- **Stations:** `/api/stations`, `/api/stations/nearby`
- **Bookings:** `/api/bookings`, `/api/bookings/qr-scan`
- **Vehicles:** `/api/vehicles`
- **Reviews:** `/api/reviews`

---

## 🎯 Next Steps

Sau khi setup thành công:

1. ✅ **Test Authentication:** Register → Login → Get Profile
2. ✅ **Test Stations:** Search stations → View details → Check availability
3. ✅ **Test Bookings:** Create booking → QR scan → Start charging
4. ✅ **Test Reviews:** Complete booking → Submit review
5. ✅ **Check Real-time:** Test SOC tracking updates (SignalR)

---

## 📚 Tài liệu Tham khảo

- **Backend API Docs:** `API_DOCUMENTATION.md`
- **Database Schema:** `DATABASE_BACKEND_COMPATIBILITY.md`
- **Quick Start:** `QUICKSTART.md`
- **Project Setup:** `PROJECT_SETUP_GUIDE.md`
- **Completion Summary:** `COMPLETION_SUMMARY.md`

---

## 🆘 Support

Nếu gặp vấn đề:
1. Check logs: `SkaEV.API/logs/skaev-*.txt`
2. Check browser console (F12)
3. Check Swagger UI để test API trực tiếp
4. Kiểm tra database connections trong SSMS

---

**✨ Chúc bạn setup thành công! Happy Coding! 🚀**

**Updated:** 13/10/2025  
**Version:** 1.0
