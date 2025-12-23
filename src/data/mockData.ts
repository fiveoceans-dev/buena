// Mock data store for development - replaces database functionality

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  category: string;
  basePrice: number;
  compareAtPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  trackInventory: boolean;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  tags: string[];
  images: string[];
  variants: any[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for catalog display
  rating?: number;
  reviewCount?: number;
  isInStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: any;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: User;
  status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  paymentStatus?: string;
  shippingAddress?: any;
  billingAddress?: any;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  variantData?: any;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  createdAt: string;
}

// Advanced Stage 2 Interfaces

export interface Inventory {
  id: string;
  product_id: string;
  location: string;
  warehouse_name: string;
  aisle: string;
  shelf: string;
  quantity_available: number;
  quantity_reserved: number;
  quantity_on_order: number;
  reorder_point: number | null;
  reorder_quantity: number | null;
  expiry_date: string | null;
  batch_number: string | null;
  supplier_info: Json | null;
  last_counted_at: string | null;
  cost_price: number | null;
  supplier_name: string | null;
  min_stock_level: number;
  max_stock_level: number | null;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  name: string;
  customer_type: 'individual' | 'business' | 'vip' | 'bulk';
  min_quantity: number;
  discount_percentage: number;
  discount_amount: number | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_shipping';
  discount_value: number;
  min_purchase_amount: number | null;
  applicable_products: string[];
  applicable_categories: string[];
  customer_types: string[];
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
  created_at: string;
}

export interface AnalyticsData {
  id: string;
  date: string;
  revenue: number;
  orders_count: number;
  customers_count: number;
  top_products: Array<{product_id: string, name: string, sales: number}>;
  top_customers: Array<{customer_id: string, name: string, spend: number}>;
  category_performance: Array<{category: string, revenue: number, orders: number}>;
  created_at: string;
}

export interface RecurringOrder {
  id: string;
  customer_id: string;
  customer: User;
  template_name: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  next_delivery_date: string;
  items: Array<{
    product_id: string;
    product: Product;
    quantity: number;
    customizations?: any;
  }>;
  delivery_address: any;
  delivery_instructions?: string;
  payment_method: string;
  is_active: boolean;
  last_processed?: string;
  created_at: string;
  updated_at: string;
}

