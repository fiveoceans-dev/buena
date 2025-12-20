import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDb } from '@/data/mockData';

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
    <div className="space-y-8 text-black">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] text-black/60">
          Orders
        </span>
        <Button
          variant="link"
          className="h-auto p-0 text-[11px] uppercase tracking-[0.2em]"
          disabled
        >
          Export (soon)
        </Button>
      </div>

      <div className="text-xs text-black/60 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Orders: <span className="font-medium text-black tabular-nums">{totals.count}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Pending: <span className="font-medium text-black tabular-nums">{totals.pending}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Revenue:{' '}
          <span className="font-medium text-black tabular-nums">
            ${totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
      </div>

      <div className="border-t border-black/10">
        <Table className="text-xs">
          <TableHeader className="[&_tr]:border-black/10">
            <TableRow className="hover:bg-transparent border-black/10">
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Order</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Customer</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Total</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Delivery</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-black/10">
            {orders.map((o) => (
              <TableRow key={o.id} className="hover:bg-transparent">
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
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-black/60 py-8">
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

