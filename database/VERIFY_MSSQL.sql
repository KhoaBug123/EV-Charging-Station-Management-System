-- ============================================
-- SkaEV Database - Verification Script
-- Microsoft SQL Server
-- ============================================

USE SkaEV;
GO

PRINT '========================================';
PRINT 'Starting Database Verification...';
PRINT '========================================';
PRINT '';

-- ============================================
-- 1. CHECK TABLES
-- ============================================
PRINT '1. Checking Tables...';
PRINT '----------------------------------------';

DECLARE @TableCount INT;
SELECT @TableCount = COUNT(*)
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';

PRINT 'Total Tables: ' + CAST(@TableCount AS NVARCHAR(10));
PRINT '';

SELECT 
    TABLE_NAME,
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = t.TABLE_NAME) AS ColumnCount
FROM INFORMATION_SCHEMA.TABLES t
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

PRINT '';

-- ============================================
-- 2. CHECK INDEXES
-- ============================================
PRINT '2. Checking Indexes...';
PRINT '----------------------------------------';

DECLARE @IndexCount INT;
SELECT @IndexCount = COUNT(*)
FROM sys.indexes
WHERE object_id IN (SELECT object_id FROM sys.tables);

PRINT 'Total Indexes: ' + CAST(@IndexCount AS NVARCHAR(10));
PRINT '';

SELECT 
    OBJECT_NAME(i.object_id) AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType,
    i.is_unique AS IsUnique
FROM sys.indexes i
WHERE i.object_id IN (SELECT object_id FROM sys.tables)
  AND i.name IS NOT NULL
ORDER BY TableName, IndexName;

PRINT '';

-- ============================================
-- 3. CHECK FOREIGN KEYS
-- ============================================
PRINT '3. Checking Foreign Keys...';
PRINT '----------------------------------------';

DECLARE @FKCount INT;
SELECT @FKCount = COUNT(*)
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS;

PRINT 'Total Foreign Keys: ' + CAST(@FKCount AS NVARCHAR(10));
PRINT '';

SELECT 
    fk.name AS ForeignKeyName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTable
FROM sys.foreign_keys fk
ORDER BY TableName, ForeignKeyName;

PRINT '';

-- ============================================
-- 4. CHECK TRIGGERS
-- ============================================
PRINT '4. Checking Triggers...';
PRINT '----------------------------------------';

DECLARE @TriggerCount INT;
SELECT @TriggerCount = COUNT(*)
FROM sys.triggers
WHERE parent_class = 1;

PRINT 'Total Triggers: ' + CAST(@TriggerCount AS NVARCHAR(10));
PRINT '';

SELECT 
    OBJECT_NAME(parent_id) AS TableName,
    name AS TriggerName,
    type_desc AS TriggerType,
    is_disabled AS IsDisabled
FROM sys.triggers
WHERE parent_class = 1
ORDER BY TableName, TriggerName;

PRINT '';

-- ============================================
-- 5. CHECK FUNCTIONS
-- ============================================
PRINT '5. Checking Functions...';
PRINT '----------------------------------------';

DECLARE @FunctionCount INT;
SELECT @FunctionCount = COUNT(*)
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_TYPE = 'FUNCTION';

PRINT 'Total Functions: ' + CAST(@FunctionCount AS NVARCHAR(10));
PRINT '';

SELECT 
    ROUTINE_NAME AS FunctionName,
    DATA_TYPE AS ReturnType
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_TYPE = 'FUNCTION'
ORDER BY ROUTINE_NAME;

PRINT '';

-- ============================================
-- 6. CHECK VIEWS
-- ============================================
PRINT '6. Checking Views...';
PRINT '----------------------------------------';

DECLARE @ViewCount INT;
SELECT @ViewCount = COUNT(*)
FROM INFORMATION_SCHEMA.VIEWS;

PRINT 'Total Views: ' + CAST(@ViewCount AS NVARCHAR(10));
PRINT '';

SELECT 
    TABLE_NAME AS ViewName
