-- =====================================================================================
-- SkaEV Database - Insert Sample Charging Stations Data
-- =====================================================================================
-- Instruction: 
-- 1. Open SQL Server Management Studio (SSMS)
-- 2. Connect to your SQL Server
-- 3. Open this file and execute (F5)
-- =====================================================================================

USE SkaEV_DB;
GO

PRINT '=====================================================================================';
PRINT 'Inserting sample charging stations data...';
PRINT '=====================================================================================';
GO

-- =====================================================================================
-- INSERT CHARGING STATIONS
-- =====================================================================================

-- Ho Chi Minh City Stations
INSERT INTO charging_stations (station_name, address, city, latitude, longitude, total_posts, available_posts, operating_hours, amenities, status)
VALUES 
('VinFast Station - Bitexco Financial Tower', 'Số 2 Hải Triều, Phường Bến Nghé, Quận 1', 'Hồ Chí Minh', 10.77180000, 106.70390000, 8, 8, '00:00-23:59', 
    '["Parking", "Restroom", "Cafe", "WiFi", "Security", "24/7"]', 'active'),

('EV Station - Landmark 81', '720A Đ. Điện Biên Phủ, Phường 22, Quận Bình Thạnh', 'Hồ Chí Minh', 10.79430000, 106.72120000, 12, 12, '06:00-22:00', 
    '["Parking", "Restroom", "Shopping Mall", "Food Court", "WiFi", "Sky Deck"]', 'active'),

