-- ==============================================================================
-- CLOTHESAPP (DARSTORE) — FINAL PRODUCTION HARDENED SQL MIGRATION
-- ==============================================================================
-- Fully hardened database schema, zero-trust RLS policies, atomic RPCs,
-- finite state machine order transitions, explicit rating authorization,
-- collision-safe order sequence generator, and Supabase Realtime publication.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SEQUENCES FOR HUMAN-READABLE ORDER IDS (ORD-8924, ORD-8925, ...)
CREATE SEQUENCE IF NOT EXISTS order_id_seq START WITH 8924 INCREMENT BY 1;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'rider', 'admin')),
    vehicle_type TEXT,
    vehicle_plate TEXT,
    operating_zone TEXT,
    is_online BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    deliveries_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CLOTHES PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS clothes_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('men', 'women', 'kids', 'accessories')),
    description TEXT,
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    original_price NUMERIC(12,2),
    images TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] NOT NULL DEFAULT '{"S","M","L","XL"}',
    colors TEXT[] NOT NULL DEFAULT '{"Black","White"}',
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DAR ES SALAAM WARDS & DELIVERY ZONES
CREATE TABLE IF NOT EXISTS dar_wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_name TEXT NOT NULL UNIQUE,
    district TEXT NOT NULL,
    delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 3000.00 CHECK (delivery_fee >= 0),
    estimated_delivery_time TEXT NOT NULL DEFAULT '30-45 mins',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'clothesAPP DarStore',
    base_currency TEXT NOT NULL DEFAULT 'TZS',
    packaging_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    default_delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 3000.00,
    delivery_enabled BOOLEAN NOT NULL DEFAULT true,
    support_phone TEXT NOT NULL DEFAULT '+255754000000',
    support_email TEXT NOT NULL DEFAULT 'support@clothesapp.tz',
    promo_discount_max NUMERIC(12,2) NOT NULL DEFAULT 50000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS TABLE (Human-readable ID: ORD-8924)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_token TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_district TEXT NOT NULL,
    delivery_ward TEXT NOT NULL,
    street_landmark TEXT NOT NULL,
    delivery_notes TEXT,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(12,2) NOT NULL CHECK (delivery_fee >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    grand_total NUMERIC(12,2) NOT NULL CHECK (grand_total >= 0),
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash_on_delivery', 'mpesa', 'tigo_pesa', 'airtel_money', 'halopesa', 'card')),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PENDING_COD', 'PAID', 'FAILED', 'REFUNDED')),
    payment_reference TEXT,
    assigned_rider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rider_payout_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    rating_score INT CHECK (rating_score BETWEEN 1 AND 5),
    rating_comment TEXT,
    rated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES clothes_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    selected_size TEXT NOT NULL,
    selected_color TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER STATUS LOGS (Audit Timeline)
