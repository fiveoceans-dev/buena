import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { mockDb } from '@/data/mockData';
import { AdminPage, AdminPageHeader, AdminSearch, AdminTabsList } from '@/components/admin/AdminPage';
import { AdminTable, AdminTableBody, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/admin/AdminTable';

export default function Customers() {
  const users = mockDb.getUsers();
  const customers = users.filter(u => u.role === 'customer');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const query = searchTerm.toLowerCase();
    const name = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase();
    const email = c.email?.toLowerCase() ?? '';

    return !query || name.includes(query) || email.includes(query);
  });

  return (
    <AdminPage>
      <AdminPageHeader
        title="Customers"
        actions={
          <Button
            variant="link"
            className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
            disabled
          >
            Add Customer
          </Button>
        }
        secondaryActions={
          <Button
            variant="link"
            className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
            disabled
          >
            Send Invite
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <AdminTabsList tabs={[{ value: 'all', label: 'All' }]} />

        <TabsContent value="all" className="mt-6 space-y-4">
          <AdminSearch
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Email</AdminTableHead>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead>Created</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {filteredCustomers.map((c) => (
                <AdminTableRow key={c.id}>
                  <TableCell className="px-2 py-3 font-medium">{c.email}</TableCell>
                  <TableCell className="px-2 py-3">
                    {`${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || '-'}
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                      {c.isActive ? 'active' : 'inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                </AdminTableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <AdminTableRow>
                  <TableCell colSpan={4} className="text-center text-black/60 py-8">
                    No customers yet.
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
