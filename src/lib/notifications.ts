import { mockDb } from '@/data/mockData';
import { NotificationTemplate } from '@/data/mockData';

export interface NotificationRecipient {
  email?: string;
  phone?: string;
  user_id?: string;
  name?: string;
}

export interface NotificationPayload {
  template_id: string;
  recipient: NotificationRecipient;
  variables: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_for?: string;
}

export interface NotificationResult {
  success: boolean;
  message_id?: string;
  error?: string;
  delivery_time?: number;
}

export interface CommunicationLog {
  id: string;
  type: 'email' | 'sms' | 'push';
  template_id: string;
  recipient: string;
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  metadata: Record<string, any>;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Send notification using template
  async sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
    const { template_id, recipient, variables, priority = 'normal' } = payload;

    try {
      const template = mockDb.getNotificationTemplates().find(t => t.id === template_id);
      if (!template) {
        return {
          success: false,
          error: 'Template not found'
        };
      }

      // Process template variables
      let processedContent = template.content;
      let processedSubject = template.subject || '';

      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedContent = processedContent.replace(regex, String(value));
        processedSubject = processedSubject.replace(regex, String(value));
      });

      // Determine recipient address
      const recipientAddress = template.type === 'email' ? recipient.email : recipient.phone;
      if (!recipientAddress) {
        return {
          success: false,
          error: `No ${template.type} address provided`
        };
      }

      // Simulate sending delay based on priority
      const delay = priority === 'urgent' ? 100 : priority === 'high' ? 300 : priority === 'normal' ? 500 : 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate delivery success (90% success rate)
      const success = Math.random() > 0.1;

      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Log the communication
      this.logCommunication({
        type: template.type,
        template_id,
        recipient: recipientAddress,
        subject: processedSubject,
        content: processedContent,
        status: success ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
        metadata: {
          priority,
          variables,
          template_name: template.name
        }
      });

      if (success) {
        // Simulate delivery time
        setTimeout(() => {
          this.updateDeliveryStatus(messageId, 'delivered');
        }, 2000 + Math.random() * 3000);

        return {
          success: true,
          message_id: messageId,
          delivery_time: delay
        };
      } else {
        return {
          success: false,
          error: 'Delivery failed',
          delivery_time: delay
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(
    templateId: string,
    recipients: NotificationRecipient[],
    variables: Record<string, any>[],
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<{ success_count: number; failed_count: number; results: NotificationResult[] }> {
    const results: NotificationResult[] = [];

    for (let i = 0; i < recipients.length; i++) {
      const result = await this.sendNotification({
        template_id: templateId,
        recipient: recipients[i],
        variables: variables[i] || {},
        priority
      });
      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;

    return {
      success_count: successCount,
      failed_count: failedCount,
      results
    };
  }

  // Get available templates
  getTemplates(type?: 'email' | 'sms' | 'push'): NotificationTemplate[] {
    let templates = mockDb.getNotificationTemplates();

    if (type) {
      templates = templates.filter(t => t.type === type);
    }

    return templates;
  }

  // Create or update template
  async saveTemplate(template: Omit<NotificationTemplate, 'id' | 'created_at'>): Promise<NotificationTemplate> {
    // In a real implementation, this would save to database
    const newTemplate: NotificationTemplate = {
      ...template,
      id: template.id || `template_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    console.log('Template saved:', newTemplate);
    return newTemplate;
  }

  // Get communication logs
  getCommunicationLogs(
    type?: 'email' | 'sms' | 'push',
    limit: number = 50,
    offset: number = 0
  ): CommunicationLog[] {
    // In a real implementation, this would query the database
    // For now, return mock data
    const mockLogs: CommunicationLog[] = [
      {
        id: '1',
        type: 'email',
        template_id: '1',
        recipient: 'customer@buena.com',
        subject: 'Order Confirmation - Order #ORD-20240115-0001',
        content: 'Thank you for your order...',
        status: 'delivered',
        sent_at: '2024-01-15T10:30:00Z',
        delivered_at: '2024-01-15T10:31:00Z',
        metadata: { order_id: 'ORD-20240115-0001' }
      }
    ];

    let filteredLogs = mockLogs;

    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type);
    }

    return filteredLogs.slice(offset, offset + limit);
  }

  // Log communication (private method)
  private logCommunication(log: Omit<CommunicationLog, 'id'>): void {
    const communicationLog: CommunicationLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // In a real implementation, this would save to database
    console.log('Communication logged:', communicationLog);
  }

  // Update delivery status
  private updateDeliveryStatus(messageId: string, status: 'delivered' | 'failed'): void {
    // In a real implementation, this would update the database
    console.log(`Message ${messageId} status updated to: ${status}`);
  }

  // Send order confirmation
  async sendOrderConfirmation(orderId: string): Promise<NotificationResult> {
    // In a real implementation, this would fetch order details and customer info
    const mockVariables = {
      customer_name: 'John Customer',
      order_number: 'ORD-20240115-0001',
      total: '$141.06',
      items: '2x Premium Ethiopian Coffee Beans - $49.98\n1x Organic Free-Range Eggs - $7.99'
    };

    return this.sendNotification({
      template_id: '1', // Order Confirmation template
      recipient: {
        email: 'customer@buena.com',
        name: 'John Customer'
      },
      variables: mockVariables,
      priority: 'high'
    });
  }

  // Send order shipped notification
  async sendOrderShipped(orderId: string, trackingNumber: string): Promise<NotificationResult> {
    const mockVariables = {
      customer_name: 'John Customer',
      order_number: 'ORD-20240115-0001',
      tracking_number: trackingNumber,
      delivery_date: 'January 18, 2024'
    };

    return this.sendNotification({
      template_id: '2', // Order Shipped template
      recipient: {
        email: 'customer@buena.com',
        name: 'John Customer'
      },
      variables: mockVariables,
      priority: 'normal'
    });
  }

  // Send SMS delivery notification
  async sendDeliveryNotification(orderId: string): Promise<NotificationResult> {
    const mockVariables = {
      customer_name: 'John',
      order_number: 'ORD-20240115-0001'
    };

    return this.sendNotification({
      template_id: '3', // Delivery SMS template
      recipient: {
        phone: '+1234567890',
        name: 'John Customer'
      },
      variables: mockVariables,
      priority: 'urgent'
    });
  }

  // Send promotional campaign
  async sendPromotionalCampaign(
    campaignName: string,
    subject: string,
    content: string,
    recipients: NotificationRecipient[]
  ): Promise<{ success_count: number; failed_count: number }> {
    const results = await Promise.all(
      recipients.map(recipient =>
        this.sendNotification({
          template_id: 'custom', // Would need a custom template
          recipient,
          variables: {
            campaign_name: campaignName,
            subject,
            content
          },
          priority: 'low'
        })
      )
    );

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;

    return { success_count: successCount, failed_count: failedCount };
  }

  // Get delivery statistics
  getDeliveryStats(timeRange: 'day' | 'week' | 'month' = 'week'): {
    sent: number;
    delivered: number;
    failed: number;
    delivery_rate: number;
  } {
    // Mock statistics
    const stats = {
      sent: 1250,
      delivered: 1187,
      failed: 63,
      delivery_rate: 94.96
    };

    return stats;
  }

  // Validate template variables
  validateTemplateVariables(templateId: string, variables: Record<string, any>): { valid: boolean; missing: string[] } {
    const template = mockDb.getNotificationTemplates().find(t => t.id === templateId);

    if (!template) {
      return { valid: false, missing: ['template_not_found'] };
    }

    const requiredVars = template.variables;
    const missing = requiredVars.filter(varName => !(varName in variables));

    return {
      valid: missing.length === 0,
      missing
    };
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Convenience functions
export async function sendNotification(payload: NotificationPayload) {
  return notificationService.sendNotification(payload);
}

export async function sendOrderConfirmation(orderId: string) {
  return notificationService.sendOrderConfirmation(orderId);
}

export async function sendOrderShipped(orderId: string, trackingNumber: string) {
  return notificationService.sendOrderShipped(orderId, trackingNumber);
}

export async function sendDeliveryNotification(orderId: string) {
  return notificationService.sendDeliveryNotification(orderId);
}

export function getNotificationTemplates(type?: 'email' | 'sms' | 'push') {
  return notificationService.getTemplates(type);
}

export function getCommunicationLogs(type?: 'email' | 'sms' | 'push', limit?: number) {
  return notificationService.getCommunicationLogs(type, limit);
}
