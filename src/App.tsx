import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import VerifyMagicLink from "./pages/auth/VerifyMagicLink";
import AdminIndex from "./pages/admin";
import ProductDetail from "./pages/customer/ProductDetail";
import CartPage from "./pages/customer/Cart";
import CustomerSettings from "./pages/customer/Settings";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import RoleLayout from "@/components/auth/RoleLayout";
import { AdminRoute, CustomerRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Inventory from "./pages/admin/Inventory";
import Customers from "./pages/admin/Customers";
import Pricing from "./pages/admin/Pricing";

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
          <Route path="/pricing" element={<Navigate to="/prices" replace />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <RoleLayout>
                  <Products />
                </RoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Inventory />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Customers />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/prices"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Pricing />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/verify" element={<VerifyMagicLink />} />
          <Route path="/admin/*" element={<AdminIndex />} />
          <Route path="/customer/*" element={<Navigate to="/products" replace />} />
          <Route
            path="/catalog"
            element={
              <Navigate to="/products" replace />
            }
          />
          <Route
            path="/product/:id"
            element={
              <CustomerRoute>
                <CustomerLayout>
                  <ProductDetail />
                </CustomerLayout>
              </CustomerRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <CustomerRoute>
                <CustomerLayout>
                  <CartPage />
                </CustomerLayout>
              </CustomerRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerSettings />
                </CustomerLayout>
              </CustomerRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
