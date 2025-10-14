-- =====================================================================================
-- QUICK REFERENCE - Useful SQL Queries for SkaEV Database
-- =====================================================================================

USE SkaEV_DB;
GO

-- =====================================================================================
-- 1. VIEW ALL STATIONS
-- =====================================================================================
SELECT 
    station_id,
    station_name,
    city,
    address,
    total_posts,
    available_posts,
    status
FROM charging_stations
ORDER BY city, station_name;

-- =====================================================================================
-- 2. VIEW STATIONS WITH POSTS COUNT
-- =====================================================================================
SELECT 
    s.station_name,
    s.city,
    s.total_posts AS posts_configured,
    COUNT(p.post_id) AS posts_actual,
    SUM(CASE WHEN p.status = 'available' THEN 1 ELSE 0 END) AS posts_available
FROM charging_stations s
LEFT JOIN charging_posts p ON s.station_id = p.station_id
GROUP BY s.station_id, s.station_name, s.city, s.total_posts
ORDER BY s.city, s.station_name;

-- =====================================================================================
-- 3. VIEW POSTS BY STATION
-- =====================================================================================
SELECT 
    s.station_name,
    p.post_number,
    p.post_type,
    p.power_output AS power_kw,
    p.connector_types,
    p.status
FROM charging_stations s
JOIN charging_posts p ON s.station_id = p.station_id
WHERE s.station_name LIKE '%Bitexco%'  -- Change station name here
ORDER BY p.post_number;

-- =====================================================================================
-- 4. FIND STATIONS BY CITY
-- =====================================================================================
SELECT 
    station_name,
    address,
    total_posts,
    operating_hours,
    amenities
FROM charging_stations
WHERE city = N'Hồ Chí Minh'  -- Change city: Hà Nội, Đà Nẵng, etc.
ORDER BY station_name;

-- =====================================================================================
-- 5. STATIONS WITH FAST DC CHARGING (>= 50kW)
-- =====================================================================================
SELECT DISTINCT
    s.station_name,
    s.city,
    s.address,
    p.power_output AS max_power_kw
FROM charging_stations s
JOIN charging_posts p ON s.station_id = p.station_id
WHERE p.power_output >= 50
ORDER BY p.power_output DESC, s.city;

-- =====================================================================================
-- 6. CHARGING STATISTICS BY CITY
-- =====================================================================================
SELECT 
    city,
    COUNT(DISTINCT station_id) AS total_stations,
    SUM(total_posts) AS total_posts,
    SUM(available_posts) AS available_posts,
    CAST(AVG(total_posts) AS DECIMAL(5,1)) AS avg_posts_per_station
FROM charging_stations
WHERE status = 'active'
GROUP BY city
ORDER BY total_stations DESC;

-- =====================================================================================
-- 7. POSTS STATISTICS BY TYPE
-- =====================================================================================
SELECT 
    post_type,
    COUNT(*) AS total_posts,
    MIN(power_output) AS min_power_kw,
    MAX(power_output) AS max_power_kw,
    AVG(power_output) AS avg_power_kw,
    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_posts
FROM charging_posts
GROUP BY post_type;

-- =====================================================================================
-- 8. FIND NEAREST STATIONS (by coordinates)
-- =====================================================================================
-- Example: Find stations near Bitexco (10.7718, 106.7039)
DECLARE @UserLat DECIMAL(10,8) = 10.7718;
DECLARE @UserLon DECIMAL(11,8) = 106.7039;

SELECT TOP 5
    station_name,
    address,
    city,
    total_posts,
    available_posts,
    latitude,
    longitude,
    location.STDistance(geography::Point(@UserLat, @UserLon, 4326)) AS distance_meters
FROM charging_stations
WHERE status = 'active'
ORDER BY distance_meters;

-- =====================================================================================
-- 9. AVAILABLE SLOTS BY CONNECTOR TYPE
-- =====================================================================================
SELECT 
    cs.connector_type,
    COUNT(*) AS total_slots,
    SUM(CASE WHEN cs.status = 'available' THEN 1 ELSE 0 END) AS available_slots,
    AVG(cs.max_power) AS avg_power_kw
FROM charging_slots cs
GROUP BY cs.connector_type
ORDER BY total_slots DESC;

-- =====================================================================================
-- 10. STATIONS WITH 24/7 OPERATION
-- =====================================================================================
SELECT 
    station_name,
    city,
    address,
    operating_hours,
    total_posts
FROM charging_stations
WHERE operating_hours LIKE '%00:00-23:59%' OR operating_hours LIKE '%24/7%'
ORDER BY city, station_name;

-- =====================================================================================
-- 11. UPDATE STATION STATUS
-- =====================================================================================
-- Set station to maintenance
-- UPDATE charging_stations 
-- SET status = 'maintenance', updated_at = GETDATE()
-- WHERE station_id = 1;

-- Set station back to active
-- UPDATE charging_stations 
-- SET status = 'active', updated_at = GETDATE()
-- WHERE station_id = 1;

-- =====================================================================================
-- 12. UPDATE POST AVAILABILITY
-- =====================================================================================
-- Mark post as occupied
-- UPDATE charging_posts 
-- SET status = 'occupied', available_slots = available_slots - 1, updated_at = GETDATE()
-- WHERE post_id = 1;

-- Mark post as available
-- UPDATE charging_posts 
-- SET status = 'available', available_slots = total_slots, updated_at = GETDATE()
-- WHERE post_id = 1;

-- =====================================================================================
-- 13. DETAILED STATION VIEW
-- =====================================================================================
SELECT 
    s.station_name,
    s.address,
    s.city,
    s.latitude,
    s.longitude,
    s.operating_hours,
    s.amenities,
    s.total_posts,
    s.available_posts,
    COUNT(p.post_id) AS actual_posts,
    COUNT(cs.slot_id) AS total_slots,
    SUM(CASE WHEN cs.status = 'available' THEN 1 ELSE 0 END) AS available_slots
FROM charging_stations s
LEFT JOIN charging_posts p ON s.station_id = p.station_id
LEFT JOIN charging_slots cs ON p.post_id = cs.post_id
WHERE s.station_id = 1  -- Change station ID
GROUP BY 
    s.station_id, s.station_name, s.address, s.city, 
    s.latitude, s.longitude, s.operating_hours, s.amenities,
    s.total_posts, s.available_posts;

-- =====================================================================================
-- 14. SEARCH STATIONS BY NAME OR ADDRESS
-- =====================================================================================
SELECT 
    station_name,
    address,
    city,
    total_posts,
    operating_hours
FROM charging_stations
WHERE station_name LIKE N'%VinFast%'  -- Search keyword
   OR address LIKE N'%VinFast%'
ORDER BY city, station_name;

-- =====================================================================================
-- 15. DELETE ALL DATA (USE WITH CAUTION!)
-- =====================================================================================
/*
-- ⚠️ CẢNH BÁO: Uncommenting và chạy đoạn này sẽ XÓA TẤT CẢ dữ liệu!

DELETE FROM charging_slots;
DELETE FROM charging_posts;
DELETE FROM charging_stations;

PRINT 'All charging station data deleted!';
*/

GO
