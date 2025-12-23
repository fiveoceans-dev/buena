import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { mockDb } from '@/data/mockData';
import { useState } from 'react';
import { AdminPage, AdminPageHeader, AdminSearch, AdminTabsList } from '@/components/admin/AdminPage';
import { AdminTable, AdminTableBody, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/admin/AdminTable';

const statusTone = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-black';
    case 'cancelled':
      return 'text-black/70';
    default:
      return 'text-black/50';
  }
};

export default function Orders() {
  const orders = mockDb.getOrders().slice().reverse();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const orderNumber = order.orderNumber?.toLowerCase() ?? '';
    const customer = order.customer?.email?.toLowerCase() ?? '';
    const status = order.status?.toLowerCase() ?? '';
    const query = searchTerm.toLowerCase();

    return (
      !query ||
      orderNumber.includes(query) ||
      customer.includes(query) ||
      status.includes(query)
    );
  });

  return (
    <AdminPage>
      <AdminPageHeader
        title="Orders"
        actions={
          <Button
            variant="link"
            className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
          >
            Add Order
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <AdminTabsList tabs={[{ value: 'all', label: 'All' }]} />

        <TabsContent value="all" className="mt-6 space-y-4">
          <AdminSearch
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Order</AdminTableHead>
                <AdminTableHead>Customer</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead>Total</AdminTableHead>
                <AdminTableHead>Delivery</AdminTableHead>
                <AdminTableHead>Created</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {filteredOrders.map((o) => (
                <AdminTableRow key={o.id}>
                  <TableCell className="px-2 py-3 font-medium">{o.orderNumber}</TableCell>
                  <TableCell className="px-2 py-3">{o.customer?.email ?? o.customerId}</TableCell>
                  <TableCell className="px-2 py-3">
                    <span className={`text-[10px] uppercase tracking-[0.2em] ${statusTone(o.status)}`}>
                      {o.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3 tabular-nums">${o.total.toFixed(2)}</TableCell>
                  <TableCell className="px-2 py-3">{o.deliveryDate ?? '-'}</TableCell>
                  <TableCell className="px-2 py-3">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </AdminTableRow>
              ))}
              {filteredOrders.length === 0 && (
                <AdminTableRow>
                  <TableCell colSpan={6} className="text-center text-black/60 py-8">
                    No orders yet.
                  </TableCell>
                </AdminTableRow>
              )}
            </AdminTableBody>
          </AdminTable>
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
