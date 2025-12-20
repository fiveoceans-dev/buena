import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import VerifyMagicLink from "./pages/auth/VerifyMagicLink";
import AdminIndex from "./pages/admin";
import CustomerIndex from "./pages/customer";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagerRoute, WarehouseRoute } from "@/components/auth/ProtectedRoute";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Inventory from "./pages/admin/Inventory";
import Customers from "./pages/admin/Customers";
import Pricing from "./pages/admin/Pricing";
import Analytics from "./pages/admin/Analytics";

// Performance and enterprise services
import { performanceService } from './lib/performance';
import { tenantService } from './lib/tenant';
import { pwaService } from './lib/pwa';

const queryClient = new QueryClient();

const App = () => {
  // Initialize enterprise services
  React.useEffect(() => {
    // Performance optimizations
    performanceService.loadCriticalResources();
    performanceService.addResourceHints();

    // Tenant branding
    tenantService.applyBranding();

    // PWA functionality
    pwaService.initializePWA();

    // Performance budget monitoring
    performanceService.monitorPerformanceBudget({
      js: 500, // 500KB
      css: 100, // 100KB
      images: 1000, // 1000KB
      total: 2000 // 2000KB
    });
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/products"
            element={
              <ManagerRoute>
                <AdminLayout>
                  <Products />
                </AdminLayout>
              </ManagerRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <WarehouseRoute>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </WarehouseRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <WarehouseRoute>
                <AdminLayout>
                  <Inventory />
                </AdminLayout>
              </WarehouseRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ManagerRoute>
                <AdminLayout>
                  <Customers />
                </AdminLayout>
              </ManagerRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ManagerRoute>
                <AdminLayout>
                  <Pricing />
                </AdminLayout>
              </ManagerRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ManagerRoute>
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              </ManagerRoute>
            }
          />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/verify" element={<VerifyMagicLink />} />
          <Route path="/admin/*" element={<AdminIndex />} />
          <Route path="/customer/*" element={<CustomerIndex />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
