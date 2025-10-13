-- ============================================
-- SkaEV Database - Sample Data & Stored Procedures
-- Microsoft SQL Server
-- Based on Current Frontend Implementation
-- ============================================

USE SkaEV;
GO

-- ============================================
-- 1. STORED PROCEDURES FOR API ENDPOINTS
-- ============================================

-- --------------------------------------------
-- 1.1 User Authentication
-- --------------------------------------------

-- Register new user
CREATE OR ALTER PROCEDURE sp_register_user
    @email NVARCHAR(255),
    @password_hash NVARCHAR(255),
    @first_name NVARCHAR(100),
    @last_name NVARCHAR(100),
    @phone NVARCHAR(20) = NULL,
    @role NVARCHAR(20) = 'customer'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM users WHERE email = @email)
        BEGIN
            THROW 50001, 'Email already exists', 1;
        END
        
        -- Create user
        DECLARE @user_id UNIQUEIDENTIFIER = NEWID();
        
        INSERT INTO users (id, email, password_hash, role, email_verified, is_active)
        VALUES (@user_id, LOWER(@email), @password_hash, @role, 0, 1);
        
        -- Create profile
        INSERT INTO user_profiles (user_id, first_name, last_name, phone)
        VALUES (@user_id, @first_name, @last_name, @phone);
        
        -- Create notification settings (default values)
        INSERT INTO notification_settings (user_id)
        VALUES (@user_id);
        
        COMMIT TRANSACTION;
        
        -- Return user info
        SELECT 
            u.id,
            u.email,
            u.role,
            up.first_name,
            up.last_name,
            up.phone,
            u.created_at
        FROM users u
        JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = @user_id;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Login user
CREATE OR ALTER PROCEDURE sp_login_user
    @email NVARCHAR(255),
    @password_hash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verify credentials
    DECLARE @user_id UNIQUEIDENTIFIER;
    SELECT @user_id = id
    FROM users
    WHERE email = LOWER(@email)
      AND password_hash = @password_hash
      AND is_active = 1;
    
    IF @user_id IS NULL
    BEGIN
        THROW 50002, 'Invalid credentials', 1;
    END
    
    -- Update last login
    UPDATE users
    SET last_login_at = GETUTCDATE()
    WHERE id = @user_id;
    
    -- Return user profile
    SELECT 
        u.id,
        u.email,
        u.role,
        u.email_verified,
        up.first_name,
        up.last_name,
        up.phone,
        up.avatar_url,
        up.permissions
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = @user_id;
END;
GO

-- --------------------------------------------
-- 1.2 Station Search & Nearby
-- --------------------------------------------

-- Find nearby stations
CREATE OR ALTER PROCEDURE sp_find_nearby_stations
    @lat DECIMAL(10,8),
    @lon DECIMAL(11,8),
    @max_distance_km DECIMAL(10,2) = 10,
    @connector_type NVARCHAR(20) = NULL,
    @min_power INT = NULL,
    @max_results INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @user_location GEOGRAPHY = geography::Point(@lat, @lon, 4326);
    
    SELECT TOP (@max_results)
        s.id,
        s.name,
        s.address,
        s.latitude,
        s.longitude,
        s.type,
        s.status,
        s.total_ports,
        s.available_ports,
        s.max_power,
        s.connector_types,
        s.parking_fee_per_hour,
        s.rating_overall,
        s.rating_cleanliness,
        s.rating_availability,
        s.rating_speed,
        s.total_reviews,
        s.images,
        CASE 
            WHEN s.operating_hours_close IS NULL THEN '24/7'
            ELSE CAST(s.operating_hours_open AS NVARCHAR(10)) + ' - ' + CAST(s.operating_hours_close AS NVARCHAR(10))
        END as operating_hours,
        @user_location.STDistance(s.location) / 1000.0 AS distance_km
    FROM charging_stations s
    WHERE s.status = 'active'
      AND s.available_ports > 0
      AND @user_location.STDistance(s.location) / 1000.0 <= @max_distance_km
      AND (@connector_type IS NULL OR s.connector_types LIKE '%' + @connector_type + '%')
      AND (@min_power IS NULL OR s.max_power >= @min_power)
    ORDER BY @user_location.STDistance(s.location);
END;
GO

