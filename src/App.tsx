import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import VerifyMagicLink from "./pages/auth/VerifyMagicLink";
import AdminIndex from "./pages/admin";
import CustomerIndex from "./pages/customer";

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
