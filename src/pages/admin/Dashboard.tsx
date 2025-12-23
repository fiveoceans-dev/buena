import { TableCell } from '@/components/ui/table';
import { AdminPage, AdminPageHeader } from '@/components/admin/AdminPage';
import { AdminTable, AdminTableBody, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/admin/AdminTable';

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const stats = {
    totalOrders: 145,
    pendingOrders: 12,
    totalRevenue: 24580.50,
    lowStockItems: 8,
    totalCustomers: 89,
    activeProducts: 156
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', status: 'pending', total: 125.99, date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', status: 'processing', total: 89.50, date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Bob Johnson', status: 'shipped', total: 234.75, date: '2024-01-14' },
  ];

  return (
    <AdminPage>
      <AdminPageHeader title="Dashboard" />

      {/* Single-line metrics (no titles/subtitles) */}
      <div className="text-xs text-black/60 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Orders: <span className="font-medium text-black tabular-nums">{stats.totalOrders}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Pending: <span className="font-medium text-black tabular-nums">{stats.pendingOrders}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Revenue:{' '}
          <span className="font-medium text-black tabular-nums">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Customers: <span className="font-medium text-black tabular-nums">{stats.totalCustomers}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Products: <span className="font-medium text-black tabular-nums">{stats.activeProducts}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Low stock: <span className="font-medium text-black tabular-nums">{stats.lowStockItems}</span>
        </span>
      </div>

      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Order</AdminTableHead>
            <AdminTableHead>Customer</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead>Total</AdminTableHead>
            <AdminTableHead>Date</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
            {recentOrders.map((order) => (
              <AdminTableRow key={order.id}>
                <TableCell className="px-2 py-3 font-medium">{order.id}</TableCell>
                <TableCell className="px-2 py-3">{order.customer}</TableCell>
                <TableCell className="px-2 py-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="px-2 py-3 tabular-nums">${order.total.toFixed(2)}</TableCell>
                <TableCell className="px-2 py-3 text-black/60">{order.date}</TableCell>
              </AdminTableRow>
            ))}
        </AdminTableBody>
      </AdminTable>
    </AdminPage>
  );
};

export default Dashboard;
