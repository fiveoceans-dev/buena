import { mockDb } from '@/data/mockData';
import { Product, Category, Order, User } from '@/data/mockData';

// Mock API functions that simulate database operations

export const api = {
  // Products
  products: {
    async list(filters?: {
      category?: string;
      search?: string;
      active?: boolean;
      featured?: boolean;
    }) {
      let products = mockDb.getProducts();

      if (filters?.category) {
        products = products.filter(p => p.category === filters.category);
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }

      if (filters?.active !== undefined) {
        products = products.filter(p => p.isActive === filters.active);
      }

      if (filters?.featured !== undefined) {
        products = products.filter(p => p.isFeatured === filters.featured);
      }

      return { data: products, error: null };
    },

    async get(id: string) {
      const product = mockDb.getProductById(id);
      return { data: product, error: product ? null : 'Product not found' };
    },

    async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
      const newProduct = mockDb.createProduct(product);
      return { data: newProduct, error: null };
    },

    async update(id: string, updates: Partial<Product>) {
      const product = mockDb.updateProduct(id, updates);
      return { data: product, error: product ? null : 'Product not found' };
    },

    async delete(id: string) {
      const success = mockDb.deleteProduct(id);
      return { data: { success }, error: success ? null : 'Product not found' };
    }
  },

  // Categories
  categories: {
    async list() {
      const categories = mockDb.getCategories();
      return { data: categories, error: null };
    },

    async get(id: string) {
      const categories = mockDb.getCategories();
      const category = categories.find(c => c.id === id);
      return { data: category, error: category ? null : 'Category not found' };
    }
  },

  // Orders
  orders: {
    async list(filters?: { customerId?: string; status?: string }) {
      let orders = mockDb.getOrders();

      if (filters?.customerId) {
        orders = orders.filter(o => o.customerId === filters.customerId);
      }

      if (filters?.status) {
        orders = orders.filter(o => o.status === filters.status);
      }

      return { data: orders, error: null };
    },

    async get(id: string) {
      const order = mockDb.getOrderById(id);
      return { data: order, error: order ? null : 'Order not found' };
    },

    async create(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
      const newOrder = mockDb.createOrder(order);
      return { data: newOrder, error: null };
    },

    async update(id: string, updates: Partial<Order>) {
      // For now, just return success (in a real app, this would update the order)
      const order = mockDb.getOrderById(id);
      if (!order) {
        return { data: null, error: 'Order not found' };
      }

      const updatedOrder = { ...order, ...updates, updatedAt: new Date().toISOString() };
      return { data: updatedOrder, error: null };
    }
  },

  // Users
  users: {
    async list() {
      const users = mockDb.getUsers();
      return { data: users, error: null };
    },

    async get(id: string) {
      const user = mockDb.getUserById(id);
      return { data: user, error: user ? null : 'User not found' };
    },

    async update(id: string, updates: Partial<User>) {
      // For now, just return success (in a real app, this would update the user)
      const user = mockDb.getUserById(id);
      if (!user) {
        return { data: null, error: 'User not found' };
      }

      const updatedUser = { ...user, ...updates };
      return { data: updatedUser, error: null };
    }
  }
};

// Query hooks that work with the mock API
export function useProducts(filters?: any) {
  // Simulate React Query behavior
  return {
    data: mockDb.getProducts(),
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve()
  };
}

export function useProduct(id: string) {
  return {
    data: mockDb.getProductById(id),
    isLoading: false,
    error: null
  };
}

export function useCategories() {
  return {
    data: mockDb.getCategories(),
    isLoading: false,
    error: null
  };
}

export function useOrders(filters?: any) {
  return {
    data: mockDb.getOrders(),
    isLoading: false,
    error: null
  };
}

