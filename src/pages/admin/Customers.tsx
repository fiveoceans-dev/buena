import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDb } from '@/data/mockData';

export default function Customers() {
  const users = mockDb.getUsers();
  const customers = users.filter(u => u.role === 'customer');

  const active = customers.filter(c => c.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button variant="outline" disabled>
          Invite (soon)
        </Button>
      </div>

      <div className="text-sm text-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Total: <span className="font-medium text-foreground tabular-nums">{customers.length}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Active: <span className="font-medium text-foreground tabular-nums">{active}</span>
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.email}</TableCell>
                <TableCell>{`${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || '-'}</TableCell>
                <TableCell>
                  {c.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">active</Badge>
                  ) : (
                    <Badge variant="secondary">inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-foreground/70 py-8">
                  No customers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


