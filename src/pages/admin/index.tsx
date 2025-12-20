import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManagerRoute } from '@/components/auth/ProtectedRoute';
import Dashboard from './Dashboard';
import Products from './Products';
import Analytics from './Analytics';
import Inventory from './Inventory';
import Pricing from './Pricing';
import Orders from './Orders';
import Customers from './Customers';

export default function AdminIndex() {
  return (
    <ManagerRoute>
      <AdminLayout>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="analytics" element={<Analytics />} />
          {/* Add more admin routes here as we implement them */}
        </Routes>
      </AdminLayout>
    </ManagerRoute>
  );
}