-- Get station details with posts and slots
CREATE OR ALTER PROCEDURE sp_get_station_details
    @station_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Station info
    SELECT 
        id,
        name,
        address,
        latitude,
        longitude,
        type,
        status,
        total_ports,
        available_ports,
        max_power,
        connector_types,
        landmarks,
        parking_fee_per_hour,
        rating_overall,
        rating_cleanliness,
        rating_availability,
        rating_speed,
        total_reviews,
        images,
        CASE 
            WHEN operating_hours_close IS NULL THEN '24/7'
            ELSE CAST(operating_hours_open AS NVARCHAR(10)) + ' - ' + CAST(operating_hours_close AS NVARCHAR(10))
        END as operating_hours
    FROM charging_stations
    WHERE id = @station_id;
    
    -- Charging posts
    SELECT 
        cp.id,
        cp.post_identifier,
        cp.name,
        cp.type,
        cp.power_kw,
        cp.voltage_v,
        cp.total_slots,
        cp.available_slots
    FROM charging_posts cp
    WHERE cp.station_id = @station_id
    ORDER BY cp.post_identifier;
    
    -- Charging slots
    SELECT 
        cs.id,
        cs.post_id,
        cs.slot_identifier,
        cs.connector_type,
        cs.status,
        cs.current_booking_id
    FROM charging_slots cs
    JOIN charging_posts cp ON cs.post_id = cp.id
    WHERE cp.station_id = @station_id
    ORDER BY cs.slot_identifier;
    
    -- Current pricing
    SELECT 
        charging_type,
        rate_per_kwh
    FROM pricing_tiers
    WHERE station_id = @station_id
      AND effective_from <= GETUTCDATE()
      AND (effective_to IS NULL OR effective_to > GETUTCDATE())
    ORDER BY charging_type;
END;
GO

-- --------------------------------------------
-- 1.3 Booking Management
-- --------------------------------------------

-- Create new booking
CREATE OR ALTER PROCEDURE sp_create_booking
    @customer_id UNIQUEIDENTIFIER,
    @station_id UNIQUEIDENTIFIER,
    @scheduled_date_time DATETIME2,
    @scheduling_type NVARCHAR(20) = 'scheduled',
    @estimated_duration_minutes INT = NULL,
    @target_soc_percent DECIMAL(5,2) = 80
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verify station exists and has capacity
        IF NOT EXISTS (
            SELECT 1 FROM charging_stations 
            WHERE id = @station_id 
              AND status = 'active' 
              AND available_ports > 0
        )
        BEGIN
            THROW 50003, 'Station not available', 1;
        END
        
        -- Create booking
        DECLARE @booking_id UNIQUEIDENTIFIER = NEWID();
        
        INSERT INTO bookings (
            id,
            customer_id,
            station_id,
            status,
            scheduling_type,
            scheduled_date_time,
            estimated_arrival,
            qr_scanned,
            charging_started
        )
        VALUES (
            @booking_id,
            @customer_id,
            @station_id,
            'scheduled',
            @scheduling_type,
            @scheduled_date_time,
            @scheduled_date_time,
            0,
            0
        );
        
        COMMIT TRANSACTION;
        
        -- Return booking details
        SELECT 
            b.id,
            b.customer_id,
            b.station_id,
            s.name as station_name,
            s.address as station_address,
            b.status,
            b.scheduling_type,
            b.scheduled_date_time,
            b.created_at
        FROM bookings b
        JOIN charging_stations s ON b.station_id = s.id
        WHERE b.id = @booking_id;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Scan QR code and assign slot
