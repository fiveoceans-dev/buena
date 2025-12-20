import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
}

/**
 * Route guard component that checks authentication and role-based access
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/auth/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasAccess = roles.includes(user?.role || '');

    // Admin has access to everything
    if (user?.role === 'admin' || hasAccess) {
      return <>{children}</>;
    }

    // Access denied - show error or redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and no role check required
  return <>{children}</>;
}

/**
 * Admin-only route guard
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

/**
 * Manager or Admin route guard
 */
export function ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'manager']}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Warehouse, Manager, or Admin route guard
 */
export function WarehouseRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'manager', 'warehouse']}>
      {children}
    </ProtectedRoute>
  );
}