// Stage 3: Enterprise Features Interfaces

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  branding: {
    logo: string;
    favicon: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  features: {
    recurring_orders: boolean;
    advanced_analytics: boolean;
    white_label: boolean;
    api_access: boolean;
    multi_location: boolean;
    custom_integrations: boolean;
  };
  integrations: {
    payment_providers: string[];
    email_service: string;
    sms_service: string;
    shipping_providers: string[];
    pos_systems: string[];
  };
  limits: {
    max_users: number;
    max_products: number;
    max_orders_per_month: number;
    storage_gb: number;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    tax_settings: any;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'square' | 'mock';
  config: {
    api_key?: string;
    webhook_secret?: string;
    test_mode: boolean;
  };
  supported_methods: string[];
  fee_structure: {
    percentage: number;
    fixed_amount: number;
  };
  is_active: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

export interface WebhookConfig {
  id: string;
  tenant_id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  retry_policy: {
    max_attempts: number;
    backoff_multiplier: number;
  };
  created_at: string;
}

export interface APILog {
  id: string;
  tenant_id: string;
  endpoint: string;
  method: string;
  request_body: any;
  response_status: number;
  response_body: any;
  duration_ms: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface PWACache {
  id: string;
  tenant_id: string;
  resource_type: 'product' | 'category' | 'user' | 'order';
  resource_id: string;
  data: any;
  expires_at: string;
  created_at: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@buena.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@buena.com',
    firstName: 'Store',
    lastName: 'Manager',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'warehouse@buena.com',
    firstName: 'Warehouse',
    lastName: 'Staff',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'customer@buena.com',
    firstName: 'John',
    lastName: 'Customer',
    role: 'customer',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    email: 'demo1@buena.com',
    firstName: 'Demo',
    lastName: 'User One',
    role: 'customer',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    email: 'user2@buena.com',
    firstName: 'Demo',
    lastName: 'User Two',
    role: 'customer',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Beverages',
    description: 'Coffee, tea, and other beverages',
    displayOrder: 1,
    isActive: true
  },
  {
    id: '2',
    name: 'Bakery',
    description: 'Fresh baked goods',
    displayOrder: 2,
    isActive: true
  },
  {
    id: '3',
    name: 'Dairy',
    description: 'Milk, cheese, and dairy products',
    displayOrder: 3,
    isActive: true
  },
  {
    id: '4',
    name: 'Meat & Seafood',
    description: 'Fresh meat and seafood',
    displayOrder: 4,
    isActive: true
  },
  {
    id: '5',
    name: 'Produce',
    description: 'Fresh fruits and vegetables',
    displayOrder: 5,
    isActive: true
  },
  {
    id: '6',
    name: 'Pantry',
    description: 'Canned goods and pantry staples',
    displayOrder: 6,
    isActive: true
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Ethiopian Coffee Beans',
    description: 'Single-origin Ethiopian coffee beans with notes of blueberry and chocolate. Carefully roasted to bring out the unique flavor profile of this exceptional coffee.',
    shortDescription: 'Single-origin Ethiopian coffee with blueberry and chocolate notes',
    sku: 'CFB-001',
    category: 'Beverages',
    basePrice: 24.99,
    compareAtPrice: 29.99,
    isActive: true,
    isFeatured: true,
    trackInventory: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    tags: ['organic', 'fair-trade', 'single-origin'],
    images: ['/placeholder.svg'],
    variants: [],
    seoTitle: 'Premium Ethiopian Coffee Beans - Buena Retailing',
    seoDescription: 'Buy authentic Ethiopian coffee beans with blueberry and chocolate notes. Fresh roasted and fair trade certified.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    rating: 4.8,
    reviewCount: 127,
    isInStock: true
  },
  {
    id: '2',
    name: 'Organic Green Tea Leaves',
    description: 'Premium organic green tea leaves with antioxidant properties. Sourced from sustainable farms and packaged fresh.',
    shortDescription: 'Premium organic green tea leaves with antioxidants',
    sku: 'TEA-002',
    category: 'Beverages',
    basePrice: 12.99,
    isActive: true,
    isFeatured: false,
    trackInventory: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    tags: ['organic', 'caffeine-free', 'antioxidants'],
    images: ['/placeholder.svg'],
    variants: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    rating: 4.6,
    reviewCount: 89,
    isInStock: true
  },
  {
    id: '3',
    name: 'Artisan Sourdough Bread',
    description: 'Handcrafted sourdough bread made with organic flour and natural starters. Baked fresh daily in our artisan bakery.',
    shortDescription: 'Handcrafted sourdough bread with organic ingredients',
    sku: 'BRD-003',
    category: 'Bakery',
    basePrice: 8.99,
    isActive: true,
    isFeatured: true,
    trackInventory: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    tags: ['artisan', 'fresh', 'organic'],
    images: ['/placeholder.svg'],
    variants: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    rating: 4.9,
    reviewCount: 203,
    isInStock: false
  },
  {
    id: '4',
    name: 'Grass-Fed Beef Ribeye Steak',
    description: 'Premium grass-fed beef ribeye steak, aged for 21 days for maximum flavor. Sourced from local sustainable farms.',
    shortDescription: 'Premium grass-fed beef ribeye steak, aged 21 days',
    sku: 'BEEF-004',
    category: 'Meat & Seafood',
    basePrice: 32.99,
    isActive: true,
    isFeatured: false,
    trackInventory: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    tags: ['grass-fed', 'premium', 'aged'],
    images: ['/placeholder.svg'],
    variants: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    rating: 4.7,
    reviewCount: 156,
    isInStock: true
  },
  {
    id: '5',
    name: 'Organic Free-Range Eggs',
    description: 'Dozen organic free-range eggs from pasture-raised hens. No hormones or antibiotics used.',
    shortDescription: 'Organic free-range eggs from pasture-raised hens',
    sku: 'EGGS-005',
    category: 'Dairy',
    basePrice: 7.99,
    isActive: true,
    isFeatured: false,
    trackInventory: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    tags: ['organic', 'free-range', 'pasture-raised'],
    images: ['/placeholder.svg'],
    variants: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    rating: 4.5,
    reviewCount: 78,
    isInStock: true
  },
  {
    id: '6',
    name: 'Seasonal Mixed Vegetables',
    description: 'Fresh seasonal mixed vegetables from local organic farms. Includes carrots, broccoli, cauliflower, and more.',
    shortDescription: 'Fresh seasonal mixed vegetables from local organic farms',
    sku: 'VEG-006',
    category: 'Produce',
    basePrice: 18.99,
    isActive: true,
    isFeatured: false,
    trackInventory: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    tags: ['seasonal', 'local', 'organic'],
    images: ['/placeholder.svg'],
    variants: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    rating: 4.4,
    reviewCount: 92,
    isInStock: true
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20240115-0001',
    customerId: '4',
    customer: mockUsers[3], // customer user
    status: 'confirmed',
    subtotal: 125.99,
    taxAmount: 10.08,
    discountAmount: 0,
    shippingAmount: 5.99,
    total: 141.06,
    currency: 'USD',
    paymentStatus: 'paid',
    items: [
      {
        id: '1',
        orderId: '1',
        productId: '1',
        productName: 'Premium Ethiopian Coffee Beans',
        productSku: 'CFB-001',
        unitPrice: 24.99,
        quantity: 2,
        discountAmount: 0,
        taxAmount: 4.00,
        total: 49.98,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        orderId: '1',
        productId: '5',
        productName: 'Organic Free-Range Eggs',
        productSku: 'EGGS-005',
        unitPrice: 7.99,
        quantity: 1,
        discountAmount: 0,
        taxAmount: 0.64,
        total: 7.99,
        createdAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

// Mock Inventory
export const mockInventory: Inventory[] = [
  {
    id: '1',
    product_id: '1',
    location: 'WH-001-A1-S3',
    warehouse_name: 'Main Warehouse',
    aisle: 'A1',
    shelf: 'S3',
    quantity_available: 45,
    quantity_reserved: 5,
    quantity_on_order: 20,
    reorder_point: 20,
    reorder_quantity: 50,
    expiry_date: null,
    batch_number: 'CFB-2024-001',
    supplier_info: { supplier_id: 'SUP-001', supplier_name: 'Ethiopian Coffee Co.' },
    last_counted_at: '2024-01-10T09:00:00Z',
    cost_price: 15.99,
    supplier_name: 'Ethiopian Coffee Co.',
    min_stock_level: 10,
    max_stock_level: 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  {
    id: '2',
    product_id: '2',
    location: 'WH-001-B2-S1',
    warehouse_name: 'Main Warehouse',
    aisle: 'B2',
    shelf: 'S1',
    quantity_available: 28,
    quantity_reserved: 2,
    quantity_on_order: 0,
    reorder_point: 15,
    reorder_quantity: 30,
    expiry_date: '2024-06-15T00:00:00Z',
    batch_number: 'TEA-2024-002',
    supplier_info: { supplier_id: 'SUP-002', supplier_name: 'Green Tea Farms' },
    last_counted_at: '2024-01-08T14:30:00Z',
    cost_price: 8.99,
    supplier_name: 'Green Tea Farms',
    min_stock_level: 5,
    max_stock_level: 50,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-08T14:30:00Z'
  },
  {
    id: '3',
    product_id: '3',
    location: 'WH-001-C1-S2',
    warehouse_name: 'Main Warehouse',
    aisle: 'C1',
    shelf: 'S2',
    quantity_available: 0,
    quantity_reserved: 0,
    quantity_on_order: 25,
    reorder_point: 8,
    reorder_quantity: 20,
    expiry_date: null,
    batch_number: 'BRD-2024-003',
    supplier_info: { supplier_id: 'SUP-003', supplier_name: 'Artisan Bakery' },
    last_counted_at: '2024-01-12T11:15:00Z',
    cost_price: 4.99,
    supplier_name: 'Artisan Bakery',
    min_stock_level: 3,
    max_stock_level: 25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-12T11:15:00Z'
  }
];

// Mock Pricing Tiers
export const mockPricingTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Business Bulk Discount',
    customer_type: 'business',
    min_quantity: 10,
    discount_percentage: 10,
    discount_amount: null,
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'VIP Member Pricing',
    customer_type: 'vip',
    min_quantity: 1,
    discount_percentage: 15,
    discount_amount: null,
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Bulk Purchase Deal',
    customer_type: 'bulk',
    min_quantity: 25,
    discount_percentage: 20,
    discount_amount: null,
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: '2024-12-31T23:59:59Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Promotions
export const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'New Year Coffee Special',
    description: '20% off all coffee products for the first month of the year',
    type: 'percentage',
    discount_value: 20,
    min_purchase_amount: null,
    applicable_products: ['1'], // Premium Ethiopian Coffee
    applicable_categories: ['Beverages'],
    customer_types: ['individual', 'business'],
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: '2024-01-31T23:59:59Z',
    is_active: true,
    usage_limit: 100,
    usage_count: 23,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Free Shipping Over $50',
    description: 'Free shipping on orders over $50',
    type: 'free_shipping',
    discount_value: 0,
    min_purchase_amount: 50,
    applicable_products: [],
    applicable_categories: [],
    customer_types: ['individual', 'business', 'vip'],
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: null,
    is_active: true,
    usage_limit: null,
    usage_count: 145,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Buy 2 Get 1 Free - Eggs',
    description: 'Buy 2 dozen eggs, get 1 free',
    type: 'buy_x_get_y',
    discount_value: 1,
    min_purchase_amount: null,
    applicable_products: ['5'], // Organic Free-Range Eggs
    applicable_categories: [],
    customer_types: ['individual', 'business'],
    valid_from: '2024-01-15T00:00:00Z',
    valid_until: '2024-02-15T23:59:59Z',
    is_active: true,
    usage_limit: 50,
    usage_count: 12,
    created_at: '2024-01-15T00:00:00Z'
  }
];

// Mock Analytics Data
export const mockAnalytics: AnalyticsData[] = [
  {
    id: '1',
    date: '2024-01-01',
    revenue: 2850.50,
    orders_count: 23,
    customers_count: 18,
    top_products: [
      { product_id: '1', name: 'Premium Ethiopian Coffee Beans', sales: 8 },
      { product_id: '2', name: 'Organic Green Tea Leaves', sales: 6 },
      { product_id: '5', name: 'Organic Free-Range Eggs', sales: 5 }
    ],
    top_customers: [
      { customer_id: '4', name: 'John Customer', spend: 450.25 },
      { customer_id: '5', name: 'Demo User One', spend: 320.80 },
      { customer_id: '6', name: 'Demo User Two', spend: 285.60 }
    ],
    category_performance: [
      { category: 'Beverages', revenue: 1450.25, orders: 12 },
      { category: 'Dairy', revenue: 890.75, orders: 6 },
      { category: 'Bakery', revenue: 509.50, orders: 5 }
    ],
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-02',
    revenue: 3120.75,
    orders_count: 28,
    customers_count: 22,
    top_products: [
      { product_id: '1', name: 'Premium Ethiopian Coffee Beans', sales: 10 },
      { product_id: '5', name: 'Organic Free-Range Eggs', sales: 7 },
      { product_id: '4', name: 'Grass-Fed Beef Ribeye Steak', sales: 4 }
    ],
    top_customers: [
      { customer_id: '4', name: 'John Customer', spend: 520.25 },
      { customer_id: '5', name: 'Demo User One', spend: 420.80 },
      { customer_id: '6', name: 'Demo User Two', spend: 385.60 }
    ],
    category_performance: [
      { category: 'Beverages', revenue: 1650.25, orders: 15 },
      { category: 'Meat & Seafood', revenue: 1200.75, orders: 8 },
      { category: 'Dairy', revenue: 269.75, orders: 5 }
    ],
    created_at: '2024-01-03T00:00:00Z'
  }
];

// Mock Recurring Orders
export const mockRecurringOrders: RecurringOrder[] = [
  {
    id: '1',
    customer_id: '4',
    customer: mockUsers[3],
    template_name: 'Weekly Coffee & Eggs',
    frequency: 'weekly',
    next_delivery_date: '2024-01-22T00:00:00Z',
    items: [
      {
        product_id: '1',
        product: mockProducts[0],
        quantity: 1
      },
      {
        product_id: '5',
        product: mockProducts[4],
        quantity: 2
      }
    ],
    delivery_address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    delivery_instructions: 'Leave at front door',
    payment_method: 'Credit Card ****1234',
    is_active: true,
    last_processed: '2024-01-15T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
];

// Stage 3: Enterprise Mock Data

export const mockTenants: TenantConfig[] = [
  {
    id: '1',
    name: 'Buena Default',
    domain: 'buena.app',
    branding: {
      logo: '/logo.svg',
      favicon: '/favicon.ico',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        foreground: '#1f2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    },
    features: {
      recurring_orders: true,
      advanced_analytics: true,
      white_label: true,
      api_access: true,
      multi_location: true,
      custom_integrations: true
    },
    integrations: {
      payment_providers: ['stripe', 'paypal'],
      email_service: 'sendgrid',
      sms_service: 'twilio',
      shipping_providers: ['fedex', 'ups'],
      pos_systems: ['square', 'clover']
    },
    limits: {
      max_users: 100,
      max_products: 10000,
      max_orders_per_month: 10000,
      storage_gb: 100
    },
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en',
      tax_settings: {
        default_rate: 0.08,
        tax_inclusive: false
      }
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockPaymentProviders: PaymentProvider[] = [
  {
    id: '1',
    name: 'Stripe',
    type: 'stripe',
    config: {
      test_mode: true
    },
    supported_methods: ['card', 'apple_pay', 'google_pay'],
    fee_structure: {
      percentage: 0.029,
      fixed_amount: 0.30
    },
    is_active: true
  },
  {
    id: '2',
    name: 'PayPal',
    type: 'paypal',
    config: {
      test_mode: true
    },
    supported_methods: ['paypal', 'card'],
    fee_structure: {
      percentage: 0.034,
      fixed_amount: 0.49
    },
    is_active: true
  }
];

export const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Order Confirmation',
    type: 'email',
    subject: 'Order Confirmation - Order #{{order_number}}',
    content: `
      <h1>Thank you for your order!</h1>
      <p>Dear {{customer_name}},</p>
      <p>Your order #{{order_number}} has been received and is being processed.</p>
      <p>Order Details:</p>
      <p>{{items}}</p>
      <p>Total: {{total}}</p>
      <p>We'll send you another email when your order ships.</p>
    `,
    variables: ['customer_name', 'order_number', 'items', 'total'],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Order Shipped',
    type: 'email',
    subject: 'Your order has shipped! - Order #{{order_number}}',
    content: `
      <h1>Your order is on the way!</h1>
      <p>Dear {{customer_name}},</p>
      <p>Great news! Your order #{{order_number}} has been shipped.</p>
      <p>Tracking Number: {{tracking_number}}</p>
      <p>Expected Delivery: {{delivery_date}}</p>
    `,
    variables: ['customer_name', 'order_number', 'tracking_number', 'delivery_date'],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Order Delivered',
    type: 'sms',
    content: 'Hi {{customer_name}}! Your order #{{order_number}} has been delivered. Thank you for shopping with us!',
    variables: ['customer_name', 'order_number'],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockWebhooks: WebhookConfig[] = [
  {
    id: '1',
    tenant_id: '1',
    url: 'https://api.example.com/webhooks/buena',
    events: ['order.created', 'order.updated', 'inventory.low_stock'],
    secret: 'whsec_test_secret_key',
    is_active: true,
    retry_policy: {
      max_attempts: 3,
      backoff_multiplier: 2
    },
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Helper functions for data management
export class MockDatabase {
  private static instance: MockDatabase;
  private data: {
    users: User[];
    products: Product[];
    categories: Category[];
    orders: Order[];
    carts: Cart[];
    inventory: Inventory[];
    pricingTiers: PricingTier[];
    promotions: Promotion[];
    analytics: AnalyticsData[];
    recurringOrders: RecurringOrder[];
    tenants: TenantConfig[];
    paymentProviders: PaymentProvider[];
    notificationTemplates: NotificationTemplate[];
    webhooks: WebhookConfig[];
    apiLogs: APILog[];
    pwaCache: PWACache[];
  };

  private constructor() {
    this.data = {
      users: [...mockUsers],
      products: [...mockProducts],
      categories: [...mockCategories],
      orders: [...mockOrders],
      carts: [],
    inventory: [...mockInventory],
    pricingTiers: [...mockPricingTiers],
    promotions: [...mockPromotions],
    analytics: [...mockAnalytics],
    recurringOrders: [...mockRecurringOrders],
    tenants: [...mockTenants],
    paymentProviders: [...mockPaymentProviders],
    notificationTemplates: [...mockNotificationTemplates],
    webhooks: [...mockWebhooks],
    apiLogs: [],
    pwaCache: []
    };
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email === email);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    return newUser;
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.data.products.filter(p => p.category === category && p.isActive);
  }

  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.data.products.filter(p =>
      p.isActive && (
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.data.products.splice(index, 1);
    return true;
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories;
  }

  // Inventory
  getInventory(): Inventory[] {
    return this.data.inventory;
  }

  getInventoryByProduct(productId: string): Inventory[] {
    return this.data.inventory.filter(item => item.product_id === productId);
  }

  getLowStockItems(): Inventory[] {
    return this.data.inventory.filter(item =>
      item.quantity_available <= item.min_stock_level
    );
  }

  updateInventoryQuantity(inventoryId: string, quantity: number): Inventory | null {
    const index = this.data.inventory.findIndex(item => item.id === inventoryId);
    if (index === -1) return null;

    this.data.inventory[index].quantity_available = quantity;
    this.data.inventory[index].updated_at = new Date().toISOString();
    return this.data.inventory[index];
  }

  // Pricing Tiers
  getPricingTiers(): PricingTier[] {
    return this.data.pricingTiers.filter(tier => tier.is_active);
  }

  getPricingTierForCustomer(customerType: string, quantity: number): PricingTier | null {
    return this.data.pricingTiers
      .filter(tier =>
        tier.is_active &&
        tier.customer_type === customerType &&
        quantity >= tier.min_quantity
      )
      .sort((a, b) => b.discount_percentage - a.discount_percentage)[0] || null;
  }

  // Promotions
  getPromotions(): Promotion[] {
    return this.data.promotions.filter(promo => promo.is_active);
  }

  getActivePromotionsForProduct(productId: string, category: string): Promotion[] {
    const now = new Date().toISOString();
    return this.data.promotions.filter(promo =>
      promo.is_active &&
      new Date(promo.valid_from) <= new Date(now) &&
      (!promo.valid_until || new Date(promo.valid_until) >= new Date(now)) &&
      (promo.applicable_products.includes(productId) ||
       promo.applicable_categories.includes(category))
    );
  }

  // Analytics
  getAnalytics(): AnalyticsData[] {
    return this.data.analytics;
  }

  getAnalyticsForDateRange(startDate: string, endDate: string): AnalyticsData[] {
    return this.data.analytics.filter(data =>
      data.date >= startDate && data.date <= endDate
    );
  }

  addAnalyticsData(data: Omit<AnalyticsData, 'id' | 'created_at'>): AnalyticsData {
    const newData: AnalyticsData = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.data.analytics.push(newData);
    return newData;
  }

  // Recurring Orders
  getRecurringOrders(): RecurringOrder[] {
    return this.data.recurringOrders;
  }

  getRecurringOrdersByCustomer(customerId: string): RecurringOrder[] {
    return this.data.recurringOrders.filter(order =>
      order.customer_id === customerId && order.is_active
    );
  }

  createRecurringOrder(order: Omit<RecurringOrder, 'id' | 'created_at' | 'updated_at'>): RecurringOrder {
    const newOrder: RecurringOrder = {
      ...order,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.recurringOrders.push(newOrder);
    return newOrder;
  }

  // Advanced pricing calculation
  calculatePriceWithDiscounts(productId: string, quantity: number, customerType: string = 'individual'): {
    originalPrice: number;
    finalPrice: number;
    discounts: Array<{type: string, amount: number, description: string}>;
  } {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const originalPrice = product.basePrice * quantity;
    let finalPrice = originalPrice;
    const discounts: Array<{type: string, amount: number, description: string}> = [];

    // Apply pricing tier discounts
    const pricingTier = this.getPricingTierForCustomer(customerType, quantity);
    if (pricingTier) {
      const discountAmount = (originalPrice * pricingTier.discount_percentage) / 100;
      finalPrice -= discountAmount;
      discounts.push({
        type: 'tier',
        amount: discountAmount,
        description: `${pricingTier.name} (${pricingTier.discount_percentage}% off)`
      });
    }

    // Apply promotional discounts
    const promotions = this.getActivePromotionsForProduct(productId, product.category);
    promotions.forEach(promo => {
      let discountAmount = 0;
      switch (promo.type) {
        case 'percentage':
          discountAmount = (finalPrice * promo.discount_value) / 100;
          break;
        case 'fixed':
          discountAmount = Math.min(promo.discount_value, finalPrice);
          break;
        // Add more promotion types as needed
      }

      if (discountAmount > 0) {
        finalPrice -= discountAmount;
        discounts.push({
          type: 'promotion',
          amount: discountAmount,
          description: promo.name
        });
      }
    });

    return {
      originalPrice,
      finalPrice: Math.max(0, finalPrice),
      discounts
    };
  }

  // Tenant Management
  getTenants(): TenantConfig[] {
    return this.data.tenants;
  }

  getTenantById(id: string): TenantConfig | undefined {
    return this.data.tenants.find(t => t.id === id);
  }

  getCurrentTenant(): TenantConfig {
    // For now, return the default tenant
    return this.data.tenants[0] || {
      id: 'default',
      name: 'Buena Default',
      domain: window.location.hostname,
      branding: {
        logo: '/logo.svg',
        favicon: '/favicon.ico',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          foreground: '#1f2937'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      },
      features: {
        recurring_orders: true,
        advanced_analytics: true,
        white_label: false,
        api_access: false,
        multi_location: false,
        custom_integrations: false
      },
      integrations: {
        payment_providers: [],
        email_service: '',
        sms_service: '',
        shipping_providers: [],
        pos_systems: []
      },
      limits: {
        max_users: 10,
        max_products: 100,
        max_orders_per_month: 100,
        storage_gb: 1
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en',
        tax_settings: { default_rate: 0.08, tax_inclusive: false }
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Payment Processing
  getPaymentProviders(): PaymentProvider[] {
    return this.data.paymentProviders.filter(p => p.is_active);
  }

  processPayment(orderId: string, amount: number, method: string): Promise<{success: boolean, transaction_id?: string, error?: string}> {
    return new Promise((resolve) => {
      // Simulate payment processing delay
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for demo
        if (success) {
          resolve({
            success: true,
            transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });
        } else {
          resolve({
            success: false,
            error: 'Payment declined by issuer'
          });
        }
      }, 2000);
    });
  }

  // Notification System
  getNotificationTemplates(): NotificationTemplate[] {
    return this.data.notificationTemplates.filter(t => t.is_active);
  }

  sendNotification(type: 'email' | 'sms' | 'push', templateId: string, recipient: string, variables: Record<string, any>): Promise<{success: boolean, message_id?: string}> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending ${type} notification to ${recipient} using template ${templateId}:`, variables);
        resolve({
          success: true,
          message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      }, 500);
    });
  }

  // Webhook System
  getWebhooks(): WebhookConfig[] {
    return this.data.webhooks.filter(w => w.is_active);
  }

  triggerWebhook(event: string, data: any): Promise<{success: boolean, responses: any[]}> {
    return new Promise((resolve) => {
      const activeWebhooks = this.data.webhooks.filter(w =>
        w.is_active && w.events.includes(event)
      );

      const responses = activeWebhooks.map(async (webhook) => {
        try {
          // In a real implementation, this would make an HTTP request
          console.log(`Triggering webhook ${webhook.url} for event ${event}:`, data);
          return { webhook_id: webhook.id, success: true };
        } catch (error) {
          return { webhook_id: webhook.id, success: false, error: error.message };
        }
      });

      setTimeout(() => {
        resolve({
          success: true,
          responses: responses.map(r => ({ webhook_id: r.webhook_id || 'unknown', success: true }))
        });
      }, 100);
    });
  }

  // API Logging
  logAPIRequest(log: Omit<APILog, 'id' | 'created_at'>): void {
    const apiLog: APILog = {
      ...log,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.data.apiLogs.push(apiLog);
  }

  getAPILogs(limit: number = 100): APILog[] {
    return this.data.apiLogs.slice(-limit);
  }

  // PWA Cache Management
  cacheResource(resource: Omit<PWACache, 'id' | 'created_at'>): void {
    // Remove existing cache for this resource
    this.data.pwaCache = this.data.pwaCache.filter(c =>
      !(c.resource_type === resource.resource_type && c.resource_id === resource.resource_id)
    );

    const cacheEntry: PWACache = {
      ...resource,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    this.data.pwaCache.push(cacheEntry);
  }

  getCachedResource(resourceType: string, resourceId: string): PWACache | null {
    const cached = this.data.pwaCache.find(c =>
      c.resource_type === resourceType &&
      c.resource_id === resourceId &&
      new Date(c.expires_at) > new Date()
    );
    return cached || null;
  }

  clearExpiredCache(): number {
    const beforeCount = this.data.pwaCache.length;
    this.data.pwaCache = this.data.pwaCache.filter(c => new Date(c.expires_at) > new Date());
    return beforeCount - this.data.pwaCache.length;
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.data.orders.filter(o => o.customerId === customerId);
  }

  createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(this.data.orders.length + 1).padStart(4, '0')}`;
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.orders.push(newOrder);
    return newOrder;
  }

  // Carts
  getCart(userId?: string): Cart | null {
    return this.data.carts.find(c => c.userId === userId) || null;
  }

  createOrUpdateCart(cart: Cart): Cart {
    const existingIndex = this.data.carts.findIndex(c => c.id === cart.id);
    if (existingIndex >= 0) {
      this.data.carts[existingIndex] = { ...cart, updatedAt: new Date().toISOString() };
      return this.data.carts[existingIndex];
    } else {
      const newCart = { ...cart, updatedAt: new Date().toISOString() };
      this.data.carts.push(newCart);
      return newCart;
    }
  }

  clearCart(cartId: string): boolean {
    const index = this.data.carts.findIndex(c => c.id === cartId);
    if (index >= 0) {
      this.data.carts.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const mockDb = MockDatabase.getInstance();