CREATE OR ALTER PROCEDURE sp_scan_qr_code
    @booking_id UNIQUEIDENTIFIER,
    @qr_data NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verify booking exists
        IF NOT EXISTS (SELECT 1 FROM bookings WHERE id = @booking_id AND status = 'scheduled')
        BEGIN
            THROW 50004, 'Booking not found or not in valid state', 1;
        END
        
        -- Parse QR code to get slot_id
        DECLARE @slot_id UNIQUEIDENTIFIER;
        SELECT @slot_id = slot_id
        FROM qr_codes
        WHERE qr_data = @qr_data
          AND is_active = 1;
        
        IF @slot_id IS NULL
        BEGIN
            THROW 50005, 'Invalid or inactive QR code', 1;
        END
        
        -- Check slot availability
        IF NOT EXISTS (SELECT 1 FROM charging_slots WHERE id = @slot_id AND status = 'available')
        BEGIN
            THROW 50006, 'Slot not available', 1;
        END
        
        -- Update booking
        UPDATE bookings
        SET 
            slot_id = @slot_id,
            qr_scanned = 1,
            qr_scanned_at = GETUTCDATE(),
            qr_data = @qr_data,
            status = 'confirmed'
        WHERE id = @booking_id;
        
        -- Update slot status
        UPDATE charging_slots
        SET 
            status = 'occupied',
            current_booking_id = @booking_id,
            last_used_at = GETUTCDATE()
        WHERE id = @slot_id;
        
        COMMIT TRANSACTION;
        
        -- Return updated booking
        SELECT 
            b.*,
            s.name as station_name,
            cs.slot_identifier,
            cs.connector_type
        FROM bookings b
        JOIN charging_stations s ON b.station_id = s.id
        LEFT JOIN charging_slots cs ON b.slot_id = cs.id
        WHERE b.id = @booking_id;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Start charging session
CREATE OR ALTER PROCEDURE sp_start_charging
    @booking_id UNIQUEIDENTIFIER,
    @vehicle_id UNIQUEIDENTIFIER = NULL,
    @initial_soc_percent DECIMAL(5,2),
    @target_soc_percent DECIMAL(5,2) = 80,
    @battery_capacity_kwh DECIMAL(5,2) = 60
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verify booking
        IF NOT EXISTS (SELECT 1 FROM bookings WHERE id = @booking_id AND qr_scanned = 1 AND status = 'confirmed')
        BEGIN
            THROW 50007, 'Booking not confirmed or QR not scanned', 1;
        END
        
        -- Update booking status
        UPDATE bookings
        SET 
            status = 'charging',
            charging_started = 1,
            charging_started_at = GETUTCDATE(),
            actual_start_time = GETUTCDATE()
        WHERE id = @booking_id;
        
        -- Create SOC tracking
        INSERT INTO soc_tracking (
            booking_id,
            vehicle_id,
            battery_capacity_kwh,
            initial_soc_percent,
            current_soc_percent,
            target_soc_percent,
            status,
            start_time
        )
        VALUES (
            @booking_id,
            @vehicle_id,
            @battery_capacity_kwh,
            @initial_soc_percent,
            @initial_soc_percent,
            @target_soc_percent,
            'charging',
            GETUTCDATE()
        );
        
        COMMIT TRANSACTION;
        
        SELECT 
            b.*,
            st.id as soc_tracking_id,
            st.initial_soc_percent,
            st.target_soc_percent
        FROM bookings b
        LEFT JOIN soc_tracking st ON b.id = st.booking_id
        WHERE b.id = @booking_id;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Update SOC progress
CREATE OR ALTER PROCEDURE sp_update_soc_progress
    @booking_id UNIQUEIDENTIFIER,
    @current_soc_percent DECIMAL(5,2),
    @power_delivered_kw DECIMAL(6,2) = NULL,
    @voltage_v DECIMAL(6,2) = NULL,
    @current_a DECIMAL(6,2) = NULL,
    @temperature_c DECIMAL(4,1) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @soc_tracking_id UNIQUEIDENTIFIER;
        
        SELECT @soc_tracking_id = id
        FROM soc_tracking
        WHERE booking_id = @booking_id;
        
        IF @soc_tracking_id IS NULL
        BEGIN
            THROW 50008, 'SOC tracking not found', 1;
        END
        
        -- Calculate charging rate
        DECLARE @initial_soc DECIMAL(5,2), @start_time DATETIME2;
        SELECT @initial_soc = initial_soc_percent, @start_time = start_time
        FROM soc_tracking
        WHERE id = @soc_tracking_id;
        
        DECLARE @elapsed_hours DECIMAL(10,4) = DATEDIFF(SECOND, @start_time, GETUTCDATE()) / 3600.0;
        DECLARE @charging_rate DECIMAL(5,2) = CASE 
            WHEN @elapsed_hours > 0 THEN (@current_soc_percent - @initial_soc) / @elapsed_hours
            ELSE 0
        END;
        
        DECLARE @target_soc DECIMAL(5,2);
        SELECT @target_soc = target_soc_percent FROM soc_tracking WHERE id = @soc_tracking_id;
        
        DECLARE @estimated_minutes INT = CASE
            WHEN @charging_rate > 0 THEN CAST(((@target_soc - @current_soc_percent) / @charging_rate) * 60 AS INT)
            ELSE NULL
        END;
        
        -- Update SOC tracking
        UPDATE soc_tracking
        SET 
            current_soc_percent = @current_soc_percent,
            charging_rate_percent_per_hour = @charging_rate,
            estimated_time_to_target_minutes = @estimated_minutes,
            last_updated = GETUTCDATE(),
            status = CASE 
                WHEN @current_soc_percent >= @target_soc THEN 'completed'
                ELSE 'charging'
            END
        WHERE id = @soc_tracking_id;
        
        -- Insert history record
        INSERT INTO soc_charging_history (
            soc_tracking_id,
            soc_percent,
            power_delivered_kw,
            voltage_v,
            current_a,
            temperature_c
        )
        VALUES (
            @soc_tracking_id,
            @current_soc_percent,
            @power_delivered_kw,
            @voltage_v,
            @current_a,
            @temperature_c
        );
        
        -- Return updated SOC data
        SELECT * FROM soc_tracking WHERE id = @soc_tracking_id;
        
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

