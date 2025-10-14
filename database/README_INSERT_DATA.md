# 📊 Hướng Dẫn Insert Sample Data - SkaEV Database

## 📝 Mô tả
Script SQL để insert dữ liệu mẫu các trạm sạc xe điện trên toàn quốc vào database SkaEV_DB.

## 📍 Dữ liệu bao gồm

### 🏢 20 Trạm sạc tại các thành phố lớn:
- **Hồ Chí Minh (8 trạm)**:
  - VinFast Station - Bitexco Financial Tower (Quận 1)
  - EV Station - Landmark 81 (Bình Thạnh)
  - Aeon Mall Tân Phú Charging Hub
  - Green Energy Station - Crescent Mall (Quận 7)
  - VinFast Station - Phú Mỹ Hưng
  - Gigamall Charging Station (Thủ Đức)
  - Vincom Mega Mall Thảo Điền
  - Crescent Riverside Station (Quận 10)

- **Hà Nội (4 trạm)**:
  - VinFast Station - Vincom Metropolis
  - Royal City Mega Charging Hub
  - Aeon Mall Long Biên
  - Times City Green Charging

- **Các tỉnh thành khác**:
  - Đà Nẵng (2 trạm)
  - Bình Dương (2 trạm)
  - Cần Thơ, Vũng Tàu, Nha Trang, Hải Phòng (mỗi nơi 1 trạm)

### ⚡ Charging Posts:
- Tổng số: **~230 posts** (phân bố theo từng trạm)
- **40% DC Fast Charging**: 50kW - 150kW
- **60% AC Charging**: 11kW - 22kW
- Connector types: CCS2, CHAdeMO, Type 2, GB/T

### 🔌 Charging Slots:
- **2 slots per post** = ~460 slots
- Mỗi slot có connector riêng
- Status: Available

## 🚀 Cách chạy script

### Phương pháp 1: SQL Server Management Studio (SSMS)
1. Mở **SQL Server Management Studio**
2. Connect đến SQL Server của bạn
3. Click **File → Open → File**
4. Chọn file `INSERT_STATIONS_DATA.sql`
5. Đảm bảo database là `SkaEV_DB`
6. Click **Execute** (F5) hoặc nút ▶️
7. Xem kết quả trong Messages tab

### Phương pháp 2: Command Line (sqlcmd)
```powershell
cd database
sqlcmd -S localhost -E -i INSERT_STATIONS_DATA.sql
```

### Phương pháp 3: Azure Data Studio
1. Mở **Azure Data Studio**
2. Connect đến SQL Server
3. Open file `INSERT_STATIONS_DATA.sql`
4. Click **Run** (F5)

## ✅ Kiểm tra dữ liệu sau khi insert

```sql
-- Kiểm tra số lượng stations
SELECT COUNT(*) AS total_stations FROM charging_stations;
-- Expected: 20

-- Kiểm tra stations theo city
SELECT city, COUNT(*) AS station_count
FROM charging_stations
GROUP BY city
ORDER BY station_count DESC;

-- Kiểm tra posts theo loại
SELECT post_type, COUNT(*) AS post_count
FROM charging_posts
GROUP BY post_type;

-- Kiểm tra tổng slots
SELECT COUNT(*) AS total_slots FROM charging_slots;
-- Expected: ~460

-- Xem chi tiết một trạm
SELECT 
    s.station_name,
    s.address,
    s.city,
    s.total_posts,
    s.amenities,
    COUNT(p.post_id) AS actual_posts
FROM charging_stations s
LEFT JOIN charging_posts p ON s.station_id = p.station_id
WHERE s.station_name LIKE '%Bitexco%'
GROUP BY s.station_id, s.station_name, s.address, s.city, s.total_posts, s.amenities;
```

## 🎯 Features của dữ liệu mẫu

✅ **Realistic locations**: Địa chỉ thật tại các trung tâm thương mại lớn  
✅ **Accurate coordinates**: Latitude/Longitude chính xác cho maps  
✅ **Varied amenities**: Parking, WiFi, Food Court, Shopping, etc.  
✅ **Multiple charging types**: DC Fast (50-150kW) và AC (11-22kW)  
✅ **Operating hours**: 24/7 và giờ hành chính  
✅ **Status tracking**: Active, available slots  

## 🔄 Reset data (nếu cần)

Nếu muốn xóa và insert lại:

```sql
-- ⚠️ CẢNH BÁO: Lệnh này sẽ XÓA TẤT CẢ dữ liệu!
USE SkaEV_DB;
GO

DELETE FROM charging_slots;
DELETE FROM charging_posts;
DELETE FROM charging_stations;

-- Sau đó chạy lại INSERT_STATIONS_DATA.sql
```

## 📱 Test với Frontend

Sau khi insert data, test ngay trên frontend:

1. Mở http://localhost:5173
2. Login/Register
3. Vào trang **Find Stations**
4. Xem danh sách 20 trạm sạc
5. Click vào từng trạm để xem chi tiết
6. Test chức năng search, filter theo city

## 🐛 Troubleshooting

### Lỗi: "Invalid column name"
→ Chạy lại `DEPLOY_COMPLETE.sql` để tạo đầy đủ schema

### Lỗi: "Cannot insert duplicate key"
→ Data đã tồn tại, chạy DELETE commands ở trên

### Lỗi: "Foreign key constraint"
→ Đảm bảo database SkaEV_DB đã được deploy đầy đủ

## 📞 Support

Nếu có vấn đề, check:
1. SQL Server đang chạy: `Get-Service MSSQLSERVER`
2. Database tồn tại: `SELECT name FROM sys.databases WHERE name = 'SkaEV_DB'`
3. Tables đã được tạo: `SELECT name FROM sys.tables`

---

**Tạo bởi**: SWP391_G4_Topic3  
**Ngày**: October 13, 2025  
**Version**: 1.0
