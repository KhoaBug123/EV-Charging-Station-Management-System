# SkaEV API Complete Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## 🎯 Overview

SkaEV Backend API là RESTful API được xây dựng bằng ASP.NET Core 8.0 để quản lý hệ thống trạm sạc xe điện.

**Tech Stack:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core 8.0
- Microsoft SQL Server 2019+
- JWT Authentication
- Swagger/OpenAPI
- SignalR (Real-time)

**Base URL:** `http://localhost:5000/api`

---

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│     API Layer (Controllers)         │
│  - AuthController                   │
│  - StationsController                │
│  - BookingsController                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Application Layer (Services/DTOs)  │
│  - AuthService                       │
│  - StationService                    │
│  - BookingService                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Domain Layer (Entities)          │
│  - User, Station, Booking, etc.     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Infrastructure (Data Access)       │
│  - SkaEVDbContext (EF Core)         │
│  - Stored Procedures                 │
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables (16 total)

**User Management:**
- `users` - User accounts (customer, staff, admin)
- `user_profiles` - Extended user information
- `vehicles` - User's electric vehicles

**Station Management:**
- `charging_stations` - Station locations với geography type
- `charging_posts` - Charging posts (AC/DC)
- `charging_slots` - Individual charging connectors

**Booking & Charging:**
- `bookings` - Charging reservations
- `soc_tracking` - Real-time State of Charge data
- `invoices` - Payment records

**System:**
- `qr_codes` - QR code management
- `notifications` - User notifications
- `system_logs` - System logging
- `reviews` - Station reviews
- `pricing_rules` - Dynamic pricing
- `station_staff` - Staff assignments

### Key Relationships

```
users (1) ──→ (N) vehicles
users (1) ──→ (N) bookings
bookings (1) ──→ (1) invoices
bookings (1) ──→ (N) soc_tracking
charging_stations (1) ──→ (N) charging_posts
charging_posts (1) ──→ (N) charging_slots
charging_slots (1) ──→ (N) bookings
```

---

## 🔌 API Endpoints

### 🔐 Authentication

#### POST `/api/auth/register`
Register new user account

**Request:**
```json
{
  "email": "customer@example.com",
  "password": "Password123!",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789",
  "role": "customer"
}
```

**Response:** `201 Created`
```json
{
  "userId": 1,
  "email": "customer@example.com",
  "fullName": "Nguyễn Văn A",
  "message": "Registration successful"
}
```

---

#### POST `/api/auth/login`
User login

**Request:**
```json
{
  "email": "customer@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "userId": 1,
  "email": "customer@example.com",
  "fullName": "Nguyễn Văn A",
  "role": "customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-10-14T10:00:00Z"
}
```

---

#### GET `/api/auth/profile`
Get current user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "userId": 1,
  "email": "customer@example.com",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789",
  "role": "customer",
  "isActive": true,
  "profile": {
    "dateOfBirth": "1990-01-15",
    "address": "123 Nguyen Hue, District 1",
    "city": "Ho Chi Minh",
    "avatarUrl": "https://..."
  }
}
```

---

### 🏢 Charging Stations

#### GET `/api/stations`
Get all charging stations

**Query Parameters:**
- `city` (optional): Filter by city
- `status` (optional): Filter by status (active, inactive, maintenance)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "stationId": 1,
      "stationName": "SkaEV Central Station",
      "address": "123 Vo Van Tan, District 3",
      "city": "Ho Chi Minh",
      "latitude": 10.7769,
      "longitude": 106.6955,
      "totalPosts": 10,
      "availablePosts": 7,
      "operatingHours": "24/7",
      "amenities": ["wifi", "cafe", "restroom"],
      "stationImageUrl": "https://...",
      "status": "active"
    }
  ],
  "count": 1
}
```

---

#### GET `/api/stations/nearby`
Search stations by location

**Query Parameters:**
- `latitude` (required): User latitude
- `longitude` (required): User longitude
- `radiusKm` (optional, default=10): Search radius in kilometers

**Example:**
```
GET /api/stations/nearby?latitude=10.7769&longitude=106.6955&radiusKm=5
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "stationId": 1,
      "stationName": "SkaEV Central Station",
      "distanceKm": 2.5,
      ...
    }
  ],
  "count": 3
}
```

---

#### GET `/api/stations/{id}`
Get station details

**Response:** `200 OK`
```json
{
  "stationId": 1,
  "stationName": "SkaEV Central Station",
  "address": "123 Vo Van Tan, District 3",
  "city": "Ho Chi Minh",
  "latitude": 10.7769,
  "longitude": 106.6955,
  "totalPosts": 10,
  "availablePosts": 7,
  "operatingHours": "24/7",
  "amenities": ["wifi", "cafe", "restroom"],
  "status": "active"
}
```

---

#### POST `/api/stations`
Create new station (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "stationName": "New Station",
  "address": "456 Le Loi, District 1",
  "city": "Ho Chi Minh",
  "latitude": 10.7730,
  "longitude": 106.7021,
  "operatingHours": "06:00-22:00",
  "amenities": ["wifi", "parking"]
}
```

**Response:** `201 Created`

---

### 📅 Bookings

#### GET `/api/bookings`
Get user's bookings

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default=50): Number of results
- `offset` (optional, default=0): Pagination offset

**Response:** `200 OK`
```json
{
  "data": [
    {
      "bookingId": 1,
      "stationName": "SkaEV Central Station",
      "stationAddress": "123 Vo Van Tan",
      "vehicleType": "car",
      "licensePlate": "30A-12345",
      "schedulingType": "scheduled",
      "scheduledStartTime": "2025-10-14T10:00:00",
      "status": "scheduled",
      "targetSoc": 80,
      "createdAt": "2025-10-13T15:30:00"
    }
  ],
  "count": 1
}
```

---

#### GET `/api/bookings/{id}`
Get booking details with SOC tracking

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "bookingId": 1,
  "userId": 1,
  "customerName": "Nguyễn Văn A",
  "vehicleType": "car",
  "licensePlate": "30A-12345",
  "stationName": "SkaEV Central Station",
  "schedulingType": "scheduled",
  "scheduledStartTime": "2025-10-14T10:00:00",
  "actualStartTime": "2025-10-14T10:05:00",
  "status": "in_progress",
  "targetSoc": 80,
  "currentSoc": 65.5
}
```