-- Complete charging session
CREATE OR ALTER PROCEDURE sp_complete_charging
    @booking_id UNIQUEIDENTIFIER,
    @final_soc_percent DECIMAL(5,2),
    @energy_delivered_kwh DECIMAL(8,2),
    @duration_minutes INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Get booking and station info
        DECLARE @station_id UNIQUEIDENTIFIER, @slot_id UNIQUEIDENTIFIER;
        SELECT @station_id = station_id, @slot_id = slot_id
        FROM bookings
        WHERE id = @booking_id;
        
        -- Calculate costs
        DECLARE @energy_cost INT, @parking_cost INT, @total_cost INT;
        
        -- Get pricing (simplified - using DC rate)
        DECLARE @rate_per_kwh INT = dbo.fn_get_current_price(@station_id, 'dc');
        SET @energy_cost = CAST(@energy_delivered_kwh * @rate_per_kwh AS INT);
        
        -- Parking fee (if any)
        DECLARE @parking_fee_per_hour INT;
        SELECT @parking_fee_per_hour = ISNULL(parking_fee_per_hour, 0)
        FROM charging_stations
        WHERE id = @station_id;
        
        SET @parking_cost = CAST((@duration_minutes / 60.0) * @parking_fee_per_hour AS INT);
        SET @total_cost = @energy_cost + @parking_cost;
        
        -- Update booking
        UPDATE bookings
        SET 
            status = 'completed',
            actual_end_time = GETUTCDATE(),
            duration_minutes = @duration_minutes,
            energy_delivered_kwh = @energy_delivered_kwh,
            energy_cost_vnd = @energy_cost,
            parking_cost_vnd = @parking_cost,
            total_amount_vnd = @total_cost,
            completed_at = GETUTCDATE()
        WHERE id = @booking_id;
        
        -- Update SOC tracking
        UPDATE soc_tracking
        SET 
            current_soc_percent = @final_soc_percent,
            status = 'completed'
        WHERE booking_id = @booking_id;
        
        -- Release slot
        UPDATE charging_slots
        SET 
            status = 'available',
            current_booking_id = NULL
        WHERE id = @slot_id;
        
        -- Create invoice
        DECLARE @invoice_id UNIQUEIDENTIFIER = NEWID();
        DECLARE @customer_id UNIQUEIDENTIFIER;
        SELECT @customer_id = customer_id FROM bookings WHERE id = @booking_id;
        
        DECLARE @invoice_number NVARCHAR(50) = 'INV-' + FORMAT(GETUTCDATE(), 'yyyyMM') + '-' + 
            RIGHT('000' + CAST((SELECT COUNT(*) + 1 FROM invoices WHERE MONTH(invoice_date) = MONTH(GETUTCDATE())) AS NVARCHAR(10)), 3);
        
        DECLARE @tax INT = CAST(@total_cost * 0.1 AS INT); -- 10% VAT
        
        INSERT INTO invoices (
            id,
            invoice_number,
            booking_id,
            customer_id,
            subtotal_vnd,
            tax_vnd,
            total_vnd,
            status
        )
        VALUES (
            @invoice_id,
            @invoice_number,
            @booking_id,
            @customer_id,
            @total_cost,
            @tax,
            @total_cost + @tax,
            'pending'
        );
        
        COMMIT TRANSACTION;
        
        -- Return completed booking with invoice
        SELECT 
            b.*,
            i.invoice_number,
            i.total_vnd as invoice_total
        FROM bookings b
        LEFT JOIN invoices i ON b.id = i.booking_id
        WHERE b.id = @booking_id;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- --------------------------------------------