FROM INFORMATION_SCHEMA.VIEWS
ORDER BY TABLE_NAME;

PRINT '';

-- ============================================
-- 7. CHECK CONSTRAINTS
-- ============================================
PRINT '7. Checking Constraints...';
PRINT '----------------------------------------';

DECLARE @ConstraintCount INT;
SELECT @ConstraintCount = COUNT(*)
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS;

PRINT 'Total Constraints: ' + CAST(@ConstraintCount AS NVARCHAR(10));
PRINT '';

SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
ORDER BY TABLE_NAME, CONSTRAINT_TYPE, CONSTRAINT_NAME;

PRINT '';

-- ============================================
-- 8. TEST FUNCTIONS
-- ============================================
PRINT '8. Testing Functions...';
PRINT '----------------------------------------';

-- Test distance calculation
DECLARE @distance DECIMAL(10,2);
SET @distance = dbo.fn_calculate_distance(10.7769, 106.7009, 10.8231, 106.6297);
PRINT 'Distance Calculation Test: ' + CAST(@distance AS NVARCHAR(20)) + ' km';

-- Test price function (will return 0 if no data)
DECLARE @price INT;
SET @price = dbo.fn_get_current_price(NEWID(), 'dc');
PRINT 'Price Function Test: ' + CAST(@price AS NVARCHAR(20)) + ' VND/kWh';

PRINT '';

-- ============================================
-- 9. TEST VIEWS
-- ============================================
PRINT '9. Testing Views...';
PRINT '----------------------------------------';

DECLARE @ActiveBookingsCount INT;
SELECT @ActiveBookingsCount = COUNT(*) FROM v_active_bookings;
PRINT 'Active Bookings View: ' + CAST(@ActiveBookingsCount AS NVARCHAR(10)) + ' rows';

DECLARE @AvailableStationsCount INT;
SELECT @AvailableStationsCount = COUNT(*) FROM v_available_stations;
PRINT 'Available Stations View: ' + CAST(@AvailableStationsCount AS NVARCHAR(10)) + ' rows';

PRINT '';

-- ============================================
-- 10. CHECK SPATIAL SUPPORT
-- ============================================
PRINT '10. Checking Spatial Support...';
PRINT '----------------------------------------';

IF EXISTS (
    SELECT 1 
    FROM sys.columns c
    JOIN sys.types t ON c.system_type_id = t.system_type_id
    WHERE OBJECT_NAME(c.object_id) = 'charging_stations'
      AND c.name = 'location'
      AND t.name = 'geography'
)
BEGIN
    PRINT 'Geography column found in charging_stations: ✓';
    
    -- Test creating a geography point
    DECLARE @testPoint GEOGRAPHY;
    SET @testPoint = geography::Point(10.7769, 106.7009, 4326);
    PRINT 'Geography point creation test: ✓';
END
ELSE
BEGIN
    PRINT 'Geography column NOT found: ✗';
END

PRINT '';

-- ============================================
-- 11. DATABASE SIZE
-- ============================================
PRINT '11. Database Size Information...';
PRINT '----------------------------------------';

EXEC sp_spaceused;

PRINT '';

-- ============================================
-- 12. SUMMARY
-- ============================================
PRINT '========================================';
PRINT 'Verification Summary';
PRINT '========================================';
PRINT 'Tables: ' + CAST(@TableCount AS NVARCHAR(10));
PRINT 'Indexes: ' + CAST(@IndexCount AS NVARCHAR(10));
PRINT 'Foreign Keys: ' + CAST(@FKCount AS NVARCHAR(10));
PRINT 'Triggers: ' + CAST(@TriggerCount AS NVARCHAR(10));
PRINT 'Functions: ' + CAST(@FunctionCount AS NVARCHAR(10));
PRINT 'Views: ' + CAST(@ViewCount AS NVARCHAR(10));
PRINT 'Constraints: ' + CAST(@ConstraintCount AS NVARCHAR(10));
PRINT '';
PRINT 'Verification completed successfully!';
PRINT '========================================';