CREATE TABLE IF NOT EXISTS order_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role TEXT,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CUSTOMER ANALYTICS & EVENTS
CREATE TABLE IF NOT EXISTS customer_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & FAST LOOKUPS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_rider ON orders(assigned_rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON orders(guest_token) WHERE guest_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON order_status_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_clothes_products_active_cat ON clothes_products(is_active, category);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothes_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE dar_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;

-- Helper security check for Admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles read policy" ON profiles;
CREATE POLICY "Profiles read policy" ON profiles
    FOR SELECT USING (
        id = auth.uid() OR is_admin() OR role = 'rider'
    );

DROP POLICY IF EXISTS "Profiles update policy" ON profiles;
CREATE POLICY "Profiles update policy" ON profiles
    FOR UPDATE USING (
        id = auth.uid() OR is_admin()
    ) WITH CHECK (
        is_admin() OR (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
    );

DROP POLICY IF EXISTS "Profiles insert policy" ON profiles;
CREATE POLICY "Profiles insert policy" ON profiles
    FOR INSERT WITH CHECK (
        id = auth.uid() OR is_admin()
    );

-- CLOTHES PRODUCTS POLICIES (Public read active, Admin manage)
DROP POLICY IF EXISTS "Products public read" ON clothes_products;
CREATE POLICY "Products public read" ON clothes_products
    FOR SELECT USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "Products admin manage" ON clothes_products;
CREATE POLICY "Products admin manage" ON clothes_products
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- DAR WARDS POLICIES (Public read active, Admin manage)
DROP POLICY IF EXISTS "Wards public read" ON dar_wards;
CREATE POLICY "Wards public read" ON dar_wards
    FOR SELECT USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "Wards admin manage" ON dar_wards;
CREATE POLICY "Wards admin manage" ON dar_wards
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PLATFORM SETTINGS POLICIES (Public read, Admin manage)
DROP POLICY IF EXISTS "Settings public read" ON platform_settings;
CREATE POLICY "Settings public read" ON platform_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Settings admin manage" ON platform_settings;
CREATE POLICY "Settings admin manage" ON platform_settings
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ORDERS POLICIES (Zero-trust: Customers see own, Riders see assigned, Admins see all)
DROP POLICY IF EXISTS "Orders read restricted" ON orders;
CREATE POLICY "Orders read restricted" ON orders
    FOR SELECT USING (
        is_admin()
        OR (auth.uid() IS NOT NULL AND customer_id = auth.uid())
        OR (auth.uid() IS NOT NULL AND assigned_rider_id = auth.uid())
    );

DROP POLICY IF EXISTS "Orders admin update" ON orders;
CREATE POLICY "Orders admin update" ON orders
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Orders admin delete" ON orders;
CREATE POLICY "Orders admin delete" ON orders
    FOR DELETE USING (is_admin());

-- ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Order items read restricted" ON order_items;
CREATE POLICY "Order items read restricted" ON order_items
    FOR SELECT USING (
        is_admin()
        OR EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (
                (auth.uid() IS NOT NULL AND orders.customer_id = auth.uid())
                OR (auth.uid() IS NOT NULL AND orders.assigned_rider_id = auth.uid())
            )
        )
    );

DROP POLICY IF EXISTS "Order items admin manage" ON order_items;
CREATE POLICY "Order items admin manage" ON order_items
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ORDER STATUS LOGS POLICIES
DROP POLICY IF EXISTS "Order status logs read restricted" ON order_status_logs;
CREATE POLICY "Order status logs read restricted" ON order_status_logs
    FOR SELECT USING (
        is_admin()
        OR EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_status_logs.order_id
            AND (
                (auth.uid() IS NOT NULL AND orders.customer_id = auth.uid())
                OR (auth.uid() IS NOT NULL AND orders.assigned_rider_id = auth.uid())
            )
        )
    );

DROP POLICY IF EXISTS "Order status logs admin manage" ON order_status_logs;
CREATE POLICY "Order status logs admin manage" ON order_status_logs
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CUSTOMER ANALYTICS POLICIES
DROP POLICY IF EXISTS "Analytics insert policy" ON customer_analytics;
CREATE POLICY "Analytics insert policy" ON customer_analytics
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Analytics admin read" ON customer_analytics;
CREATE POLICY "Analytics admin read" ON customer_analytics
    FOR SELECT USING (is_admin());

