import { mockDb } from '@/data/mockData';
import { TenantConfig } from '@/data/mockData';

class TenantService {
  private static instance: TenantService;
  private currentTenant: TenantConfig | null = null;

  private constructor() {}

  static getInstance(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService();
    }
    return TenantService.instance;
  }

  // Get current tenant configuration
  getCurrentTenant(): TenantConfig {
    if (!this.currentTenant) {
      this.currentTenant = mockDb.getCurrentTenant();
    }
    return this.currentTenant;
  }

  // Check if a feature is enabled
  isFeatureEnabled(feature: keyof TenantConfig['features']): boolean {
    const tenant = this.getCurrentTenant();
    return tenant.features[feature] || false;
  }

  // Get tenant branding
  getBranding() {
    return this.getCurrentTenant().branding;
  }

  // Get tenant settings
  getSettings() {
    return this.getCurrentTenant().settings;
  }

  // Get tenant limits
  getLimits() {
    return this.getCurrentTenant().limits;
  }

  // Check if tenant has access to an integration
  hasIntegration(integrationType: keyof TenantConfig['integrations'], value?: string): boolean {
    const tenant = this.getCurrentTenant();
    const integration = tenant.integrations[integrationType];

    if (Array.isArray(integration)) {
      return value ? integration.includes(value) : integration.length > 0;
    }

    return Boolean(integration);
  }

  // Apply tenant branding to CSS variables
  applyBranding(): void {
    const branding = this.getBranding();

    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      // Apply color variables
      Object.entries(branding.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });

      // Apply font variables
      root.style.setProperty('--font-heading', branding.fonts.heading);
      root.style.setProperty('--font-body', branding.fonts.body);

      // Update favicon
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = branding.favicon;
      }

      // Update title with tenant name
      document.title = `${this.getCurrentTenant().name} - Retail Platform`;
    }
  }

  // Get tenant-specific API endpoints
  getAPIEndpoints() {
    const tenant = this.getCurrentTenant();

    return {
      products: `/api/${tenant.id}/products`,
      orders: `/api/${tenant.id}/orders`,
      customers: `/api/${tenant.id}/customers`,
      inventory: `/api/${tenant.id}/inventory`,
      analytics: `/api/${tenant.id}/analytics`
    };
  }

  // Validate tenant limits
  validateLimits(resourceType: keyof TenantConfig['limits'], currentCount: number): {
    valid: boolean;
    limit: number;
    remaining: number;
  } {
    const limits = this.getLimits();
    const limit = limits[resourceType];

    return {
      valid: currentCount < limit,
      limit,
      remaining: Math.max(0, limit - currentCount)
    };
  }

  // Get tenant-specific feature flags
  getFeatureFlags(): TenantConfig['features'] {
    return this.getCurrentTenant().features;
  }

  // Update tenant configuration (admin only)
  updateTenant(updates: Partial<TenantConfig>): TenantConfig {
    // In a real implementation, this would update the database
    // For now, we'll just return the current tenant with updates
    this.currentTenant = { ...this.getCurrentTenant(), ...updates };
    return this.currentTenant;
  }
}

// Export singleton instance
export const tenantService = TenantService.getInstance();

// Helper functions
export function getCurrentTenant(): TenantConfig {
  return tenantService.getCurrentTenant();
}

export function isFeatureEnabled(feature: keyof TenantConfig['features']): boolean {
  return tenantService.isFeatureEnabled(feature);
}

export function getTenantBranding() {
  return tenantService.getBranding();
}

export function getTenantSettings() {
  return tenantService.getSettings();
}

export function hasIntegration(integrationType: keyof TenantConfig['integrations'], value?: string): boolean {
  return tenantService.hasIntegration(integrationType, value);
}

export function applyTenantBranding(): void {
  tenantService.applyBranding();
}
