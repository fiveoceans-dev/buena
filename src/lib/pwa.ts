import { mockDb } from '@/data/mockData';

export interface PWARegistration {
  active: boolean;
  installing: boolean;
  waiting: boolean;
  updateAvailable: boolean;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PWAService {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private deferredPrompt: any = null;

  constructor() {
    this.initializePWA();
  }

  // Initialize PWA functionality
  private async initializePWA() {
    if (import.meta.env.DEV) {
      await this.clearServiceWorkersAndCaches();
      this.setupInstallPrompt();
      this.setupNetworkListeners();
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registered successfully');

        // Handle service worker updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.notifyUpdateAvailable();
              }
            });
          }
        });

        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event);
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Handle PWA install prompt
    this.setupInstallPrompt();

    // Handle online/offline events
    this.setupNetworkListeners();
  }

  // Setup install prompt handling
  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;

      // Dispatch custom event for install prompt
      window.dispatchEvent(new CustomEvent('pwa-install-available', {
        detail: { prompt: event }
      }));
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;

      // Dispatch custom event for successful install
      window.dispatchEvent(new CustomEvent('pwa-installed'));

      console.log('PWA was installed');
    });
  }

  // Setup network status listeners
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      window.dispatchEvent(new CustomEvent('network-status-changed', {
        detail: { online: true }
      }));

      // Sync offline data when coming back online
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      window.dispatchEvent(new CustomEvent('network-status-changed', {
        detail: { online: false }
      }));
    });
  }

  // Handle messages from service worker
  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data);
        break;
      case 'SYNC_COMPLETED':
        console.log('Background sync completed:', data);
        break;
      default:
        console.log('Service worker message:', type, data);
    }
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Get PWA registration status
  getRegistrationStatus(): PWARegistration {
    if (!this.registration) {
      return {
        active: false,
        installing: false,
        waiting: false,
        updateAvailable: false
      };
    }

    return {
      active: !!this.registration.active,
      installing: !!this.registration.installing,
      waiting: !!this.registration.waiting,
      updateAvailable: this.updateAvailable
    };
  }

  // Prompt user to install PWA
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;

      this.deferredPrompt = null;

      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  // Update service worker
  async updateServiceWorker(): Promise<void> {
    if (!this.registration?.waiting) {
      return;
    }

    // Send message to service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page to activate the new service worker
    window.location.reload();
  }

  // Check for updates
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      return this.updateAvailable;
    } catch (error) {
      console.error('Update check failed:', error);
      return false;
    }
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(vapidPublicKey: string): Promise<PushSubscriptionData | null> {
    if (!this.registration) {
      console.error('Service worker not registered');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Push notification permission denied');
        return null;
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
        }
      };

      // Store subscription data
      localStorage.setItem('pwa-push-subscription', JSON.stringify(subscriptionData));

      return subscriptionData;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      const subscription = await this.registration?.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        localStorage.removeItem('pwa-push-subscription');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Push unsubscribe failed:', error);
      return false;
    }
  }

  // Get current push subscription
  getPushSubscription(): PushSubscriptionData | null {
    try {
      const stored = localStorage.getItem('pwa-push-subscription');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Send notification to user
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.registration) {
      console.error('Service worker not registered');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options
    };

    if ('Notification' in window && Notification.permission === 'granted') {
      await this.registration.showNotification(title, defaultOptions);
    } else {
      console.log('Notifications not supported or permission not granted');
    }
  }

  // Cache data for offline use
  async cacheData(resourceType: string, resourceId: string, data: any): Promise<void> {
    mockDb.cacheResource({
      tenant_id: '1', // Default tenant
      resource_type: resourceType as any,
      resource_id: resourceId,
      data,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });

    // Notify service worker
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CACHE_PRODUCT',
        data
      });
    }
  }

  // Get cached data
  getCachedData(resourceType: string, resourceId: string): any {
    const cached = mockDb.getCachedResource(resourceType, resourceId);
    return cached?.data || null;
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    // Clear PWA cache in mock database
    mockDb.clearExpiredCache();

    // Notify service worker
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  }

  private async clearServiceWorkersAndCaches(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  }

  // Check network status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Sync offline data when coming back online
  private async syncOfflineData(): Promise<void> {
    // Implement offline data sync logic here
    console.log('Syncing offline data...');

    // Example: Sync pending orders, cart updates, etc.
    // This would integrate with your existing sync logic
  }

  // Helper function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  // Notify about available update
  private notifyUpdateAvailable(): void {
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: { registration: this.registration }
    }));
  }
}

// Export singleton instance
export const pwaService = new PWAService();

// Convenience functions
export function isPWAInstalled(): boolean {
  return pwaService.isInstalled();
}

export function getPWARegistrationStatus(): PWARegistration {
  return pwaService.getRegistrationStatus();
}

export async function installPWA(): Promise<boolean> {
  return pwaService.promptInstall();
}

export async function updatePWA(): Promise<void> {
  return pwaService.updateServiceWorker();
}

export async function subscribeToPushNotifications(vapidKey: string) {
  return pwaService.subscribeToPushNotifications(vapidKey);
}

export function showPWANotification(title: string, options?: NotificationOptions) {
  return pwaService.showNotification(title, options);
}

export function isOnline(): boolean {
  return pwaService.isOnline();
}

// React hooks for PWA functionality
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    setIsInstalled(isPWAInstalled());

    const handleInstallAvailable = () => setIsInstallable(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  return {
    isInstallable,
    isInstalled,
    install: installPWA
  };
}

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    // Check for updates on mount
    pwaService.checkForUpdates().then(setUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return {
    updateAvailable,
    update: updatePWA
  };
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleStatusChange = (event: CustomEvent) => {
      setIsOnline(event.detail.online);
    };

    window.addEventListener('network-status-changed', handleStatusChange as EventListener);

    return () => {
      window.removeEventListener('network-status-changed', handleStatusChange as EventListener);
    };
  }, []);

  return isOnline;
}

// Add React import at the top since we're using React hooks
import React from 'react';
