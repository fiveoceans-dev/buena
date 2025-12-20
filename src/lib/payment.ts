import { mockDb } from '@/data/mockData';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  client_secret: string;
  payment_method?: PaymentMethod;
  metadata: Record<string, any>;
  created_at: string;
  processed_at?: string;
}

export interface PaymentResult {
  success: boolean;
  transaction_id?: string;
  error?: string;
  payment_intent?: PaymentIntent;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  interval_count: number;
  features: string[];
  is_active: boolean;
}

class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Create payment intent
  async createPaymentIntent(
    amount: number,
    currency: string = 'USD',
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntent> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'pending',
      client_secret: `pi_secret_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata,
      created_at: new Date().toISOString()
    };

    return paymentIntent;
  }

  // Process payment
  async processPayment(
    paymentIntentId: string,
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const successRate = 0.95; // 95% success rate for demo
    const success = Math.random() < successRate;

    if (success) {
      return {
        success: true,
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payment_intent: {
          id: paymentIntentId,
          amount: 0, // Would be set from the intent
          currency: 'USD',
          status: 'succeeded',
          client_secret: '',
          payment_method: paymentMethod,
          metadata: {},
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString()
        }
      };
    } else {
      return {
        success: false,
        error: 'Payment was declined by the card issuer'
      };
    }
  }

  // Save payment method for customer
  async savePaymentMethod(customerId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const savedMethod: PaymentMethod = {
      ...paymentMethod,
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // In a real implementation, this would save to database
    console.log(`Saved payment method for customer ${customerId}:`, savedMethod);

    return savedMethod;
  }

  // Get customer's payment methods
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock payment methods
    return [
      {
        id: 'pm_1234567890',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      },
      {
        id: 'pm_0987654321',
        type: 'paypal',
        isDefault: false
      }
    ];
  }

  // Create subscription
  async createSubscription(
    customerId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; subscription_id?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = Math.random() > 0.05; // 95% success rate

    if (success) {
      return {
        success: true,
        subscription_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Failed to create subscription'
      };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  }

  // Get subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return [
      {
        id: 'plan_basic',
        name: 'Basic',
        description: 'Perfect for small businesses',
        amount: 29,
        currency: 'USD',
        interval: 'month',
        interval_count: 1,
        features: [
          'Up to 100 products',
          'Basic analytics',
          'Email support',
          'Mobile app'
        ],
        is_active: true
      },
      {
        id: 'plan_pro',
        name: 'Professional',
        description: 'For growing retail operations',
        amount: 79,
        currency: 'USD',
        interval: 'month',
        interval_count: 1,
        features: [
          'Unlimited products',
          'Advanced analytics',
          'Priority support',
          'API access',
          'White-label options',
          'Multi-location support'
        ],
        is_active: true
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        description: 'Full-featured enterprise solution',
        amount: 199,
        currency: 'USD',
        interval: 'month',
        interval_count: 1,
        features: [
          'Everything in Professional',
          'Custom integrations',
          'Dedicated account manager',
          'SLA guarantee',
          'Advanced security',
          'Custom development'
        ],
        is_active: true
      }
    ];
  }

  // Process refund
  async processRefund(
    transactionId: string,
    amount: number,
    reason: string = 'customer_request'
  ): Promise<{ success: boolean; refund_id?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = Math.random() > 0.02; // 98% success rate

    if (success) {
      return {
        success: true,
        refund_id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Refund processing failed'
      };
    }
  }

  // Get payment history
  async getPaymentHistory(customerId: string): Promise<PaymentIntent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock payment history
    return [
      {
        id: 'pi_1234567890',
        amount: 12599,
        currency: 'USD',
        status: 'succeeded',
        client_secret: '',
        metadata: { order_id: 'ORD-20240115-0001' },
        created_at: '2024-01-15T10:30:00Z',
        processed_at: '2024-01-15T10:31:00Z'
      },
      {
        id: 'pi_0987654321',
        amount: 7999,
        currency: 'USD',
        status: 'succeeded',
        client_secret: '',
        metadata: { order_id: 'ORD-20240110-0002' },
        created_at: '2024-01-10T14:20:00Z',
        processed_at: '2024-01-10T14:21:00Z'
      }
    ];
  }

  // Validate payment method
  validatePaymentMethod(paymentMethod: Partial<PaymentMethod>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentMethod.type) {
      errors.push('Payment method type is required');
    }

    if (paymentMethod.type === 'card') {
      if (!paymentMethod.last4 || paymentMethod.last4.length !== 4) {
        errors.push('Card last 4 digits are required');
      }
      if (!paymentMethod.brand) {
        errors.push('Card brand is required');
      }
      if (!paymentMethod.expiryMonth || !paymentMethod.expiryYear) {
        errors.push('Card expiry date is required');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get supported payment methods for current tenant
  getSupportedMethods(): string[] {
    const providers = mockDb.getPaymentProviders();
    const methods = new Set<string>();

    providers.forEach(provider => {
      provider.supported_methods.forEach(method => {
        methods.add(method);
      });
    });

    return Array.from(methods);
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();

// Convenience functions
export async function createPaymentIntent(amount: number, currency?: string, metadata?: any) {
  return paymentService.createPaymentIntent(amount, currency, metadata);
}

export async function processPayment(paymentIntentId: string, paymentMethod: PaymentMethod) {
  return paymentService.processPayment(paymentIntentId, paymentMethod);
}

export async function savePaymentMethod(customerId: string, paymentMethod: Omit<PaymentMethod, 'id'>) {
  return paymentService.savePaymentMethod(customerId, paymentMethod);
}

export async function getPaymentMethods(customerId: string) {
  return paymentService.getPaymentMethods(customerId);
}

export async function getSubscriptionPlans() {
  return paymentService.getSubscriptionPlans();
}

export async function getSupportedPaymentMethods() {
  return paymentService.getSupportedMethods();
}
