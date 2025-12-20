import { useEffect, useState } from 'react';
import { AUTH_DISABLED, getAuthUser, User } from '@/lib/auth';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'warehouse' | 'customer' | null;
  profile: User | null;
}

/**
 * Hook to get current authenticated user with role information
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => (AUTH_DISABLED ? getAuthUser() : null));
  const [loading, setLoading] = useState(!AUTH_DISABLED);

  useEffect(() => {
    if (AUTH_DISABLED) {
      return;
    }

    // Get initial user from localStorage
    const loadUser = () => {
      const authUser = getAuthUser();
      setUser(authUser);
      setLoading(false);
    };

    loadUser();

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
    isWarehouse: user?.role === 'warehouse' || user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  };
}

/**
 * Hook to check if user has a specific role
 */
export function useRoleCheck(requiredRole: string | string[]) {
  const { user, loading } = useAuth();

  if (loading) return { hasAccess: false, loading: true };

  if (!user) return { hasAccess: false, loading: false };

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Admin has access to everything
  if (user.role === 'admin') return { hasAccess: true, loading: false };

  // Check if user has required role
  const hasAccess = roles.includes(user.role || '');

  return { hasAccess, loading: false };
}

/**
 * Hook to get user permissions based on role
 */
export function usePermissions() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return {
      loading,
      canManageProducts: false,
      canManageOrders: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageInventory: false,
    };
  }

  const role = user.role;

  return {
    loading: false,
    canManageProducts: ['admin', 'manager'].includes(role || ''),
    canManageOrders: ['admin', 'manager', 'warehouse'].includes(role || ''),
    canManageUsers: role === 'admin',
    canViewAnalytics: ['admin', 'manager'].includes(role || ''),
    canManageInventory: ['admin', 'manager', 'warehouse'].includes(role || ''),
  };
}

/**
 * Hook to check if user can access admin features
 */
export function useAdminAccess() {
  return useRoleCheck(['admin', 'manager', 'warehouse']);
}
