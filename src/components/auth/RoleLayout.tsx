import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CustomerLayout } from '@/components/customer/CustomerLayout';

interface RoleLayoutProps {
  children: ReactNode;
}

export default function RoleLayout({ children }: RoleLayoutProps) {
  const { user } = useAuth();
  const isCustomer = user?.role === 'customer';

  return isCustomer ? (
    <CustomerLayout>{children}</CustomerLayout>
  ) : (
    <AdminLayout>{children}</AdminLayout>
  );
}
