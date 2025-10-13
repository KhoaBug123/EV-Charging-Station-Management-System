# 🚀 SkaEV - Electric Vehicle Charging Management System

## 📦 Complete Project Setup Guide

### Project Structure

```
FPTU_FA25_SWP391_G4_Topic3_SkaEV/
├── database/                          # Database deployment
│   ├── DEPLOY_COMPLETE.sql           # 🔥 Single file to deploy everything
│   ├── 01_ANALYSIS.md                # Database analysis
│   └── README_MSSQL_DEPLOYMENT.md    # Deployment guide
│
├── SkaEV.API/                        # 🎯 Backend API (ASP.NET Core)
│   ├── Application/                  # Services & DTOs
│   ├── Controllers/                  # API Controllers
│   ├── Domain/                       # Entities (16 tables)
│   ├── Infrastructure/               # DbContext & Data Access
│   ├── Program.cs                    # Main entry point
│   ├── appsettings.json             # Configuration
│   ├── start-api.ps1                # Quick start script
│   ├── README.md                     # Backend documentation
│   ├── QUICKSTART.md                 # Quick start guide
│   └── API_DOCUMENTATION.md          # Complete API docs
│
└── src/                              # Frontend (React + Vite)
    ├── components/                   # React components
    ├── pages/                        # Page components
    ├── services/                     # API integration
    ├── store/                        # Zustand state management
    └── main.jsx                      # App entry point
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Deploy Database (1 phút)

```powershell
# Mở SQL Server Management Studio (SSMS)
# File > Open > database/DEPLOY_COMPLETE.sql
# Execute (F5)
```

✅ Tạo 16 tables + 15 stored procedures + triggers + views

### Step 2: Start Backend API (2 phút)

```powershell
cd SkaEV.API
.\start-api.ps1
```

Hoặc:
```powershell
dotnet restore
dotnet run
```

✅ API chạy tại: **http://localhost:5000**
✅ Swagger UI: **http://localhost:5000**

### Step 3: Start Frontend (1 phút)

```powershell
npm install
npm run dev
```

✅ Frontend chạy tại: **http://localhost:5173**

---

## 🗄️ Database Schema Overview

**16 Tables:**

**User Management:**
- `users` - User accounts (customer, staff, admin)
- `user_profiles` - Extended profile data
- `vehicles` - User's electric vehicles

**Station Management:**
- `charging_stations` - Station locations (with geography type)
- `charging_posts` - Charging posts (AC/DC)
- `charging_slots` - Individual connectors

**Booking & Charging:**
- `bookings` - Charging reservations
- `soc_tracking` - Real-time battery percentage tracking
- `invoices` - Payment records

**System:**
- `qr_codes` - QR code management
- `notifications` - User notifications
- `system_logs` - System audit logs
- `reviews` - Station reviews
- `pricing_rules` - Dynamic pricing
- `station_staff` - Staff assignments

**Key Features:**
- ✅ Geography data type for location-based search
- ✅ 15 stored procedures for complex operations
- ✅ Triggers for automatic timestamp updates
- ✅ Views for common queries

---

## 🎯 Backend API Features

**Technology:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core 8.0
- JWT Authentication
- Swagger/OpenAPI
- SignalR (Real-time)
- Serilog (Logging)

**Main Endpoints:**

```
🔐 Authentication
POST   /api/auth/login              # Login
POST   /api/auth/register           # Register
GET    /api/auth/profile            # Get profile

🏢 Stations
GET    /api/stations                # Get all stations
GET    /api/stations/nearby         # Search by location
GET    /api/stations/{id}           # Get details
POST   /api/stations                # Create (Admin)

📅 Bookings
GET    /api/bookings                # Get user bookings
POST   /api/bookings                # Create booking
POST   /api/bookings/qr-scan        # QR code booking
DELETE /api/bookings/{id}/cancel    # Cancel booking
PUT    /api/bookings/{id}/start     # Start charging (Staff)
PUT    /api/bookings/{id}/complete  # Complete (Staff)

🔍 System
GET    /health                      # Health check
```

**User Roles:**
- **customer**: Create bookings, view history, scan QR
- **staff**: Manage charging sessions
- **admin**: Full system access

---

## 🎨 Frontend Features

**Technology:**
- React 19
- Vite 6
- Material-UI (MUI)
- Zustand (State Management)
- React Router 7

**Key Features:**
- ✅ User authentication (login/register)
- ✅ Find nearby charging stations
- ✅ Book charging slots
- ✅ QR code scanning for instant charging
- ✅ Real-time SOC tracking
- ✅ Booking history
- ✅ Responsive design

**Pages:**
- `/` - Home page
- `/login` - Login
- `/register` - Register
- `/customer/dashboard` - Customer dashboard
- `/customer/find-stations` - Find stations
- `/customer/booking-history` - View bookings
- `/staff/dashboard` - Staff dashboard
- `/admin/dashboard` - Admin dashboard

---

## 🔧 Development Setup

### Prerequisites

- ✅ .NET 8.0 SDK
- ✅ SQL Server 2019+ (or SQL Server Express)
- ✅ Node.js 18+ & npm
- ✅ Visual Studio Code or Visual Studio 2022

### Database Connection String

**Windows Authentication (Recommended):**
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

### Frontend API Configuration

File: `.env.development`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Test Backend API

**1. Using Swagger:**
- Open: http://localhost:5000
- Click "Authorize" and enter token
- Test endpoints interactively

**2. Using curl:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User","role":"customer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get stations
curl http://localhost:5000/api/stations
```

