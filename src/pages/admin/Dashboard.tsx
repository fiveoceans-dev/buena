import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-muted text-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <TrendingUp className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-foreground/70">
            Welcome back, {user?.email?.split('@')[0]}. Here's what's happening with your business.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {user?.role} Access
        </Badge>
      </div>

      {/* Single-line metrics (no titles/subtitles) */}
      <div className="text-sm text-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Orders: <span className="font-medium text-foreground tabular-nums">{stats.totalOrders}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Pending: <span className="font-medium text-foreground tabular-nums">{stats.pendingOrders}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Revenue:{' '}
          <span className="font-medium text-foreground tabular-nums">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Customers: <span className="font-medium text-foreground tabular-nums">{stats.totalCustomers}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Products: <span className="font-medium text-foreground tabular-nums">{stats.activeProducts}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Low stock: <span className="font-medium text-foreground tabular-nums">{stats.lowStockItems}</span>
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-md border p-4 space-y-4">
          <div className="text-sm font-medium">Recent Orders</div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-foreground/70">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">${order.total}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
        </div>

        {/* Quick Actions */}
        <div className="rounded-md border p-4 space-y-4">
          <div className="text-sm font-medium">Quick Actions</div>
          <div className="space-y-3">
            {permissions.canManageProducts && (
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            )}

            {permissions.canManageOrders && (
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Process Orders
              </Button>
            )}

            {permissions.canManageInventory && (
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/inventory">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Manage Inventory
                </a>
              </Button>
            )}

            {permissions.canViewAnalytics && (
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </a>
              </Button>
            )}

            {permissions.canManageUsers && (
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Pending Orders Alert */}
      {stats.pendingOrders > 0 && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-md p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-800" />
            <div className="text-sm text-yellow-900">
              Action required: {stats.pendingOrders} pending orders
            </div>
          </div>
          <Button variant="outline" className="bg-white border-yellow-300 text-yellow-900 hover:bg-yellow-100">
            Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
