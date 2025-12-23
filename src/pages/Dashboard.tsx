import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import AdminDashboard from './admin/Dashboard';
import Products from './admin/Products';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-black" />
          <p className="text-sm text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role === 'customer') {
    return (
      <CustomerLayout>
        <Products />
      </CustomerLayout>
    );
  }

  const adminContent = <AdminDashboard />;

  return (
    <AdminLayout>
      {adminContent}
    </AdminLayout>
  );
}