**3. Using Postman:**
- Import API collection from Swagger
- Set Authorization: Bearer Token

---

## 🎯 Complete User Flow

### Customer Journey

1. **Register/Login**
   - POST `/api/auth/register`
   - POST `/api/auth/login` → Get JWT token

2. **Find Charging Station**
   - GET `/api/stations/nearby?latitude=10.7769&longitude=106.6955&radiusKm=10`
   - View available stations with distance

3. **Create Booking**
   - POST `/api/bookings`
   - Select: station, slot, time, target SOC

4. **Arrive at Station**
   - Option A: Use scheduled booking
   - Option B: Scan QR code for instant booking

5. **Charging Process** (Staff operates)
   - Staff: PUT `/api/bookings/{id}/start`
   - System: Real-time SOC tracking
   - Staff: PUT `/api/bookings/{id}/complete`

6. **Payment & Review**
   - View invoice
   - Submit review

---

## 📊 Database Operations

### Using Stored Procedures

Backend API integrates all 15 stored procedures:

```csharp
// Example: Search stations
var stations = await _context.ChargingStations
    .FromSqlRaw("EXEC sp_search_stations_by_location @latitude, @longitude, @radius_km", 
        latParam, lonParam, radiusParam)
    .ToListAsync();

// Example: Create booking
await _context.Database.ExecuteSqlRawAsync(
    "EXEC sp_create_booking @user_id, @vehicle_id, @slot_id, @station_id, ...",
    parameters);
```

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Role-based authorization (customer, staff, admin)
- ✅ BCrypt password hashing
- ✅ HTTPS support
- ✅ CORS configuration
- ✅ SQL injection protection (EF Core parameterized queries)
- ✅ Request logging with Serilog

---

## 📝 Documentation Files

| File | Description |
|------|-------------|
| `database/DEPLOY_COMPLETE.sql` | 🔥 Complete database deployment |
| `database/README_MSSQL_DEPLOYMENT.md` | Database setup guide |
| `SkaEV.API/README.md` | Backend comprehensive docs |
| `SkaEV.API/QUICKSTART.md` | Backend quick start |
| `SkaEV.API/API_DOCUMENTATION.md` | Complete API reference |
| `README.md` | Project overview |

---

## 🚧 Troubleshooting

### Database Connection Error

```
Error: Cannot connect to database SkaEV_DB
```

**Solution:**
1. Check SQL Server is running
2. Verify connection string in `appsettings.json`
3. Re-run `DEPLOY_COMPLETE.sql`

### Port Already in Use

```
Error: Port 5000 is already in use
```

**Solution:**
Edit `appsettings.json`:
```json
"Kestrel": {
  "Endpoints": {
    "Http": { "Url": "http://localhost:5050" }
  }
}
```

### Frontend Cannot Connect to API

**Solution:**
1. Check backend is running: http://localhost:5000/health
2. Verify CORS settings in `Program.cs`
3. Check `.env.development` has correct API URL

---

## 📈 Project Status

### ✅ Completed

- [x] Database schema (16 tables)
- [x] 15 Stored procedures
- [x] Backend API structure
- [x] Authentication & Authorization (JWT)
- [x] Core Controllers (Auth, Stations, Bookings)
- [x] Entity Framework integration
- [x] Swagger documentation
- [x] Frontend structure
- [x] User authentication UI
- [x] Station search & booking UI

### 🔄 In Progress

- [ ] Additional controllers (Vehicles, Reviews, Notifications)
- [ ] SignalR real-time updates
- [ ] Payment integration
- [ ] QR code generation
- [ ] Unit tests

### 📋 Pending

- [ ] Admin dashboard functionality
- [ ] Staff management UI
- [ ] Analytics & reports
- [ ] Email notifications
- [ ] Mobile app (future)

---

## 👥 Team

**SWP391 G4 Topic 3**
- Project: Electric Vehicle Charging Management System
- Course: FPTU FA25 SWP391
- Repository: FPTU_FA25_SWP391_G4_Topic3_SkaEV

---

## 📞 Support

For questions or issues:
- Check documentation in respective folders
- Review API documentation: `SkaEV.API/API_DOCUMENTATION.md`
- Check Swagger UI: http://localhost:5000

---

**Last Updated:** October 13, 2025

✨ **Happy Coding!** ✨
