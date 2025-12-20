import { Routes, Route } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import Catalog from './Catalog';
import ProductDetail from './ProductDetail';
import CartPage from './Cart';
import CustomerSettings from './Settings';

export default function CustomerIndex() {
  return (
    <CustomerLayout>
      <Routes>
        <Route index element={<Catalog />} />
        {/* Keep /customer/catalog as the canonical entry (used by login redirects) */}
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="settings" element={<CustomerSettings />} />
        {/* Add more customer routes here as we implement them */}
      </Routes>
    </CustomerLayout>
  );
}