-- ==============================================================================
-- HARDENED RPC 1: CREATE CUSTOMER ORDER (AUTHORITATIVE SERVER CALCULATIONS)
-- ==============================================================================
CREATE OR REPLACE FUNCTION create_customer_order(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_delivery_district TEXT,
    p_delivery_ward TEXT,
    p_street_landmark TEXT,
    p_delivery_notes TEXT,
    p_payment_method TEXT,
    p_payment_reference TEXT,
    p_promo_code TEXT,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order_id TEXT;
    v_guest_token TEXT;
    v_customer_id UUID;
    v_subtotal NUMERIC(12,2) := 0.00;
    v_delivery_fee NUMERIC(12,2) := 3000.00;
    v_discount NUMERIC(12,2) := 0.00;
    v_grand_total NUMERIC(12,2) := 0.00;
    v_item JSONB;
    v_product_id UUID;
    v_unit_price NUMERIC(12,2);
    v_product_name TEXT;
    v_product_image TEXT;
    v_quantity INT;
    v_size TEXT;
    v_color TEXT;
    v_line_total NUMERIC(12,2);
    v_payment_status TEXT;
    v_clean_method TEXT;
BEGIN
    -- Validate Items
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    -- Normalize Payment Method
    v_clean_method := LOWER(TRIM(p_payment_method));
    IF v_clean_method NOT IN ('cash_on_delivery', 'mpesa', 'tigo_pesa', 'airtel_money', 'halopesa', 'card') THEN
        v_clean_method := 'cash_on_delivery';
    END IF;

    -- Determine Initial Payment Status (Zero assumption: Online payments start as PENDING, COD as PENDING_COD)
    IF v_clean_method = 'cash_on_delivery' THEN
        v_payment_status := 'PENDING_COD';
    ELSE
        v_payment_status := 'PENDING';
    END IF;

    -- Determine Customer Ownership vs Guest
    v_customer_id := auth.uid();
    v_guest_token := encode(gen_random_bytes(24), 'hex');

    -- Generate Collision-Safe Human Readable Order ID
    v_order_id := 'ORD-' || nextval('order_id_seq')::TEXT;

    -- Fetch Authoritative Delivery Fee for Selected Ward
    SELECT delivery_fee INTO v_delivery_fee
    FROM dar_wards
    WHERE LOWER(ward_name) = LOWER(TRIM(p_delivery_ward)) AND is_active = true
    LIMIT 1;

    IF v_delivery_fee IS NULL THEN
        SELECT default_delivery_fee INTO v_delivery_fee
        FROM platform_settings
        WHERE id = 'default'
        LIMIT 1;
        
        IF v_delivery_fee IS NULL THEN
            v_delivery_fee := 3000.00;
        END IF;
    END IF;

    -- Calculate Subtotal Authoritatively from Database Prices
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_quantity := COALESCE((v_item->>'quantity')::INT, 1);
        v_size := COALESCE(v_item->>'size', 'M');
        v_color := COALESCE(v_item->>'color', 'Standard');

        IF v_quantity <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero.';
        END IF;

        SELECT name, base_price, (images)[1]
        INTO v_product_name, v_unit_price, v_product_image
        FROM clothes_products
        WHERE id = v_product_id AND is_active = true;

        IF v_product_name IS NULL THEN
            RAISE EXCEPTION 'Product with ID % is unavailable or does not exist.', v_product_id;
        END IF;

        v_line_total := v_unit_price * v_quantity;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    -- Authoritative Promo Code Discount Calculation
    IF p_promo_code IS NOT NULL AND TRIM(p_promo_code) <> '' THEN
        IF UPPER(TRIM(p_promo_code)) = 'KARIBU10' THEN
            v_discount := LEAST(ROUND(v_subtotal * 0.10, 2), 50000.00);
        ELSIF UPPER(TRIM(p_promo_code)) = 'DARFRESH' THEN
            v_discount := LEAST(ROUND(v_subtotal * 0.15, 2), 50000.00);
        END IF;
    END IF;

    -- Authoritative Grand Total
    v_grand_total := (v_subtotal - v_discount) + v_delivery_fee;

    -- Insert Order Record
    INSERT INTO orders (
        id,
        customer_id,
        guest_token,
        customer_name,
        customer_phone,
        delivery_district,
        delivery_ward,
        street_landmark,
        delivery_notes,
        subtotal,
        delivery_fee,
        discount_amount,
        grand_total,
        status,
        payment_method,
        payment_status,
        payment_reference,
        rider_payout_fee
    ) VALUES (
        v_order_id,
        v_customer_id,
        v_guest_token,
        TRIM(p_customer_name),
        TRIM(p_customer_phone),
        TRIM(p_delivery_district),
        TRIM(p_delivery_ward),
        TRIM(p_street_landmark),
        p_delivery_notes,
        v_subtotal,
        v_delivery_fee,
        v_discount,
        v_grand_total,
        'received',
        v_clean_method,
        v_payment_status,
        p_payment_reference,
        v_delivery_fee * 0.70 -- Default 70% rider delivery payout
    );

    -- Insert Order Items Authoritatively
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_quantity := COALESCE((v_item->>'quantity')::INT, 1);
        v_size := COALESCE(v_item->>'size', 'M');
        v_color := COALESCE(v_item->>'color', 'Standard');

        SELECT name, base_price, (images)[1]
        INTO v_product_name, v_unit_price, v_product_image
        FROM clothes_products
        WHERE id = v_product_id;

        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            product_image,
            selected_size,
            selected_color,
            quantity,
            unit_price,
            total_price
        ) VALUES (
            v_order_id,
            v_product_id,
            v_product_name,
            v_product_image,
            v_size,
            v_color,
            v_quantity,
            v_unit_price,
            v_unit_price * v_quantity
        );

        -- Decrement stock safely
        UPDATE clothes_products
        SET stock_quantity = GREATEST(0, stock_quantity - v_quantity),
            updated_at = NOW()
        WHERE id = v_product_id;
    END LOOP;

    -- Initial Audit Log
    INSERT INTO order_status_logs (
        order_id,
        previous_status,
        new_status,
        changed_by,
        role,
        note
    ) VALUES (
        v_order_id,
        NULL,
        'received',
        v_customer_id,
        CASE WHEN v_customer_id IS NOT NULL THEN 'customer' ELSE 'guest' END,
        'Order submitted by customer'
    );

    -- Return JSON Result
    RETURN jsonb_build_object(
        'order_id', v_order_id,
        'guest_token', v_guest_token,
        'subtotal', v_subtotal,
        'delivery_fee', v_delivery_fee,
        'discount_amount', v_discount,
        'grand_total', v_grand_total,
        'status', 'received',
        'payment_status', v_payment_status
    );
