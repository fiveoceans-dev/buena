import { Navigate, Routes, Route } from 'react-router-dom';

export default function AdminIndex() {
  return (
    <Routes>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="products" element={<Navigate to="/products" replace />} />
      <Route path="orders" element={<Navigate to="/orders" replace />} />
      <Route path="inventory" element={<Navigate to="/inventory" replace />} />
      <Route path="customers" element={<Navigate to="/customers" replace />} />
      <Route path="pricing" element={<Navigate to="/pricing" replace />} />
      <Route path="analytics" element={<Navigate to="/analytics" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
