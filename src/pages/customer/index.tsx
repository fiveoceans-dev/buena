import { Routes, Route } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import Catalog from './Catalog';
import ProductDetail from './ProductDetail';

export default function CustomerIndex() {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* Add more customer routes here as we implement them */}
      </Routes>
    </CustomerLayout>
  );
}
