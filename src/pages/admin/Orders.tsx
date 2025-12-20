import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDb } from '@/data/mockData';

const statusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">pending</Badge>;
    case 'confirmed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">confirmed</Badge>;
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">processing</Badge>;
    case 'shipped':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">shipped</Badge>;
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">delivered</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Orders() {
  const orders = mockDb.getOrders().slice().reverse();

  const totals = orders.reduce(
    (acc, o) => {
      acc.count += 1;
      acc.revenue += o.total;
      acc.pending += o.status === 'pending' ? 1 : 0;
      return acc;
    },
    { count: 0, revenue: 0, pending: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button variant="outline" disabled>
          Export (soon)
        </Button>
      </div>

      <div className="text-sm text-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Orders: <span className="font-medium text-foreground tabular-nums">{totals.count}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Pending: <span className="font-medium text-foreground tabular-nums">{totals.pending}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Revenue:{' '}
          <span className="font-medium text-foreground tabular-nums">
            ${totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.orderNumber}</TableCell>
                <TableCell>{o.customer?.email ?? o.customerId}</TableCell>
                <TableCell className="capitalize">{statusBadge(o.status)}</TableCell>
                <TableCell className="tabular-nums">${o.total.toFixed(2)}</TableCell>
                <TableCell>{o.deliveryDate ?? '-'}</TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-foreground/70 py-8">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