-- 1.4 Customer Bookings
-- --------------------------------------------

-- Get customer active bookings
CREATE OR ALTER PROCEDURE sp_get_customer_active_bookings
    @customer_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.id,
        b.station_id,
        s.name as station_name,
        s.address as station_address,
        b.status,
        b.scheduling_type,
        b.scheduled_date_time,
        b.qr_scanned,
        b.charging_started,
        cs.slot_identifier,
        cs.connector_type,
        st.current_soc_percent,
        st.target_soc_percent,
        st.estimated_time_to_target_minutes,
        b.created_at
    FROM bookings b
    JOIN charging_stations s ON b.station_id = s.id
    LEFT JOIN charging_slots cs ON b.slot_id = cs.id
    LEFT JOIN soc_tracking st ON b.id = st.booking_id
    WHERE b.customer_id = @customer_id
      AND b.status IN ('scheduled', 'confirmed', 'charging')
    ORDER BY b.created_at DESC;
END;
GO

-- Get customer booking history
CREATE OR ALTER PROCEDURE sp_get_customer_booking_history
    @customer_id UNIQUEIDENTIFIER,
    @page INT = 1,
    @page_size INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @offset INT = (@page - 1) * @page_size;
    
    SELECT 
        b.id,
        b.station_id,
        s.name as station_name,
        s.address as station_address,
        b.status,
        b.scheduled_date_time,
        b.actual_start_time,
        b.actual_end_time,
        b.duration_minutes,
        b.energy_delivered_kwh,
        b.total_amount_vnd,
        b.rating_overall,
        i.invoice_number,
        b.created_at,
        b.completed_at
    FROM bookings b
    JOIN charging_stations s ON b.station_id = s.id
    LEFT JOIN invoices i ON b.id = i.booking_id
    WHERE b.customer_id = @customer_id
      AND b.status IN ('completed', 'cancelled')
    ORDER BY b.created_at DESC
    OFFSET @offset ROWS
    FETCH NEXT @page_size ROWS ONLY;
    
    -- Also return total count
    SELECT COUNT(*) as total_count
    FROM bookings
    WHERE customer_id = @customer_id
      AND status IN ('completed', 'cancelled');
END;
GO

-- ============================================
-- 2. UTILITY PROCEDURES
-- ============================================

-- Generate QR codes for all slots
CREATE OR ALTER PROCEDURE sp_generate_qr_codes
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO qr_codes (station_id, slot_id, qr_data, is_active)
    SELECT 
        cp.station_id,
        cs.id as slot_id,
        'SKAEV:STATION:' + CAST(cp.station_id AS NVARCHAR(50)) + ':' + CAST(cs.id AS NVARCHAR(50)) as qr_data,
        1
    FROM charging_slots cs
    JOIN charging_posts cp ON cs.post_id = cp.id
    WHERE NOT EXISTS (
        SELECT 1 FROM qr_codes WHERE slot_id = cs.id
    );
    
    SELECT @@ROWCOUNT as qr_codes_generated;
END;
GO

-- Update station availability counts
CREATE OR ALTER PROCEDURE sp_update_station_availability
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE s
    SET 
        available_ports = (
            SELECT COUNT(*)
            FROM charging_slots cs
            JOIN charging_posts cp ON cs.post_id = cp.id
            WHERE cp.station_id = s.id
              AND cs.status = 'available'
        )
    FROM charging_stations s;
    
    SELECT @@ROWCOUNT as stations_updated;
END;
GO

-- ============================================
-- END OF STORED PROCEDURES
-- ============================================

PRINT 'Stored procedures created successfully!';
PRINT 'Execute sp_generate_qr_codes to create QR codes for all slots';
PRINT 'Execute sp_update_station_availability to update availability counts';
GO
