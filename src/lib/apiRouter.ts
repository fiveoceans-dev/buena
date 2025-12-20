import { mockDb } from '@/data/mockData';
import { mockUsers, mockProducts, mockCategories, mockOrders } from '@/data/mockData';
import { AUTH_DISABLED } from '@/lib/auth';

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}

export interface APIResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
}

class APIRouter {
  private routes: Map<string, Map<string, (req: APIRequest) => Promise<APIResponse>>> = new Map();

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    // Products API
    this.addRoute('GET', '/api/products', this.getProducts.bind(this));
    this.addRoute('GET', '/api/products/:id', this.getProduct.bind(this));
    this.addRoute('POST', '/api/products', this.createProduct.bind(this));
    this.addRoute('PUT', '/api/products/:id', this.updateProduct.bind(this));
    this.addRoute('DELETE', '/api/products/:id', this.deleteProduct.bind(this));

    // Categories API
    this.addRoute('GET', '/api/categories', this.getCategories.bind(this));
    this.addRoute('GET', '/api/categories/:id', this.getCategory.bind(this));

    // Orders API
    this.addRoute('GET', '/api/orders', this.getOrders.bind(this));
    this.addRoute('GET', '/api/orders/:id', this.getOrder.bind(this));
    this.addRoute('POST', '/api/orders', this.createOrder.bind(this));
    this.addRoute('PUT', '/api/orders/:id', this.updateOrder.bind(this));

    // Customers API
    this.addRoute('GET', '/api/customers', this.getCustomers.bind(this));
    this.addRoute('GET', '/api/customers/:id', this.getCustomer.bind(this));
    this.addRoute('PUT', '/api/customers/:id', this.updateCustomer.bind(this));

    // Inventory API
    this.addRoute('GET', '/api/inventory', this.getInventory.bind(this));
    this.addRoute('PUT', '/api/inventory/:id', this.updateInventory.bind(this));

    // Analytics API
    this.addRoute('GET', '/api/analytics/summary', this.getAnalyticsSummary.bind(this));
    this.addRoute('GET', '/api/analytics/products', this.getProductAnalytics.bind(this));
    this.addRoute('GET', '/api/analytics/customers', this.getCustomerAnalytics.bind(this));

    // Webhooks API
    this.addRoute('POST', '/api/webhooks/:id', this.handleWebhook.bind(this));
    this.addRoute('GET', '/api/webhooks', this.getWebhooks.bind(this));

