import React from 'react';
import { mockDb } from '@/data/mockData';

export interface CacheEntry {
  key: string;
  data: any;
  expiresAt: number;
  tags?: string[];
  size: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkRequests: number;
}

class PerformanceService {
  private cache: Map<string, CacheEntry> = new Map();
  private maxCacheSize = 50 * 1024 * 1024; // 50MB
  private currentCacheSize = 0;
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    apiResponseTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkRequests: 0
  };

  constructor() {
    this.initializePerformanceMonitoring();
    this.loadCacheFromStorage();
  }

  // Cache Management
  set(key: string, data: any, ttl: number = 300000, tags?: string[]): void { // 5 minutes default TTL
    const entry: CacheEntry = {
      key,
      data,
      expiresAt: Date.now() + ttl,
      tags,
      size: this.calculateDataSize(data)
    };

    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.currentCacheSize -= oldEntry.size;
    }

    // Check if we need to evict entries
    while (this.currentCacheSize + entry.size > this.maxCacheSize) {
      this.evictOldestEntry();
    }

    this.cache.set(key, entry);
    this.currentCacheSize += entry.size;

    // Persist to localStorage for cross-session cache
    this.persistCache();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentCacheSize -= entry.size;
      this.cache.delete(key);
      this.persistCache();
      return true;
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.currentCacheSize = 0;
    localStorage.removeItem('buena_performance_cache');
  }

  invalidateByTag(tag: string): void {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags?.includes(tag)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }

  getStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cache.values()).filter(entry => entry.expiresAt > now);

    return {
      totalEntries: validEntries.length,
      totalSize: validEntries.reduce((sum, entry) => sum + entry.size, 0),
      maxSize: this.maxCacheSize,
      hitRate: this.metrics.cacheHitRate,
      averageEntrySize: validEntries.length > 0 ? validEntries.reduce((sum, entry) => sum + entry.size, 0) / validEntries.length : 0
    };
  }

  private evictOldestEntry(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < oldestTime) {
        oldestTime = entry.expiresAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private calculateDataSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 1024; // Default estimate
    }
  }

  private persistCache(): void {
    try {
      const cacheData = Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        data: entry.data,
        expiresAt: entry.expiresAt,
        tags: entry.tags,
        size: entry.size
      }));

      localStorage.setItem('buena_performance_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error);
    }
  }

  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem('buena_performance_cache');
      if (stored) {
        const cacheData = JSON.parse(stored);
        const now = Date.now();

        cacheData.forEach((item: any) => {
          if (item.expiresAt > now) {
            this.cache.set(item.key, {
              key: item.key,
              data: item.data,
              expiresAt: item.expiresAt,
              tags: item.tags,
              size: item.size
            });
            this.currentCacheSize += item.size;
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  // Performance Monitoring
  private initializePerformanceMonitoring(): void {
    // Monitor page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        }
      });
    }

    // Monitor API calls
    this.interceptFetch();

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }, 30000); // Every 30 seconds
    }
  }

  private interceptFetch(): void {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = Date.now();
      this.metrics.networkRequests++;

      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();

        // Track API response time for API calls
        if (args[0].toString().includes('/api/')) {
          this.metrics.apiResponseTime = (this.metrics.apiResponseTime + (endTime - startTime)) / 2;
        }

        return response;
      } catch (error) {
        const endTime = Date.now();
        if (args[0].toString().includes('/api/')) {
          this.metrics.apiResponseTime = (this.metrics.apiResponseTime + (endTime - startTime)) / 2;
        }
        throw error;
      }
    };
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Lazy Loading Utilities
  static lazyLoadComponent<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>
  ): React.LazyExoticComponent<T> {
    return React.lazy(importFunc);
  }

  // Image Optimization
  static optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}): string {
    // In a real implementation, this would integrate with a CDN like Cloudinary
    // For demo, we'll just return the original src
    return src;
  }

  // Bundle Splitting
  static loadFeatureBundle(featureName: string): Promise<void> {
    return new Promise((resolve) => {
      // Simulate dynamic import
      setTimeout(() => {
        console.log(`Loaded feature bundle: ${featureName}`);
        resolve();
      }, 100);
    });
  }

  // Preloading
  preloadResource(url: string, as: 'image' | 'script' | 'style' | 'font' | 'document'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    link.crossOrigin = 'anonymous';

    document.head.appendChild(link);
  }

  preloadRoute(route: string): void {
    // Preload critical resources for a route
    switch (route) {
      case '/dashboard':
        // Note: Vite handles code-splitting filenames; avoid preloading non-existent JS paths here.
        break;
      case '/customer':
        // Note: Vite handles code-splitting filenames; avoid preloading non-existent JS paths here.
        break;
      default:
        break;
    }
  }

  // Resource Hints
  addResourceHints(): void {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'preconnect', href: '//fonts.gstatic.com', crossOrigin: '' },
      { rel: 'preconnect', href: '//api.example.com' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin !== undefined) {
        link.crossOrigin = hint.crossOrigin;
      }
      document.head.appendChild(link);
    });
  }

  // Compression and Minification
  static compressData(data: any): string {
    // In a real implementation, this would use a compression library
    return JSON.stringify(data);
  }

  static decompressData(compressedData: string): any {
    // In a real implementation, this would decompress the data
    return JSON.parse(compressedData);
  }

  // Virtual Scrolling for Large Lists
  createVirtualScrollContainer(
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    renderItem: (index: number) => React.ReactNode
  ) {
    const [scrollTop, setScrollTop] = React.useState(0);

    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItems, totalItems);

    const offsetY = startIndex * itemHeight;

    return {
      containerStyle: {
        height: containerHeight,
        overflow: 'auto'
      },
      contentStyle: {
        height: totalItems * itemHeight,
        position: 'relative' as const
      },
      visibleItemsStyle: {
        transform: `translateY(${offsetY}px)`
      },
      startIndex,
      endIndex,
      onScroll: (event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
      },
      renderItem
    };
  }

  // Service Worker Integration
  registerServiceWorker(): void {
    if (import.meta.env.DEV) {
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  // Background Processing
  scheduleBackgroundTask(taskName: string, task: () => Promise<void>, delay: number = 0): void {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        setTimeout(() => {
          task().catch(error => console.error(`Background task ${taskName} failed:`, error));
        }, delay);
      });
    } else {
      setTimeout(() => {
        task().catch(error => console.error(`Background task ${taskName} failed:`, error));
      }, delay);
    }
  }

  // Critical Resource Loading
  loadCriticalResources(): void {
    // Load fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.media = 'print';
    fontLink.onload = () => { fontLink.media = 'all'; };
    document.head.appendChild(fontLink);

    // Load critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'stylesheet';
    criticalCSS.href = '/critical.css';
    document.head.appendChild(criticalCSS);
  }

  // Performance Budget Monitoring
  monitorPerformanceBudget(budgets: {
    js?: number; // KB
    css?: number; // KB
    images?: number; // KB
    total?: number; // KB
  }): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

        let jsSize = 0;
        let cssSize = 0;
        let imageSize = 0;

        resources.forEach(resource => {
          const size = resource.transferSize || 0;

          if (resource.name.includes('.js')) {
            jsSize += size;
          } else if (resource.name.includes('.css')) {
            cssSize += size;
          } else if (resource.name.match(/\.(png|jpg|jpeg|gif|webp|svg)/)) {
            imageSize += size;
          }
        });

        const totalSize = jsSize + cssSize + imageSize;

        // Convert to KB
        jsSize = Math.round(jsSize / 1024);
        cssSize = Math.round(cssSize / 1024);
        imageSize = Math.round(imageSize / 1024);
        const totalSizeKB = Math.round(totalSize / 1024);

        // Check budgets
        const warnings: string[] = [];

        if (budgets.js && jsSize > budgets.js) {
          warnings.push(`JavaScript size (${jsSize}KB) exceeds budget (${budgets.js}KB)`);
        }

        if (budgets.css && cssSize > budgets.css) {
          warnings.push(`CSS size (${cssSize}KB) exceeds budget (${budgets.css}KB)`);
        }

        if (budgets.images && imageSize > budgets.images) {
          warnings.push(`Images size (${imageSize}KB) exceeds budget (${budgets.images}KB)`);
        }

        if (budgets.total && totalSizeKB > budgets.total) {
          warnings.push(`Total size (${totalSizeKB}KB) exceeds budget (${budgets.total}KB)`);
        }

        if (warnings.length > 0) {
          console.warn('Performance Budget Warnings:', warnings);
        } else {
          console.log('Performance budget check passed:', {
            js: jsSize,
            css: cssSize,
            images: imageSize,
            total: totalSizeKB
          });
        }
      }, 3000); // Wait for page to load
    }
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();

// Convenience functions
export function useCache<T>(key: string, ttl?: number) {
  return {
    set: (data: T) => performanceService.set(key, data, ttl),
    get: () => performanceService.get<T>(key),
    delete: () => performanceService.delete(key)
  };
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = React.useState(performanceService.getMetrics());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceService.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// React lazy loading with error boundaries
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFunc);

  const Wrapped: React.FC<React.ComponentProps<T>> = (props) => (
    React.createElement(
      React.Suspense,
      { fallback: fallback ?? React.createElement('div', null, 'Loading...') },
      React.createElement(LazyComponent, props as any)
    )
  );

  Wrapped.displayName = 'LazyComponent';
  return Wrapped;
}
