import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/useAuth';

const Dashboard = () => {
  const permissions = usePermissions();

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

  const quickActions = [
    permissions.canManageProducts && { label: 'Add New Product', href: '/products' },
    permissions.canManageOrders && { label: 'Process Orders', href: '/orders' },
    permissions.canManageInventory && { label: 'Manage Inventory', href: '/inventory' },
    permissions.canViewAnalytics && { label: 'View Analytics', href: '/analytics' },
    permissions.canManageUsers && { label: 'Manage Users', href: '/customers' },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <div className="space-y-10 text-black">
      {/* Quick Actions row (catalog-style) */}
      {quickActions.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex items-center gap-4 whitespace-nowrap text-[12px] text-black">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="hover:underline underline-offset-4 text-black/70"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      )}

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

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
          Recent Orders
        </div>
        <div className="divide-y divide-black/10 text-sm">
          {recentOrders.map((order) => (
            <div key={order.id} className="py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-black">{order.id}</span>
                <span className="text-black/40">{order.date}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-black/70">
                <span>{order.customer}</span>
                <span className="tabular-nums">${order.total}</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/40">
                {order.status}
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="link"
          className="h-auto p-0 text-xs uppercase tracking-[0.2em]"
        >
          View all orders
        </Button>
      </div>

      {/* Pending Orders Alert */}
      {stats.pendingOrders > 0 && (
        <div className="border-y border-black/10 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-black/60">
          <span>Action required: {stats.pendingOrders} pending orders</span>
          <Button
            variant="link"
            className="h-auto p-0 text-xs uppercase tracking-[0.2em]"
          >
            Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