END;
$$;

-- ==============================================================================
-- HARDENED RPC 2: RIDER UPDATE DELIVERY STATUS (FINITE STATE MACHINE)
-- ==============================================================================
CREATE OR REPLACE FUNCTION rider_update_order_status(
    p_order_id TEXT,
    p_new_status TEXT,
    p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_role TEXT;
    v_current_status TEXT;
    v_assigned_rider_id UUID;
    v_payment_method TEXT;
    v_payment_status TEXT;
    v_clean_status TEXT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to update order status.';
    END IF;

    SELECT role INTO v_caller_role FROM profiles WHERE id = v_caller_id;

    -- Fetch Current Order State
    SELECT status, assigned_rider_id, payment_method, payment_status
    INTO v_current_status, v_assigned_rider_id, v_payment_method, v_payment_status
    FROM orders
    WHERE id = p_order_id;

    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Order % not found.', p_order_id;
    END IF;

    -- Verify Authorization: Caller must be assigned rider or admin
    IF v_caller_role <> 'admin' AND (v_assigned_rider_id IS NULL OR v_assigned_rider_id <> v_caller_id) THEN
        RAISE EXCEPTION 'Unauthorized: You are not the assigned rider for order %.', p_order_id;
    END IF;

    v_clean_status := LOWER(TRIM(p_new_status));

    -- Enforce Finite State Machine Progression for Riders (Admins retain operational flexibility)
    IF v_caller_role <> 'admin' THEN
        IF v_current_status = 'received' OR v_current_status = 'preparing' THEN
            IF v_clean_status <> 'picked_up' THEN
                RAISE EXCEPTION 'Invalid status transition: Rider must pick up order from hub before %.', v_clean_status;
            END IF;
        ELSIF v_current_status = 'picked_up' THEN
            IF v_clean_status <> 'out_for_delivery' THEN
                RAISE EXCEPTION 'Invalid status transition: Order in picked_up state can only move to out_for_delivery.';
            END IF;
        ELSIF v_current_status = 'out_for_delivery' THEN
            IF v_clean_status <> 'delivered' THEN
                RAISE EXCEPTION 'Invalid status transition: Order in out_for_delivery state can only move to delivered.';
            END IF;
        ELSE
            RAISE EXCEPTION 'Invalid status transition: Cannot modify order in % state.', v_current_status;
        END IF;
    END IF;

    -- Update Order Status
    UPDATE orders
    SET status = v_clean_status,
        payment_status = CASE 
            WHEN v_clean_status = 'delivered' AND payment_status = 'PENDING_COD' THEN 'PAID'
            ELSE payment_status
        END,
        updated_at = NOW()
    WHERE id = p_order_id;

    -- Update Rider Statistics on Delivery
    IF v_clean_status = 'delivered' AND v_assigned_rider_id IS NOT NULL THEN
        UPDATE profiles
        SET deliveries_count = deliveries_count + 1,
            updated_at = NOW()
        WHERE id = v_assigned_rider_id;
    END IF;

    -- Log Timeline Audit Event
    INSERT INTO order_status_logs (
        order_id,
        previous_status,
        new_status,
        changed_by,
        role,
        note
    ) VALUES (
        p_order_id,
        v_current_status,
        v_clean_status,
        v_caller_id,
        v_caller_role,
        COALESCE(p_note, 'Status updated by ' || v_caller_role)
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'previous_status', v_current_status,
        'new_status', v_clean_status
    );
END;
$$;

-- ==============================================================================
-- HARDENED RPC 3: SUBMIT ORDER RATING (EXPLICIT ZERO-TRUST AUTHORIZATION)
-- ==============================================================================
CREATE OR REPLACE FUNCTION submit_order_rating(
    p_order_id TEXT,
    p_rating_score INT,
    p_rating_comment TEXT DEFAULT NULL,
    p_guest_token TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
    v_caller_id UUID;
    v_is_admin BOOLEAN := false;
    v_is_owner_customer BOOLEAN := false;
    v_is_valid_guest BOOLEAN := false;
BEGIN
    -- Validate Rating Score
    IF p_rating_score IS NULL OR p_rating_score < 1 OR p_rating_score > 5 THEN
        RAISE EXCEPTION 'Rating score must be an integer between 1 and 5.';
    END IF;

    -- Fetch Order
    SELECT id, customer_id, guest_token, status, rating_score
    INTO v_order
    FROM orders
    WHERE id = p_order_id;

    IF v_order.id IS NULL THEN
        RAISE EXCEPTION 'Order % not found.', p_order_id;
    END IF;

    -- Enforce Rating only after Delivery
    IF v_order.status <> 'delivered' THEN
        RAISE EXCEPTION 'Orders can only be rated after delivery is completed.';
    END IF;

    v_caller_id := auth.uid();

    -- 1. Check Admin Authorization
    IF v_caller_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM profiles WHERE id = v_caller_id AND role = 'admin'
        ) INTO v_is_admin;
    END IF;

    -- 2. Check Authenticated Customer Ownership
    IF v_caller_id IS NOT NULL AND v_order.customer_id IS NOT NULL AND v_order.customer_id = v_caller_id THEN
        v_is_owner_customer := true;
    END IF;

    -- 3. Check Guest Order Matching Token (Strict non-null comparison)
    IF v_order.customer_id IS NULL AND p_guest_token IS NOT NULL AND TRIM(p_guest_token) <> '' THEN
        IF v_order.guest_token IS NOT NULL AND v_order.guest_token = TRIM(p_guest_token) THEN
            v_is_valid_guest := true;
        END IF;
    END IF;

    -- Final Explicit Authorization Check
    IF NOT (v_is_admin OR v_is_owner_customer OR v_is_valid_guest) THEN
        RAISE EXCEPTION 'Unauthorized to rate order.';
    END IF;

    -- Record Rating
    UPDATE orders
    SET rating_score = p_rating_score,
        rating_comment = p_rating_comment,
        rated_at = NOW(),
        updated_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'rating_score', p_rating_score,
        'message', 'Rating recorded successfully.'
    );