---

#### POST `/api/bookings`
Create new booking

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "vehicleId": 1,
  "slotId": 5,
  "stationId": 1,
  "schedulingType": "scheduled",
  "scheduledStartTime": "2025-10-14T10:00:00",
  "estimatedArrival": "2025-10-14T09:50:00",
  "targetSoc": 80,
  "estimatedDuration": 60
}
```

**Response:** `201 Created`
```json
{
  "bookingId": 123,
  "status": "scheduled",
  ...
}
```

---

#### POST `/api/bookings/qr-scan`
Create immediate booking via QR code scan

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "qrData": "SKAEV-ST1-SL5-20251014",
  "vehicleId": 1
}
```

**Response:** `201 Created`
```json
{
  "bookingId": 124,
  "status": "confirmed",
  "schedulingType": "qr_immediate",
  ...
}
```

---

#### DELETE `/api/bookings/{id}/cancel`
Cancel booking

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "cancellationReason": "Changed plans"
}
```

**Response:** `200 OK`
```json
{
  "message": "Booking cancelled successfully"
}
```

---

#### PUT `/api/bookings/{id}/start`
Start charging session (Staff/Admin only)

**Headers:**
```
Authorization: Bearer <staff_token>
```

**Response:** `200 OK`
```json
{
  "message": "Charging started successfully"
}
```

---

#### PUT `/api/bookings/{id}/complete`
Complete charging session (Staff/Admin only)

**Headers:**
```
Authorization: Bearer <staff_token>
```

**Request:**
```json
{
  "finalSoc": 95.5,
  "totalEnergyKwh": 25.3,
  "unitPrice": 5000
}
```

**Response:** `200 OK`
```json
{
  "message": "Charging completed successfully"
}
```

---

## 🔐 Authentication & Authorization

### JWT Token

API sử dụng JWT (JSON Web Token) cho authentication.

**Token Structure:**
```json
{
  "nameid": "1",
  "email": "customer@example.com",
  "unique_name": "Nguyễn Văn A",
  "role": "customer",
  "exp": 1697270400
}
```

**Usage:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Roles

- **customer**: Tạo booking, xem history, scan QR
- **staff**: Quản lý charging sessions tại trạm được assign
- **admin**: Full access toàn bộ hệ thống

### Protected Endpoints

| Endpoint | Customer | Staff | Admin |
|----------|----------|-------|-------|
| POST /api/bookings | ✅ | ✅ | ✅ |
| PUT /api/bookings/{id}/start | ❌ | ✅ | ✅ |
| POST /api/stations | ❌ | ❌ | ✅ |
| DELETE /api/stations/{id} | ❌ | ❌ | ✅ |

---

## ❌ Error Handling

### Error Response Format

```json
{
  "message": "Error message here",
  "details": "Detailed error information (development only)"
}
```

### HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Common Errors

#### Unauthorized Access
```json
{
  "message": "Invalid email or password"
}
```

#### Validation Error
```json
{
  "message": "Email already registered"
}
```

#### Not Found
```json
{
  "message": "Station not found"
}
```

---

## 📝 Examples

### Complete Booking Flow

#### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo123!",
    "fullName": "Demo User",
    "role": "customer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo123!"
  }'
```

#### 2. Find Nearby Stations

```bash
curl -X GET "http://localhost:5000/api/stations/nearby?latitude=10.7769&longitude=106.6955&radiusKm=10"
```

#### 3. Create Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": 1,
    "slotId": 5,
    "stationId": 1,
    "schedulingType": "scheduled",
    "scheduledStartTime": "2025-10-14T10:00:00",
    "targetSoc": 80
  }'
```

#### 4. Check Booking Status

```bash
curl -X GET http://localhost:5000/api/bookings/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔄 Stored Procedures

API tích hợp 15 stored procedures từ database:

1. `sp_authenticate_user` - Xác thực user
2. `sp_create_user` - Tạo user mới
3. `sp_search_stations_by_location` - Tìm trạm theo vị trí
4. `sp_get_available_slots` - Lấy slots available
5. `sp_create_booking` - Tạo booking
6. `sp_scan_qr_code` - Scan QR code
7. `sp_start_charging` - Bắt đầu sạc
8. `sp_update_soc_progress` - Cập nhật SOC
9. `sp_complete_charging` - Hoàn thành sạc
10. `sp_cancel_booking` - Hủy booking
11. `sp_get_user_booking_history` - Lịch sử booking
12. `sp_get_booking_soc_history` - Lịch sử SOC
13. `sp_create_notification` - Tạo thông báo
14. `sp_get_station_analytics` - Thống kê trạm
15. `sp_get_system_health` - Health check

---

## 🧪 Testing với Swagger

Truy cập: **http://localhost:5000**

1. Click **Authorize** button
2. Nhập: `Bearer YOUR_TOKEN`
3. Test các endpoints interactively

---

## 📞 Support

- **Team:** SWP391 G4 Topic 3
- **Email:** support@skaev.com
- **Docs:** See README.md và QUICKSTART.md

---

**Last Updated:** October 13, 2025