('Aeon Mall Tân Phú Charging Hub', '30 Bờ Bao Tân Thắng, Phường Sơn Kỳ, Quận Tân Phú', 'Hồ Chí Minh', 10.80610000, 106.61350000, 10, 10, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Entertainment", "Kids Zone"]', 'active'),

('Green Energy Station - Crescent Mall', '101 Tôn Dật Tiên, Phường Tân Phú, Quận 7', 'Hồ Chí Minh', 10.72950000, 106.71960000, 15, 15, '08:00-23:00', 
    '["Parking", "Restroom", "Shopping", "Cafe", "Cinema", "Supermarket"]', 'active'),

('VinFast Station - Phú Mỹ Hưng', '8 Nguyễn Văn Linh, Phường Tân Phú, Quận 7', 'Hồ Chí Minh', 10.72560000, 106.71020000, 20, 20, '00:00-23:59', 
    '["Parking", "Restroom", "Convenience Store", "Security", "WiFi", "24/7"]', 'active'),

('Gigamall Charging Station', '240-242 Phạm Văn Đồng, Phường Hiệp Bình Chánh, Thủ Đức', 'Hồ Chí Minh', 10.84140000, 106.71450000, 10, 10, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Entertainment", "Cinema"]', 'active'),

('Vincom Mega Mall Thảo Điền', '159 Xa lộ Hà Nội, Phường Thảo Điền, Thủ Đức', 'Hồ Chí Minh', 10.80080000, 106.74070000, 12, 12, '08:30-22:30', 
    '["Parking", "Shopping", "Food Court", "Cinema", "Kids Zone", "Supermarket"]', 'active'),

('Crescent Riverside Station', 'Đ. Nguyễn Tri Phương, Phường 9, Quận 10', 'Hồ Chí Minh', 10.76520000, 106.66800000, 6, 6, '07:00-21:00', 
    '["Parking", "Restroom", "Cafe", "River View"]', 'active'),

-- Hanoi Stations
('VinFast Station - Vincom Metropolis', '29 Liễu Giai, Phường Ngọc Khánh, Ba Đình', 'Hà Nội', 21.03340000, 105.81100000, 10, 10, '00:00-23:59', 
    '["Parking", "Restroom", "Shopping Mall", "Food Court", "WiFi", "Security", "24/7"]', 'active'),

('Royal City Mega Charging Hub', '72A Nguyễn Trãi, Phường Thượng Đình, Thanh Xuân', 'Hà Nội', 20.99540000, 105.80960000, 18, 18, '00:00-23:59', 
    '["Parking", "Shopping Mall", "Food Court", "Cinema", "Entertainment", "Swimming Pool", "24/7"]', 'active'),

('Aeon Mall Long Biên', '27 Cổ Linh, Phường Long Biên, Long Biên', 'Hà Nội', 21.03650000, 105.89750000, 14, 14, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Entertainment", "Supermarket"]', 'active'),

('Times City Green Charging', '458 Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng', 'Hà Nội', 20.99780000, 105.86360000, 12, 12, '06:00-23:00', 
    '["Parking", "Shopping", "Food Court", "Cinema", "Water Park", "Ice Rink"]', 'active'),

-- Da Nang Stations
('VinFast Station - Vincom Plaza Đà Nẵng', '910A Ngô Quyền, Phường An Hải Bắc, Sơn Trà', 'Đà Nẵng', 16.06780000, 108.22310000, 10, 10, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Cinema", "Beach Access"]', 'active'),

('Lotte Mart Đà Nẵng', '6 Nại Nam, Phường Hòa Cường Bắc, Hải Châu', 'Đà Nẵng', 16.04710000, 108.20680000, 8, 8, '08:00-22:00', 
    '["Parking", "Shopping", "Food Court", "Entertainment", "Supermarket"]', 'active'),

-- Can Tho Station
('Vincom Plaza Xuân Khánh', '209 Đ. 30 Tháng 4, Xuân Khánh, Ninh Kiều', 'Cần Thơ', 10.04520000, 105.74690000, 8, 8, '08:30-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Cinema", "River View"]', 'active'),

-- Binh Duong Stations
('VinFast Station - AEON Bình Dương Canary', 'Đại lộ Bình Dương, Thuận Giao, Thuận An', 'Bình Dương', 10.92360000, 106.70420000, 12, 12, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Entertainment", "Cinema"]', 'active'),

('Becamex Tower Charging Station', '230 Đại lộ Bình Dương, Phú Hòa, Thủ Dầu Một', 'Bình Dương', 10.98040000, 106.65250000, 10, 10, '00:00-23:59', 
    '["Parking", "Restroom", "Office Building", "Cafe", "Security", "24/7"]', 'active'),

-- Vung Tau Station
('VinFast Station - Vũng Tàu Plaza', '22A Trương Công Định, Phường 1, Vũng Tàu', 'Bà Rịa - Vũng Tàu', 10.34600000, 107.08430000, 8, 8, '07:00-22:00', 
    '["Parking", "Restroom", "Shopping", "Beach Access", "Cafe", "Seafood"]', 'active'),

-- Nha Trang Station
('Vincom Plaza Nha Trang', '52 Trần Phú, Lộc Thọ, Nha Trang', 'Khánh Hòa', 12.24880000, 109.19430000, 10, 10, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Beach View", "Cafe"]', 'active'),

-- Hai Phong Station
('VinFast Station - Vincom Plaza Hải Phòng', '52 Đường Trần Phú, Máy Chai, Ngô Quyền', 'Hải Phòng', 20.86280000, 106.68300000, 8, 8, '08:00-22:00', 
    '["Parking", "Shopping Mall", "Food Court", "Entertainment"]', 'active');

PRINT '✓ Inserted 20 charging stations';
GO

-- =====================================================================================
-- INSERT CHARGING POSTS
-- =====================================================================================

DECLARE @StationID INT;
DECLARE @TotalPosts INT;
DECLARE @Counter INT;

DECLARE station_cursor CURSOR FOR 
SELECT station_id, total_posts FROM charging_stations;

OPEN station_cursor;
FETCH NEXT FROM station_cursor INTO @StationID, @TotalPosts;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @Counter = 1;
    
    WHILE @Counter <= @TotalPosts
    BEGIN
        -- Determine post type and power based on counter
        DECLARE @PostType NVARCHAR(50);
        DECLARE @PowerOutput DECIMAL(10,2);
        DECLARE @ConnectorTypes NVARCHAR(MAX);
        
        -- Distribute posts: 40% DC Fast, 60% AC
        IF @Counter % 5 IN (0, 1) -- 40% DC posts
        BEGIN
            SET @PostType = 'DC';
            SET @PowerOutput = CASE 
                WHEN @Counter % 3 = 0 THEN 150.00  -- Ultra-fast 150kW
                ELSE 50.00                          -- Fast 50kW
            END;
            SET @ConnectorTypes = '["CCS2", "CHAdeMO"]';
        END
        ELSE -- 60% AC posts
        BEGIN
            SET @PostType = 'AC';
            SET @PowerOutput = CASE 
                WHEN @Counter % 2 = 0 THEN 22.00   -- Fast AC
                ELSE 11.00                          -- Standard AC
            END;
            SET @ConnectorTypes = '["Type 2", "GB/T"]';
        END
        
        INSERT INTO charging_posts (station_id, post_number, post_type, power_output, connector_types, total_slots, available_slots, status)
        VALUES (
            @StationID,
            CONCAT('P', RIGHT('00' + CAST(@Counter AS VARCHAR), 2)),
            @PostType,
            @PowerOutput,
            @ConnectorTypes,
            2, -- 2 slots per post
            2, -- Initially all available
            'available'
        );
        
        SET @Counter = @Counter + 1;
    END
    
    FETCH NEXT FROM station_cursor INTO @StationID, @TotalPosts;
END

CLOSE station_cursor;
DEALLOCATE station_cursor;

PRINT '✓ Inserted charging posts for all stations';
GO

-- =====================================================================================
-- INSERT CHARGING SLOTS
-- =====================================================================================

DECLARE @PostID INT;
DECLARE @ConnectorTypesJson NVARCHAR(MAX);
DECLARE @PowerOut DECIMAL(10,2);

DECLARE post_cursor CURSOR FOR 
SELECT post_id, connector_types, power_output FROM charging_posts;

OPEN post_cursor;
FETCH NEXT FROM post_cursor INTO @PostID, @ConnectorTypesJson, @PowerOut;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Insert 2 slots per post
    INSERT INTO charging_slots (post_id, slot_number, connector_type, max_power, status)
    VALUES 
        (@PostID, 1, 
         CASE 
            WHEN @ConnectorTypesJson LIKE '%CCS2%' THEN 'CCS2'
            WHEN @ConnectorTypesJson LIKE '%Type 2%' THEN 'Type 2'
            ELSE 'Type 2'
         END,
         @PowerOut, 'available'),
        (@PostID, 2, 
         CASE 
            WHEN @ConnectorTypesJson LIKE '%CHAdeMO%' THEN 'CHAdeMO'
            WHEN @ConnectorTypesJson LIKE '%GB/T%' THEN 'GB/T'
            ELSE 'Type 2'
         END,
         @PowerOut, 'available');
    
    FETCH NEXT FROM post_cursor INTO @PostID, @ConnectorTypesJson, @PowerOut;
END

CLOSE post_cursor;
DEALLOCATE post_cursor;

PRINT '✓ Inserted charging slots for all posts';
GO

-- =====================================================================================
-- VERIFICATION
-- =====================================================================================

PRINT '';
PRINT '=====================================================================================';
PRINT 'Data Insertion Summary:';
PRINT '=====================================================================================';

SELECT 
    'Charging Stations' AS [Table],
    COUNT(*) AS [Records Inserted]
FROM charging_stations
UNION ALL
SELECT 
    'Charging Posts' AS [Table],
    COUNT(*) AS [Records Inserted]
FROM charging_posts
UNION ALL
SELECT 
    'Charging Slots' AS [Table],
    COUNT(*) AS [Records Inserted]
FROM charging_slots;

PRINT '';
PRINT '✅ Sample data insertion completed successfully!';
PRINT '';
PRINT '📍 Stations by City:';
SELECT city, COUNT(*) AS station_count
FROM charging_stations
GROUP BY city
ORDER BY station_count DESC;

PRINT '';
PRINT '⚡ Posts by Type:';
SELECT post_type, COUNT(*) AS post_count, AVG(power_output) AS avg_power_kw
FROM charging_posts
GROUP BY post_type;

GO
