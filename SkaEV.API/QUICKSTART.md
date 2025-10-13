# SkaEV Backend - Quick Start Guide

## 🎯 Hướng dẫn chạy Backend nhanh

### Bước 1: Deploy Database

```powershell
# Mở SQL Server Management Studio (SSMS)
# File > Open > File...
# Chọn: database/DEPLOY_COMPLETE.sql
# Nhấn Execute (F5)
```

### Bước 2: Update Connection String

Mở `SkaEV.API/appsettings.json`, sửa connection string:

**Windows Authentication (khuyến nghị):**
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=SkaEV_DB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

**SQL Server Authentication:**
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=SkaEV_DB;User Id=sa;Password=YourPassword;"
}
```

### Bước 3: Restore & Run

```powershell
cd SkaEV.API
dotnet restore
dotnet run
```

Hoặc dùng script:
```powershell
.\SkaEV.API\start-api.ps1
```

### Bước 4: Test API

Mở browser: **http://localhost:5000**

Swagger UI sẽ hiển thị tất cả endpoints.

## 🧪 Test với Postman/Curl

### 1. Register User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "customer@skaev.com",
  "password": "Password123!",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789",
  "role": "customer"
}
```

### 2. Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "customer@skaev.com",
  "password": "Password123!"
}
```

Response:
```json
{
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "customer"
}
```

### 3. Get Stations (No auth required)

```bash
GET http://localhost:5000/api/stations
```

### 4. Create Booking (Requires auth)

```bash
POST http://localhost:5000/api/bookings
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "vehicleId": 1,
  "slotId": 1,
  "stationId": 1,
  "schedulingType": "scheduled",
  "scheduledStartTime": "2025-10-14T10:00:00",
  "targetSoc": 80
}
```

## 🎨 Frontend Integration

Update file frontend `.env.development`:

```env
VITE_API_URL=http://localhost:5000/api
```

Update `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  auth: {
    login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
    register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  },
  stations: {
    getAll: () => axios.get(`${API_BASE_URL}/stations`),
    getNearby: (lat, lon, radius) => 
      axios.get(`${API_BASE_URL}/stations/nearby`, {
        params: { latitude: lat, longitude: lon, radiusKm: radius }
      }),
  },
  bookings: {
    create: (data, token) => 
      axios.post(`${API_BASE_URL}/bookings`, data, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    getMyBookings: (token) =>
      axios.get(`${API_BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
  },
};
```

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**Giải pháp:**
1. Kiểm tra SQL Server đã chạy chưa
2. Kiểm tra connection string trong `appsettings.json`
3. Chạy lại `DEPLOY_COMPLETE.sql`

### Error: "No service for type 'SkaEVDbContext'"

**Giải pháp:**
```powershell
dotnet restore
dotnet build
```

### Error: Port 5000 already in use

**Giải pháp:**
Sửa `appsettings.json`:
```json
"Kestrel": {
  "Endpoints": {
    "Http": {
      "Url": "http://localhost:5050"
    }
  }
}
```

## 📊 Cấu trúc Backend hoàn chỉnh

✅ **Domain Layer (16 Entities)**
- User, UserProfile, Vehicle
- ChargingStation, ChargingPost, ChargingSlot
- Booking, SocTracking, Invoice
- QRCode, Notification, SystemLog
- Review, PricingRule, StationStaff

✅ **Application Layer**
- DTOs (Auth, Stations, Bookings)
- Services (AuthService, StationService, BookingService)

✅ **API Layer**
- Controllers (Auth, Stations, Bookings)
- Program.cs với JWT, CORS, Swagger
- Middleware & Exception Handling

✅ **Infrastructure Layer**
- SkaEVDbContext (EF Core)
- 15 Stored Procedures Integration
- NetTopologySuite for spatial data

## 🚀 Chạy Production

```powershell
# Build release
dotnet publish -c Release -o ./publish

# Run
cd publish
dotnet SkaEV.API.dll
```

## 📝 Next Steps

1. ✅ Backend đã hoàn thiện cơ bản
2. 🔄 Cần thêm: Vehicles, Reviews, Notifications, Analytics controllers
3. 🔄 Cần thêm: SignalR Hubs cho real-time
4. 🔄 Cần thêm: Unit Tests
5. 🔄 Frontend integration testing

---

**Hỗ trợ:** SWP391 G4 Topic 3
