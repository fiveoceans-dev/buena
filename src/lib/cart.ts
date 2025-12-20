import { Cart, CartItem, Product } from '@/data/mockData';
import { mockDb } from '@/data/mockData';
import { getCurrentUser } from './auth';

class CartService {
  private readonly CART_KEY = 'buena_cart';

  // Get current cart
  getCart(): Cart {
    try {
      const cartJson = localStorage.getItem(this.CART_KEY);
      const user = getCurrentUser();

      if (cartJson) {
        const cart: Cart = JSON.parse(cartJson);

        // If cart belongs to different user, clear it
        if (user && cart.userId !== user.id) {
          this.clearCart();
          return this.createNewCart();
        }

        // Refresh product data
        cart.items = cart.items.map(item => ({
          ...item,
          product: mockDb.getProductById(item.productId) || item.product
        }));

        return cart;
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }

    return this.createNewCart();
  }

  // Create new cart
  private createNewCart(): Cart {
    const user = getCurrentUser();
    const cart: Cart = {
      id: `cart_${Date.now()}`,
      userId: user?.id,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveCart(cart);
    return cart;
  }

  // Save cart to localStorage
  private saveCart(cart: Cart): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  // Add item to cart
  addItem(productId: string, quantity: number = 1, variants?: any): Cart {
    const cart = this.getCart();
    const product = mockDb.getProductById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.isInStock) {
      throw new Error('Product is out of stock');
    }

    if (quantity < product.minOrderQuantity) {
      throw new Error(`Minimum order quantity is ${product.minOrderQuantity}`);
    }

    if (product.maxOrderQuantity && quantity > product.maxOrderQuantity) {
      throw new Error(`Maximum order quantity is ${product.maxOrderQuantity}`);
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.maxOrderQuantity && newQuantity > product.maxOrderQuantity) {
        throw new Error(`Maximum order quantity is ${product.maxOrderQuantity}`);
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].addedAt = new Date().toISOString();
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: `item_${Date.now()}_${Math.random()}`,
        productId,
        product,
        quantity,
        selectedVariants: variants,
        addedAt: new Date().toISOString()
      };
      cart.items.push(cartItem);
    }

    cart.updatedAt = new Date().toISOString();
    this.saveCart(cart);
    return cart;
  }

  // Update item quantity
  updateItemQuantity(itemId: string, quantity: number): Cart {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    const item = cart.items[itemIndex];
    const product = item.product;

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Validate quantity
      if (quantity < product.minOrderQuantity) {
        throw new Error(`Minimum order quantity is ${product.minOrderQuantity}`);
      }

      if (product.maxOrderQuantity && quantity > product.maxOrderQuantity) {
        throw new Error(`Maximum order quantity is ${product.maxOrderQuantity}`);
      }

      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();
    this.saveCart(cart);
    return cart;
  }

  // Remove item from cart
  removeItem(itemId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.updatedAt = new Date().toISOString();
    this.saveCart(cart);
    return cart;
  }

  // Clear cart
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  // Get cart summary
  getCartSummary(): {
    itemCount: number;
    subtotal: number;
    total: number;
  } {
    const cart = this.getCart();
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);

    return {
      itemCount,
      subtotal,
      total: subtotal // Add tax/shipping later
    };
  }

  // Convert cart to order (for checkout)
  convertToOrder(): any {
    const cart = this.getCart();
    const user = getCurrentUser();

    if (!user) {
      throw new Error('User must be logged in to create order');
    }

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
    const taxAmount = subtotal * 0.08; // 8% tax
    const shippingAmount = subtotal > 50 ? 0 : 5.99; // Free shipping over $50

    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      productSku: item.product.sku,
      unitPrice: item.product.basePrice,
      quantity: item.quantity,
      discountAmount: 0,
      taxAmount: (item.product.basePrice * item.quantity) * 0.08,
      total: (item.product.basePrice * item.quantity) * 1.08
    }));

    return {
      customerId: user.id,
      customer: user,
      subtotal,
      taxAmount,
      discountAmount: 0,
      shippingAmount,
      total: subtotal + taxAmount + shippingAmount,
      currency: 'USD',
      items: orderItems
    };
  }
}

// Export singleton instance
export const cartService = new CartService();

// Convenience functions
export function addToCart(productId: string, quantity: number = 1) {
  return cartService.addItem(productId, quantity);
}

export function removeFromCart(itemId: string) {
  return cartService.removeItem(itemId);
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
  return cartService.updateItemQuantity(itemId, quantity);
}

export function getCart() {
  return cartService.getCart();
}

export function getCartSummary() {
  return cartService.getCartSummary();
}

export function clearCart() {
  cartService.clearCart();
}