END;
$$;

-- ==============================================================================
-- HARDENED RPC 4: GET GUEST ORDER TRACKING (MINIMAL SANITIZED PAYLOAD)
-- ==============================================================================
CREATE OR REPLACE FUNCTION get_guest_order_tracking(
    p_order_id TEXT,
    p_guest_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_timeline JSONB;
BEGIN
    IF p_order_id IS NULL OR TRIM(p_order_id) = '' THEN
        RAISE EXCEPTION 'Order ID is required for tracking.';
    END IF;

    IF p_guest_token IS NULL OR TRIM(p_guest_token) = '' THEN
        RAISE EXCEPTION 'Valid guest tracking token is required.';
    END IF;

    -- Fetch order strictly matching ID and unpredictable Guest Token
    SELECT 
        id,
        customer_name,
        customer_phone,
        delivery_district,
        delivery_ward,
        street_landmark,
        status,
        payment_method,
        payment_status,
        subtotal,
        delivery_fee,
        discount_amount,
        grand_total,
        rating_score,
        created_at,
        updated_at
    INTO v_order
    FROM orders
    WHERE id = TRIM(p_order_id) AND guest_token = TRIM(p_guest_token);

    IF v_order.id IS NULL THEN
        RAISE EXCEPTION 'Order not found or tracking credentials are invalid.';
    END IF;

    -- Fetch Order Items
    SELECT jsonb_agg(jsonb_build_object(
        'product_name', oi.product_name,
        'product_image', oi.product_image,
        'selected_size', oi.selected_size,
        'selected_color', oi.selected_color,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'total_price', oi.total_price
    ))
    INTO v_items
    FROM order_items oi
    WHERE oi.order_id = v_order.id;

    -- Fetch Sanitized Timeline
    SELECT jsonb_agg(jsonb_build_object(
        'status', osl.new_status,
        'note', osl.note,
        'timestamp', osl.created_at
    ) ORDER BY osl.created_at ASC)
    INTO v_timeline
    FROM order_status_logs osl
    WHERE osl.order_id = v_order.id;

    -- Return strictly sanitized client payload
    RETURN jsonb_build_object(
        'id', v_order.id,
        'customer_name', v_order.customer_name,
        'customer_phone', v_order.customer_phone,
        'delivery_district', v_order.delivery_district,
        'delivery_ward', v_order.delivery_ward,
        'street_landmark', v_order.street_landmark,
        'status', v_order.status,
        'payment_method', v_order.payment_method,
        'payment_status', v_order.payment_status,
        'subtotal', v_order.subtotal,
        'delivery_fee', v_order.delivery_fee,
        'discount_amount', v_order.discount_amount,
        'grand_total', v_order.grand_total,
        'rating_score', v_order.rating_score,
        'created_at', v_order.created_at,
        'updated_at', v_order.updated_at,
        'items', COALESCE(v_items, '[]'::jsonb),
        'timeline', COALESCE(v_timeline, '[]'::jsonb)
    );
END;
$$;

-- ==============================================================================
-- HARDENED RPC 5: ADMIN ASSIGN RIDER
-- ==============================================================================
CREATE OR REPLACE FUNCTION admin_assign_rider(
    p_order_id TEXT,
    p_rider_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_rider_name TEXT;
BEGIN
    v_caller_id := auth.uid();
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can assign riders.';
    END IF;

    SELECT full_name INTO v_rider_name FROM profiles WHERE id = p_rider_id AND role = 'rider';
    IF v_rider_name IS NULL THEN
        RAISE EXCEPTION 'Rider with ID % not found or is not registered as a rider.', p_rider_id;
    END IF;

    UPDATE orders
    SET assigned_rider_id = p_rider_id,
        status = CASE WHEN status = 'received' THEN 'preparing' ELSE status END,
        updated_at = NOW()
    WHERE id = p_order_id;

    INSERT INTO order_status_logs (
        order_id,
        previous_status,
        new_status,
        changed_by,
        role,
        note
    ) VALUES (
        p_order_id,
        'received',
        'preparing',
        v_caller_id,
        'admin',
        'Assigned to rider ' || v_rider_name
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'assigned_rider_id', p_rider_id,
        'rider_name', v_rider_name
    );
END;
$$;

-- ==============================================================================
-- POSTGRESQL RPC EXECUTE PRIVILEGES CONFIGURATION
-- ==============================================================================
-- Revoke all public privileges by default
REVOKE ALL ON FUNCTION is_admin FROM PUBLIC;
REVOKE ALL ON FUNCTION create_customer_order FROM PUBLIC;
REVOKE ALL ON FUNCTION rider_update_order_status FROM PUBLIC;
REVOKE ALL ON FUNCTION submit_order_rating FROM PUBLIC;
REVOKE ALL ON FUNCTION get_guest_order_tracking FROM PUBLIC;
REVOKE ALL ON FUNCTION admin_assign_rider FROM PUBLIC;

-- Grant to intended roles:
-- Helper function
GRANT EXECUTE ON FUNCTION is_admin TO authenticated, service_role;

-- Customer / Guest order placement: anon and authenticated
GRANT EXECUTE ON FUNCTION create_customer_order TO anon, authenticated, service_role;

-- Guest tracking: anon and authenticated
GRANT EXECUTE ON FUNCTION get_guest_order_tracking TO anon, authenticated, service_role;

-- Rating submission: anon (with token) and authenticated
GRANT EXECUTE ON FUNCTION submit_order_rating TO anon, authenticated, service_role;

-- Rider status updates: authenticated only (NEVER anon)
GRANT EXECUTE ON FUNCTION rider_update_order_status TO authenticated, service_role;

-- Admin assignments: authenticated only
GRANT EXECUTE ON FUNCTION admin_assign_rider TO authenticated, service_role;

-- ==============================================================================
-- SUPABASE REALTIME REPLICATION CONFIGURATION
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE clothes_products;

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================
