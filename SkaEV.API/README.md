# SkaEV Backend API

ASP.NET Core Web API cho hệ thống quản lý trạm sạc xe điện SkaEV.

## 🚀 Tech Stack

- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: Microsoft SQL Server 2019+
- **ORM**: Entity Framework Core 8.0
- **Authentication**: JWT Bearer Token
- **Real-time**: SignalR
- **Documentation**: Swagger/OpenAPI
- **Logging**: Serilog
- **Spatial Data**: NetTopologySuite (for geography type)
- **Password Hashing**: BCrypt.Net

## 📁 Project Structure

```
SkaEV.API/
├── Application/
│   ├── DTOs/                # Data Transfer Objects
│   │   ├── Auth/           # Authentication DTOs
│   │   ├── Stations/       # Station DTOs
│   │   └── Bookings/       # Booking DTOs
│   └── Services/           # Business Logic Services
│       ├── AuthService.cs
│       ├── StationService.cs
│       └── BookingService.cs
├── Controllers/            # API Controllers
│   ├── AuthController.cs
│   ├── StationsController.cs
│   └── BookingsController.cs
├── Domain/
│   └── Entities/          # Database Models (16 tables)
├── Infrastructure/
│   └── Data/
│       └── SkaEVDbContext.cs   # EF Core DbContext
├── appsettings.json       # Configuration
└── Program.cs             # Application Entry Point
```

## 🗄️ Database Schema

16 tables được map từ `database/DEPLOY_COMPLETE.sql`:

1. **users** - User accounts
2. **user_profiles** - Extended user information
3. **vehicles** - User vehicles
4. **charging_stations** - Charging station locations
5. **charging_posts** - Charging posts per station
6. **charging_slots** - Individual charging slots
7. **bookings** - Booking records
8. **soc_tracking** - State of Charge tracking
9. **invoices** - Payment invoices
10. **qr_codes** - QR code management
11. **notifications** - User notifications
12. **system_logs** - System logging
13. **reviews** - Station reviews
14. **pricing_rules** - Dynamic pricing
15. **station_staff** - Staff assignments

## 🔧 Setup Instructions

### 1. Prerequisites

- .NET 8.0 SDK
- SQL Server 2019+ 
- Visual Studio 2022 hoặc VS Code

### 2. Database Setup

```powershell
# Deploy database từ file duy nhất
cd database
# Mở SQL Server Management Studio và chạy DEPLOY_COMPLETE.sql
```

### 3. Update Connection String

Sửa file `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=SkaEV_DB;User Id=YOUR_USER;Password=YOUR_PASSWORD;"
  }
}
```

Hoặc dùng Windows Authentication:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SkaEV_DB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 4. Restore Packages

```powershell
cd SkaEV.API
dotnet restore
```

### 5. Run Application

```powershell
dotnet run
```

Hoặc:

```powershell
dotnet watch run  # Auto-reload on changes
```

API sẽ chạy tại:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001
- **Swagger**: http://localhost:5000 (root URL)

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/login              # Login
POST   /api/auth/register           # Register
GET    /api/auth/profile            # Get profile
POST   /api/auth/logout             # Logout
```

### Stations

```
GET    /api/stations                # Get all stations
GET    /api/stations/{id}           # Get station by ID
GET    /api/stations/nearby         # Search by location
POST   /api/stations                # Create station (Admin)
PUT    /api/stations/{id}           # Update station (Admin/Staff)
DELETE /api/stations/{id}           # Delete station (Admin)
```

### Bookings

```
GET    /api/bookings                # Get user bookings
GET    /api/bookings/{id}           # Get booking details
POST   /api/bookings                # Create booking
DELETE /api/bookings/{id}/cancel    # Cancel booking
POST   /api/bookings/qr-scan        # QR scan booking
PUT    /api/bookings/{id}/start     # Start charging (Staff)
PUT    /api/bookings/{id}/complete  # Complete charging (Staff)
```

### Health Check

```
GET    /health                      # API health status
```

## 🔐 Authentication

API sử dụng JWT Bearer Token authentication.

### Login Example

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer@skaev.com",
  "password": "password123"
}
```

Response:
```json
{
  "userId": 1,
  "email": "customer@skaev.com",
  "fullName": "John Doe",
  "role": "customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-10-14T10:00:00Z"
}
```

### Use Token

```bash
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 User Roles

- **customer**: Khách hàng - Tạo booking, xem history, scan QR
- **staff**: Nhân viên trạm - Quản lý charging sessions
- **admin**: Quản trị viên - Full access

## 🔄 Stored Procedures Integration

API tích hợp 15 stored procedures từ database:

1. `sp_authenticate_user` - Login
2. `sp_create_user` - Register
3. `sp_search_stations_by_location` - Search stations
4. `sp_get_available_slots` - Get slots
5. `sp_create_booking` - Create booking
6. `sp_scan_qr_code` - QR scan
7. `sp_start_charging` - Start charging
8. `sp_update_soc_progress` - Update SOC
9. `sp_complete_charging` - Complete charging
10. `sp_cancel_booking` - Cancel booking
11. `sp_get_user_booking_history` - Booking history
12. `sp_get_booking_soc_history` - SOC history
13. `sp_create_notification` - Create notification
14. `sp_get_station_analytics` - Analytics
15. `sp_get_system_health` - System health

## 📊 Swagger Documentation

Truy cập Swagger UI tại: http://localhost:5000

Swagger cung cấp:
- Interactive API testing
- Request/Response schemas
- JWT authentication integration
- Endpoint descriptions

## 🧪 Testing

```powershell
# Test với curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test với PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/stations" -Method Get
```

## 🚧 Development

### Add New Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    // Implementation
}
```

### Add New Service

```csharp
public interface IVehicleService
{
    Task<List<VehicleDto>> GetUserVehiclesAsync(int userId);
}

public class VehicleService : IVehicleService
{
    // Implementation
}
```

Register trong `Program.cs`:
```csharp
builder.Services.AddScoped<IVehicleService, VehicleService>();
```

## 📝 Logging

Logs được lưu tại `logs/skaev-YYYYMMDD.txt`

```csharp
_logger.LogInformation("User {UserId} logged in", userId);
_logger.LogError(ex, "Error processing booking {BookingId}", bookingId);
```

## 🔒 Security

- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ Password hashing với BCrypt
- ✅ CORS configuration
- ✅ HTTPS support
- ✅ SQL injection protection (EF Core)
- ⚠️ **TODO**: Rate limiting
- ⚠️ **TODO**: API versioning

## 🐛 Troubleshooting

### Database Connection Error

```
SqlException: Cannot open database "SkaEV_DB"
```

**Solution**: Chạy `DEPLOY_COMPLETE.sql` trong SSMS

### JWT Token Invalid

```
401 Unauthorized
```

**Solution**: Kiểm tra token trong header `Authorization: Bearer <token>`

### Spatial Data Error

```
InvalidOperationException: No NetTopologySuite
```

**Solution**: Đảm bảo đã cài package `NetTopologySuite` và `NetTopologySuite.IO.SqlServerBytes`

## 📞 Support

- Email: support@skaev.com
- Team: SWP391 G4 Topic 3

## 📄 License

Copyright © 2025 SkaEV - FPTU_FA25_SWP391_G4_Topic3
