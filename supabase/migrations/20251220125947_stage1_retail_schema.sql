-- Stage 1: Retail Schema Implementation
-- Core retail entities for product catalog, customers, orders, and inventory management

-- Create categories table (hierarchical structure)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  compare_at_price DECIMAL(10,2) CHECK (compare_at_price >= base_price),
  cost_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  track_inventory BOOLEAN DEFAULT true,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER,
  weight_grams INTEGER,
  dimensions JSONB, -- {length: number, width: number, height: number}
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]', -- Array of image URLs with alt text
  variants JSONB DEFAULT '[]', -- Product variants (size, color, etc.)
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table (extending user profiles)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  phone TEXT,
  tax_id TEXT,
  customer_type TEXT DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
  credit_limit DECIMAL(10,2) DEFAULT 0,
  payment_terms TEXT DEFAULT 'net_30',
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{
    "notifications": {"email": true, "sms": false},
    "marketing": false,
    "newsletter": false
  }',
  billing_address JSONB,
  shipping_addresses JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  location TEXT NOT NULL, -- warehouse location identifier
  quantity_available INTEGER NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
  quantity_on_order INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_order >= 0),
  reorder_point INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  expiry_date DATE,
  batch_number TEXT,
  supplier_info JSONB,
  last_counted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE(product_id, location)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_method TEXT,
  payment_reference TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  delivery_date DATE,
  delivery_time_slot TEXT, -- e.g., "9:00-12:00", "14:00-17:00"
  delivery_instructions TEXT,
  customer_notes TEXT,
  internal_notes TEXT,
  ordered_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL, -- Snapshot of product name at order time
  product_sku TEXT, -- Snapshot of SKU at order time
  variant_data JSONB, -- Selected variant options
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers(is_active);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON public.inventory(location);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories (public read, admin write)
CREATE POLICY "Anyone can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for Products (public read for active products, admin write)
CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for Customers (customers see own data, admins see all)
CREATE POLICY "Customers can view their own data"
    ON public.customers FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Customers can update their own data"
    ON public.customers FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all customers"
    ON public.customers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for Inventory (warehouse and admin access)
CREATE POLICY "Warehouse and admins can manage inventory"
    ON public.inventory FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager', 'warehouse')
        )
    );

-- RLS Policies for Orders (customers see own orders, admins see all)
CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all orders"
    ON public.orders FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager', 'warehouse')
        )
    );

-- RLS Policies for Order Items (follow order permissions)
CREATE POLICY "Order items follow order permissions"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE customer_id IN (
                SELECT id FROM public.customers WHERE user_id = auth.uid()
            )
        ) OR EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager', 'warehouse')
        )
    );

CREATE POLICY "Order items can be created with orders"
    ON public.order_items FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id FROM public.orders WHERE customer_id IN (
                SELECT id FROM public.customers WHERE user_id = auth.uid()
            )
        ) OR EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager', 'warehouse')
        )
    );

CREATE POLICY "Admins can manage all order items"
    ON public.order_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.site_buena_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'manager', 'warehouse')
        )
    );

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    -- Generate order number: ORD-YYYYMMDD-XXXX
    SELECT CONCAT('ORD-', TO_CHAR(NOW(), 'YYYYMMDD'), '-', LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0'))
    INTO order_num;

    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to update order totals
CREATE OR REPLACE FUNCTION public.update_order_totals(order_id_param UUID)
RETURNS VOID AS $$
DECLARE
    order_subtotal DECIMAL(10,2) := 0;
    order_tax DECIMAL(10,2) := 0;
    order_discount DECIMAL(10,2) := 0;
BEGIN
    -- Calculate subtotal from order items
    SELECT COALESCE(SUM((unit_price * quantity) - discount_amount), 0)
    INTO order_subtotal
    FROM public.order_items
    WHERE order_id = order_id_param;

    -- Calculate tax (simplified - you may want more complex tax logic)
    SELECT COALESCE(SUM(tax_amount), 0)
    INTO order_tax
    FROM public.order_items
    WHERE order_id = order_id_param;

    -- Update order totals
    UPDATE public.orders
    SET
        subtotal = order_subtotal,
        tax_amount = order_tax,
        total = order_subtotal + tax_amount + shipping_amount - discount_amount,
        updated_at = NOW()
    WHERE id = order_id_param;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update order totals when items change
CREATE OR REPLACE FUNCTION public.trigger_update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update totals for the affected order
    PERFORM public.update_order_totals(
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.order_id
            ELSE NEW.order_id
        END
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_order_items_update_totals
    AFTER INSERT OR UPDATE OR DELETE ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_order_totals();

-- Function to check inventory availability
CREATE OR REPLACE FUNCTION public.check_inventory_availability(product_id_param UUID, quantity_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    available_quantity INTEGER := 0;
BEGIN
    SELECT COALESCE(SUM(quantity_available - quantity_reserved), 0)
    INTO available_quantity
    FROM public.inventory
    WHERE product_id = product_id_param;

    RETURN available_quantity >= quantity_param;
END;
$$ LANGUAGE plpgsql;

-- Insert sample categories
INSERT INTO public.categories (name, description, display_order) VALUES
('Food & Beverages', 'Food items and beverages', 1),
('Groceries', 'Daily grocery items', 2),
('Household', 'Household and cleaning products', 3),
('Personal Care', 'Personal care and hygiene products', 4)
ON CONFLICT DO NOTHING;
