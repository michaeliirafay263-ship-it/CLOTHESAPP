-- ==============================================================================
-- SAMAKI FRESH / CLOTHESAPP — COMPLETE PRODUCTION DATABASE MIGRATION
-- ==============================================================================
-- Authoritative schema, RLS policies, RPCs, Triggers, Views, and Realtime config.
-- Zero sample data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SEQUENCES
CREATE SEQUENCE IF NOT EXISTS order_id_seq START WITH 8924 INCREMENT BY 1;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
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

-- 4. FISH / CLOTHES PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS fish_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    original_price NUMERIC(12,2),
    images TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors TEXT[] NOT NULL DEFAULT '{}',
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
    store_name TEXT NOT NULL DEFAULT 'Samaki Fresh',
    base_currency TEXT NOT NULL DEFAULT 'TZS',
    packaging_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    cold_chain_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    default_delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 3000.00,
    delivery_enabled BOOLEAN NOT NULL DEFAULT true,
    support_phone TEXT NOT NULL DEFAULT '+255754000000',
    support_email TEXT NOT NULL DEFAULT 'support@samakifresh.tz',
    promo_discount_max NUMERIC(12,2) NOT NULL DEFAULT 50000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS TABLE
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
    cold_chain_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (cold_chain_fee >= 0),
    delivery_fee NUMERIC(12,2) NOT NULL CHECK (delivery_fee >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    grand_total NUMERIC(12,2) NOT NULL CHECK (grand_total >= 0),
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'packed', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL,
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
    product_id UUID REFERENCES fish_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    selected_size TEXT,
    selected_color TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER STATUS LOGS TABLE
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

-- 10. CUSTOMER ANALYTICS VIEW (security_invoker = true)
CREATE OR REPLACE VIEW customer_analytics
WITH (security_invoker = true)
AS
SELECT 
    o.customer_id,
    p.full_name,
    p.phone_number,
    COUNT(o.id) AS total_orders,
    COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS delivered_orders,
    COALESCE(SUM(o.grand_total) FILTER (WHERE o.payment_status = 'PAID'), 0.00) AS total_spend,
    MAX(o.created_at) AS last_order_date
FROM orders o
LEFT JOIN profiles p ON p.id = o.customer_id
WHERE o.customer_id IS NOT NULL
GROUP BY o.customer_id, p.full_name, p.phone_number;

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_rider ON orders(assigned_rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON orders(guest_token) WHERE guest_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON order_status_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_fish_products_active ON fish_products(is_active);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE dar_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;

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
DROP POLICY IF EXISTS "Profiles select policy" ON profiles;
CREATE POLICY "Profiles select policy" ON profiles
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

-- PRODUCTS POLICIES
DROP POLICY IF EXISTS "Products select policy" ON fish_products;
CREATE POLICY "Products select policy" ON fish_products
    FOR SELECT USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "Products admin policy" ON fish_products;
CREATE POLICY "Products admin policy" ON fish_products
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- DAR WARDS POLICIES
DROP POLICY IF EXISTS "Wards select policy" ON dar_wards;
CREATE POLICY "Wards select policy" ON dar_wards
    FOR SELECT USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "Wards admin policy" ON dar_wards;
CREATE POLICY "Wards admin policy" ON dar_wards
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PLATFORM SETTINGS POLICIES
DROP POLICY IF EXISTS "Settings select policy" ON platform_settings;
CREATE POLICY "Settings select policy" ON platform_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Settings admin policy" ON platform_settings;
CREATE POLICY "Settings admin policy" ON platform_settings
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ORDERS POLICIES (Zero-trust)
DROP POLICY IF EXISTS "Orders select policy" ON orders;
CREATE POLICY "Orders select policy" ON orders
    FOR SELECT USING (
        is_admin()
        OR (auth.uid() IS NOT NULL AND customer_id = auth.uid())
        OR (auth.uid() IS NOT NULL AND assigned_rider_id = auth.uid())
    );

DROP POLICY IF EXISTS "Orders admin update policy" ON orders;
CREATE POLICY "Orders admin update policy" ON orders
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Orders admin delete policy" ON orders;
CREATE POLICY "Orders admin delete policy" ON orders
    FOR DELETE USING (is_admin());

-- ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Order items select policy" ON order_items;
CREATE POLICY "Order items select policy" ON order_items
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

DROP POLICY IF EXISTS "Order items admin policy" ON order_items;
CREATE POLICY "Order items admin policy" ON order_items
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ORDER STATUS LOGS POLICIES
DROP POLICY IF EXISTS "Order status logs select policy" ON order_status_logs;
CREATE POLICY "Order status logs select policy" ON order_status_logs
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

DROP POLICY IF EXISTS "Order status logs admin policy" ON order_status_logs;
CREATE POLICY "Order status logs admin policy" ON order_status_logs
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ==============================================================================
-- DATABASE TRIGGERS
-- ==============================================================================

-- Trigger 1: Automatic User Profile Creation on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO profiles (
        id,
        full_name,
        phone_number,
        role,
        vehicle_type,
        vehicle_plate,
        operating_zone
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
        NEW.raw_user_meta_data->>'phone_number',
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        NEW.raw_user_meta_data->>'vehicle_type',
        NEW.raw_user_meta_data->>'vehicle_plate',
        NEW.raw_user_meta_data->>'operating_zone'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger 2: Automatic Order Status Milestone Logging
CREATE OR REPLACE FUNCTION trg_order_status_milestone_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_role TEXT := 'system';
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        v_caller_id := auth.uid();
        IF v_caller_id IS NOT NULL THEN
            SELECT role INTO v_role FROM profiles WHERE id = v_caller_id;
        END IF;

        INSERT INTO order_status_logs (
            order_id,
            previous_status,
            new_status,
            changed_by,
            role,
            note
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            v_caller_id,
            COALESCE(v_role, 'system'),
            'Order status moved to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_status_milestone ON orders;
CREATE TRIGGER trg_order_status_milestone
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION trg_order_status_milestone_func();

-- Trigger 3: Guard Immutable Order Fields against unauthorized direct tampering
CREATE OR REPLACE FUNCTION trg_guard_orders_immutable_fields_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT is_admin() THEN
        IF OLD.subtotal IS DISTINCT FROM NEW.subtotal
           OR OLD.delivery_fee IS DISTINCT FROM NEW.delivery_fee
           OR OLD.cold_chain_fee IS DISTINCT FROM NEW.cold_chain_fee
           OR OLD.discount_amount IS DISTINCT FROM NEW.discount_amount
           OR OLD.grand_total IS DISTINCT FROM NEW.grand_total
           OR OLD.customer_name IS DISTINCT FROM NEW.customer_name
           OR OLD.customer_phone IS DISTINCT FROM NEW.customer_phone
           OR OLD.delivery_district IS DISTINCT FROM NEW.delivery_district
           OR OLD.delivery_ward IS DISTINCT FROM NEW.delivery_ward
           OR OLD.street_landmark IS DISTINCT FROM NEW.street_landmark
           OR OLD.guest_token IS DISTINCT FROM NEW.guest_token
        THEN
            RAISE EXCEPTION 'Unauthorized modification of protected immutable order fields.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_orders_immutable_fields ON orders;
CREATE TRIGGER trg_guard_orders_immutable_fields
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION trg_guard_orders_immutable_fields_func();

-- ==============================================================================
-- HARDENED RPC 1: CREATE ORDER (Authoritative Server Calculations)
-- ==============================================================================
CREATE OR REPLACE FUNCTION create_order(
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
    v_cold_chain_fee NUMERIC(12,2) := 0.00;
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
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    v_clean_method := LOWER(TRIM(p_payment_method));
    IF v_clean_method NOT IN ('cash_on_delivery', 'cod', 'mpesa', 'tigo_pesa', 'airtel_money', 'halopesa', 'card') THEN
        v_clean_method := 'cash_on_delivery';
    END IF;

    -- Initial Payment Status: Online payments = PENDING, COD = PENDING_COD
    IF v_clean_method = 'cash_on_delivery' OR v_clean_method = 'cod' THEN
        v_payment_status := 'PENDING_COD';
    ELSE
        v_payment_status := 'PENDING';
    END IF;

    v_customer_id := auth.uid();
    v_guest_token := encode(gen_random_bytes(24), 'hex');
    v_order_id := 'ORD-' || nextval('order_id_seq')::TEXT;

    -- Platform Settings: Cold chain fee
    SELECT cold_chain_fee, default_delivery_fee 
    INTO v_cold_chain_fee, v_delivery_fee
    FROM platform_settings
    WHERE id = 'default'
    LIMIT 1;

    IF v_cold_chain_fee IS NULL THEN v_cold_chain_fee := 0.00; END IF;
    IF v_delivery_fee IS NULL THEN v_delivery_fee := 3000.00; END IF;

    -- Authoritative Ward Delivery Fee Lookup
    SELECT delivery_fee INTO v_delivery_fee
    FROM dar_wards
    WHERE LOWER(ward_name) = LOWER(TRIM(p_delivery_ward)) AND is_active = true
    LIMIT 1;

    IF v_delivery_fee IS NULL THEN
        v_delivery_fee := 3000.00;
    END IF;

    -- Calculate Subtotal Authoritatively
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_quantity := COALESCE((v_item->>'quantity')::INT, 1);
        v_size := COALESCE(v_item->>'size', 'Standard');
        v_color := COALESCE(v_item->>'color', 'Standard');

        IF v_quantity <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero.';
        END IF;

        SELECT name, base_price, (images)[1]
        INTO v_product_name, v_unit_price, v_product_image
        FROM fish_products
        WHERE id = v_product_id AND is_active = true;

        IF v_product_name IS NULL THEN
            RAISE EXCEPTION 'Product with ID % is unavailable or does not exist.', v_product_id;
        END IF;

        v_line_total := v_unit_price * v_quantity;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    -- Authoritative Promo Discount Calculation
    IF p_promo_code IS NOT NULL AND TRIM(p_promo_code) <> '' THEN
        IF UPPER(TRIM(p_promo_code)) = 'KARIBU10' THEN
            v_discount := LEAST(ROUND(v_subtotal * 0.10, 2), 50000.00);
        ELSIF UPPER(TRIM(p_promo_code)) = 'SAMAKIFRESH' OR UPPER(TRIM(p_promo_code)) = 'DARFRESH' THEN
            v_discount := LEAST(ROUND(v_subtotal * 0.15, 2), 50000.00);
        END IF;
    END IF;

    -- Grand Total Calculation
    v_grand_total := (v_subtotal - v_discount) + v_delivery_fee + v_cold_chain_fee;

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
        cold_chain_fee,
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
        v_cold_chain_fee,
        v_delivery_fee,
        v_discount,
        v_grand_total,
        'received',
        v_clean_method,
        v_payment_status,
        p_payment_reference,
        v_delivery_fee * 0.70
    );

    -- Insert Order Items Authoritatively
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_quantity := COALESCE((v_item->>'quantity')::INT, 1);
        v_size := COALESCE(v_item->>'size', 'Standard');
        v_color := COALESCE(v_item->>'color', 'Standard');

        SELECT name, base_price, (images)[1]
        INTO v_product_name, v_unit_price, v_product_image
        FROM fish_products
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
        UPDATE fish_products
        SET stock_quantity = GREATEST(0, stock_quantity - v_quantity),
            updated_at = NOW()
        WHERE id = v_product_id;
    END LOOP;

    RETURN jsonb_build_object(
        'order_id', v_order_id,
        'guest_token', v_guest_token,
        'subtotal', v_subtotal,
        'cold_chain_fee', v_cold_chain_fee,
        'delivery_fee', v_delivery_fee,
        'discount_amount', v_discount,
        'grand_total', v_grand_total,
        'status', 'received',
        'payment_status', v_payment_status
    );
END;
$$;

-- Alias create_customer_order to create_order for full backward/forward compatibility
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
BEGIN
    RETURN create_order(
        p_customer_name,
        p_customer_phone,
        p_delivery_district,
        p_delivery_ward,
        p_street_landmark,
        p_delivery_notes,
        p_payment_method,
        p_payment_reference,
        p_promo_code,
        p_items
    );
END;
$$;

-- ==============================================================================
-- HARDENED RPC 2: RIDER UPDATE ORDER STATUS (Finite State Machine)
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
    v_payment_status TEXT;
    v_clean_status TEXT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to update order status.';
    END IF;

    SELECT role INTO v_caller_role FROM profiles WHERE id = v_caller_id;

    SELECT status, assigned_rider_id, payment_status
    INTO v_current_status, v_assigned_rider_id, v_payment_status
    FROM orders
    WHERE id = p_order_id;

    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Order % not found.', p_order_id;
    END IF;

    IF v_caller_role <> 'admin' AND (v_assigned_rider_id IS NULL OR v_assigned_rider_id <> v_caller_id) THEN
        RAISE EXCEPTION 'Unauthorized: You are not the assigned rider for order %.', p_order_id;
    END IF;

    v_clean_status := LOWER(TRIM(p_new_status));

    -- Enforce Progression: packed/preparing -> out_for_delivery -> delivered
    IF v_caller_role <> 'admin' THEN
        IF v_current_status IN ('received', 'preparing', 'packed') THEN
            IF v_clean_status <> 'out_for_delivery' THEN
                RAISE EXCEPTION 'Invalid transition: Order in % status can only transition to out_for_delivery.', v_current_status;
            END IF;
        ELSIF v_current_status = 'out_for_delivery' THEN
            IF v_clean_status <> 'delivered' THEN
                RAISE EXCEPTION 'Invalid transition: Order in out_for_delivery status can only transition to delivered.';
            END IF;
        ELSE
            RAISE EXCEPTION 'Invalid transition: Cannot modify order in % status.', v_current_status;
        END IF;
    END IF;

    UPDATE orders
    SET status = v_clean_status,
        payment_status = CASE 
            WHEN v_clean_status = 'delivered' AND payment_status = 'PENDING_COD' THEN 'PAID'
            ELSE payment_status
        END,
        updated_at = NOW()
    WHERE id = p_order_id;

    IF v_clean_status = 'delivered' AND v_assigned_rider_id IS NOT NULL THEN
        UPDATE profiles
        SET deliveries_count = deliveries_count + 1,
            updated_at = NOW()
        WHERE id = v_assigned_rider_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'previous_status', v_current_status,
        'new_status', v_clean_status
    );
END;
$$;

-- ==============================================================================
-- HARDENED RPC 3: SUBMIT ORDER RATING (Explicit Zero-Trust Authorization)
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
    IF p_rating_score IS NULL OR p_rating_score < 1 OR p_rating_score > 5 THEN
        RAISE EXCEPTION 'Rating score must be an integer between 1 and 5.';
    END IF;

    SELECT id, customer_id, guest_token, status, rating_score
    INTO v_order
    FROM orders
    WHERE id = p_order_id;

    IF v_order.id IS NULL THEN
        RAISE EXCEPTION 'Order % not found.', p_order_id;
    END IF;

    IF v_order.status <> 'delivered' THEN
        RAISE EXCEPTION 'Orders can only be rated after delivery is completed.';
    END IF;

    v_caller_id := auth.uid();

    IF v_caller_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM profiles WHERE id = v_caller_id AND role = 'admin'
        ) INTO v_is_admin;
    END IF;

    IF v_caller_id IS NOT NULL AND v_order.customer_id IS NOT NULL AND v_order.customer_id = v_caller_id THEN
        v_is_owner_customer := true;
    END IF;

    IF v_order.customer_id IS NULL AND p_guest_token IS NOT NULL AND TRIM(p_guest_token) <> '' THEN
        IF v_order.guest_token IS NOT NULL AND v_order.guest_token = TRIM(p_guest_token) THEN
            v_is_valid_guest := true;
        END IF;
    END IF;

    IF NOT (v_is_admin OR v_is_owner_customer OR v_is_valid_guest) THEN
        RAISE EXCEPTION 'Unauthorized to rate order.';
    END IF;

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
-- HARDENED RPC 4: GET GUEST ORDER TRACKING (Minimal Sanitized Payload)
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
        cold_chain_fee,
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

    SELECT jsonb_agg(jsonb_build_object(
        'status', osl.new_status,
        'note', osl.note,
        'timestamp', osl.created_at
    ) ORDER BY osl.created_at ASC)
    INTO v_timeline
    FROM order_status_logs osl
    WHERE osl.order_id = v_order.id;

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
        'cold_chain_fee', v_order.cold_chain_fee,
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

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'assigned_rider_id', p_rider_id,
        'rider_name', v_rider_name
    );
END;
$$;

-- ==============================================================================
-- RPC EXECUTE PRIVILEGES CONFIGURATION
-- ==============================================================================
REVOKE ALL ON FUNCTION is_admin FROM PUBLIC;
REVOKE ALL ON FUNCTION create_order FROM PUBLIC;
REVOKE ALL ON FUNCTION create_customer_order FROM PUBLIC;
REVOKE ALL ON FUNCTION rider_update_order_status FROM PUBLIC;
REVOKE ALL ON FUNCTION submit_order_rating FROM PUBLIC;
REVOKE ALL ON FUNCTION get_guest_order_tracking FROM PUBLIC;
REVOKE ALL ON FUNCTION admin_assign_rider FROM PUBLIC;

GRANT EXECUTE ON FUNCTION is_admin TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION create_order TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION create_customer_order TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_guest_order_tracking TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION submit_order_rating TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION rider_update_order_status TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION admin_assign_rider TO authenticated, service_role;

-- ==============================================================================
-- SUPABASE REALTIME CONFIGURATION
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
ALTER PUBLICATION supabase_realtime ADD TABLE fish_products;

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================