    // Health check
    this.addRoute('GET', '/api/health', this.healthCheck.bind(this));
  }

  private addRoute(method: string, path: string, handler: (req: APIRequest) => Promise<APIResponse>) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }
    this.routes.get(method)!.set(path, handler);
  }

  async handleRequest(request: APIRequest): Promise<APIResponse> {
    try {
      // Parse path parameters
      const parsedPath = this.parsePath(request.path);
      request.path = parsedPath.path;

      // Check authentication (simplified)
      if (!this.isAuthenticated(request)) {
        return {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          body: { error: 'Unauthorized' }
        };
      }

      // Find route handler
      const methodRoutes = this.routes.get(request.method);
      if (!methodRoutes) {
        return this.notFound();
      }

      // Try exact match first
      let handler = methodRoutes.get(request.path);

      // Try parameterized routes
      if (!handler) {
        for (const [routePath, routeHandler] of methodRoutes.entries()) {
          if (this.matchRoute(routePath, request.path, parsedPath.params)) {
            handler = routeHandler;
            break;
          }
        }
      }

      if (!handler) {
        return this.notFound();
      }

      // Add path parameters to request
      (request as any).params = parsedPath.params;

      // Call handler
      const response = await handler(request);

      // Log API request
      mockDb.logAPIRequest({
        tenant_id: '1',
        endpoint: request.path,
        method: request.method,
        request_body: request.body,
        response_status: response.status,
        response_body: typeof response.body === 'object' ? JSON.stringify(response.body) : response.body,
        duration_ms: 50 + Math.random() * 200, // Simulate response time
        ip_address: '127.0.0.1', // Mock IP
        user_agent: request.headers['user-agent'] || 'API Client'
      });

      return response;

    } catch (error) {
      console.error('API Error:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Internal server error' }
      };
    }
  }

  private parsePath(path: string): { path: string; params: Record<string, string> } {
    const params: Record<string, string> = {};
    let parsedPath = path;

    // Extract path parameters (e.g., /api/products/:id)
    const paramRegex = /:([^\/]+)/g;
    let match;

    while ((match = paramRegex.exec(path)) !== null) {
      const paramName = match[1];
      // For demo, we'll use a simple replacement
      // In a real implementation, you'd parse the actual path segments
      params[paramName] = 'parsed-from-url';
    }

    return { path: parsedPath, params };
  }

  private matchRoute(routePath: string, requestPath: string, params: Record<string, string>): boolean {
    // Simple route matching for parameterized routes
    if (routePath.includes(':id') && requestPath.match(/\/api\/[^\/]+\/\d+$/)) {
      const pathParts = requestPath.split('/');
      const id = pathParts[pathParts.length - 1];
      params.id = id;
      return true;
    }
    return false;
  }

  private isAuthenticated(request: APIRequest): boolean {
    if (AUTH_DISABLED) {
      return true;
    }

    // Check for API key in headers
    const apiKey = request.headers['x-api-key'] || request.headers['authorization'];

    // For demo, accept any API key or allow if no auth required
    return !!apiKey || request.path === '/api/health';
  }

  private notFound(): APIResponse {
    return {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'Not found' }
    };
  }

  // API Handlers

  private async getProducts(request: APIRequest): Promise<APIResponse> {
    const { search, category, limit = '50', offset = '0' } = request.query || {};

    let products = mockDb.getProducts();

    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        data: paginatedProducts,
        pagination: {
          total: products.length,
          limit: parseInt(limit),
          offset: startIndex,
          has_more: endIndex < products.length
        }
      }
    };
  }

  private async getProduct(request: APIRequest): Promise<APIResponse> {
    const productId = (request as any).params?.id;
    const product = mockDb.getProductById(productId);

    if (!product) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Product not found' }
      };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: product }
    };
  }

  private async createProduct(request: APIRequest): Promise<APIResponse> {
    const productData = request.body;

    if (!productData.name || !productData.basePrice) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Name and base price are required' }
      };
    }

    const product = mockDb.createProduct({
      ...productData,
      isActive: productData.isActive ?? true,
      isFeatured: productData.isFeatured ?? false,
      trackInventory: productData.trackInventory ?? true,
      minOrderQuantity: productData.minOrderQuantity ?? 1,
      tags: productData.tags ?? [],
      images: productData.images ?? [],
      variants: productData.variants ?? []
    });

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: { data: product }
    };
  }

  private async updateProduct(request: APIRequest): Promise<APIResponse> {
    const productId = (request as any).params?.id;
    const updates = request.body;

    const product = mockDb.updateProduct(productId, updates);

    if (!product) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Product not found' }
      };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: product }
    };
  }

  private async deleteProduct(request: APIRequest): Promise<APIResponse> {
    const productId = (request as any).params?.id;
    const success = mockDb.deleteProduct(productId);

    if (!success) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Product not found' }
      };
    }

    return {
      status: 204,
      headers: {},
      body: null
    };
  }

  private async getCategories(request: APIRequest): Promise<APIResponse> {
    const categories = mockDb.getCategories();

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: categories }
    };
  }

  private async getCategory(request: APIRequest): Promise<APIResponse> {
    const categoryId = (request as any).params?.id;
    const categories = mockDb.getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Category not found' }
      };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: category }
    };
  }

  private async getOrders(request: APIRequest): Promise<APIResponse> {
    const { customer_id, status, limit = '50', offset = '0' } = request.query || {};
    let orders = mockDb.getOrders();

    if (customer_id) {
      orders = orders.filter(o => o.customerId === customer_id);
    }

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        data: paginatedOrders,
        pagination: {
          total: orders.length,
          limit: parseInt(limit),
          offset: startIndex,
          has_more: endIndex < orders.length
        }
      }
    };
  }

  private async getOrder(request: APIRequest): Promise<APIResponse> {
    const orderId = (request as any).params?.id;
    const order = mockDb.getOrderById(orderId);

    if (!order) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Order not found' }
      };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: order }
    };
  }

  private async createOrder(request: APIRequest): Promise<APIResponse> {
    const orderData = request.body;

    if (!orderData.customerId || !orderData.items) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Customer ID and items are required' }
      };
    }

    const order = mockDb.createOrder({
      ...orderData,
      status: orderData.status || 'pending'
    });

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: { data: order }
    };
  }

  private async updateOrder(request: APIRequest): Promise<APIResponse> {
    const orderId = (request as any).params?.id;
    const updates = request.body;

    const order = mockDb.getOrderById(orderId);
    if (!order) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Order not found' }
      };
    }

    const updatedOrder = { ...order, ...updates, updatedAt: new Date().toISOString() };

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: updatedOrder }
    };
  }

  private async getCustomers(request: APIRequest): Promise<APIResponse> {
    const customers = mockDb.getUsers().filter(u => u.role === 'customer');

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: customers }
    };
  }

  private async getCustomer(request: APIRequest): Promise<APIResponse> {
    const customerId = (request as any).params?.id;
    const customer = mockDb.getUserById(customerId);

    if (!customer || customer.role !== 'customer') {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Customer not found' }
      };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: customer }
    };
  }

  private async updateCustomer(request: APIRequest): Promise<APIResponse> {
    const customerId = (request as any).params?.id;
    const updates = request.body;

    const customer = mockDb.getUserById(customerId);
    if (!customer) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'Customer not found' }
      };
    }

    // In a real implementation, this would update the customer
    const updatedCustomer = { ...customer, ...updates };

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: updatedCustomer }
    };
  }

  private async getInventory(request: APIRequest): Promise<APIResponse> {
    const inventory = mockDb.getInventory();

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: inventory }
    };
  }

  private async updateInventory(request: APIRequest): Promise<APIResponse> {
    const inventoryId = (request as any).params?.id;
    const updates = request.body;

    if (updates.quantity_available !== undefined) {
      mockDb.updateInventoryQuantity(inventoryId, updates.quantity_available);
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: { success: true } }
    };
  }

  private async getAnalyticsSummary(request: APIRequest): Promise<APIResponse> {
    const analytics = mockDb.getAnalytics();
    const totalRevenue = analytics.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = analytics.reduce((sum, day) => sum + day.orders_count, 0);
    const totalCustomers = analytics.reduce((sum, day) => sum + day.customers_count, 0);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        data: {
          total_revenue: totalRevenue,
          total_orders: totalOrders,
          total_customers: totalCustomers,
          avg_order_value: totalRevenue / totalOrders,
          period_days: analytics.length
        }
      }
    };
  }

  private async getProductAnalytics(request: APIRequest): Promise<APIResponse> {
    const analytics = mockDb.getAnalytics();
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>();

    analytics.forEach(day => {
      day.top_products.forEach(product => {
        const existing = productSales.get(product.product_id);
        if (existing) {
          existing.sales += product.sales;
        } else {
          productSales.set(product.product_id, {
            name: product.name,
            sales: product.sales,
            revenue: 0 // Would calculate from product price in real implementation
          });
        }
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: topProducts }
    };
  }

  private async getCustomerAnalytics(request: APIRequest): Promise<APIResponse> {
    const analytics = mockDb.getAnalytics();
    const customerSpend = new Map<string, { name: string; spend: number; orders: number }>();

    analytics.forEach(day => {
      day.top_customers.forEach(customer => {
        const existing = customerSpend.get(customer.customer_id);
        if (existing) {
          existing.spend += customer.spend;
          existing.orders += 1;
        } else {
          customerSpend.set(customer.customer_id, {
            name: customer.name,
            spend: customer.spend,
            orders: 1
          });
        }
      });
    });

    const topCustomers = Array.from(customerSpend.values())
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: topCustomers }
    };
  }

  private async handleWebhook(request: APIRequest): Promise<APIResponse> {
    const webhookId = (request as any).params?.id;
    const eventData = request.body;

    // Trigger webhook processing
    mockDb.triggerWebhook('webhook.received', {
      webhook_id: webhookId,
      payload: eventData,
      received_at: new Date().toISOString()
    });

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { received: true, webhook_id: webhookId }
    };
  }

  private async getWebhooks(request: APIRequest): Promise<APIResponse> {
    const webhooks = mockDb.getWebhooks();

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: webhooks }
    };
  }

  private async healthCheck(request: APIRequest): Promise<APIResponse> {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
          database: 'connected',
          cache: 'available',
          notifications: 'operational'
        }
      }
    };
  }
}

// Export singleton instance
export const apiRouter = new APIRouter();

// Convenience functions
export async function handleAPIRequest(request: APIRequest): Promise<APIResponse> {
  return apiRouter.handleRequest(request);
}

// Mock fetch function for API testing
export function createMockFetch() {
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    const request: APIRequest = {
      method: (options.method as any) || 'GET',
      path: url,
      headers: (options.headers as Record<string, string>) || {},
      body: options.body ? JSON.parse(options.body as string) : undefined
    };

    const response = await apiRouter.handleRequest(request);

    return new Response(
      response.body ? JSON.stringify(response.body) : null,
      {
        status: response.status,
        headers: response.headers
      }
    );
  };
}
