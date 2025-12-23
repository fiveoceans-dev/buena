import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { mockDb } from '@/data/mockData';
import { AdminPage, AdminPageHeader, AdminSearch, AdminTabsList } from '@/components/admin/AdminPage';
import { AdminTable, AdminTableBody, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/admin/AdminTable';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Get inventory data
  const inventoryData = mockDb.getInventory();
  const lowStockItems = mockDb.getLowStockItems();

  // Get unique locations
  const locations = Array.from(new Set(inventoryData.map(item => item.warehouse_name)));

  // Filter inventory based on search and location
  const filteredInventory = inventoryData.filter(item => {
    const product = mockDb.getProductById(item.product_id);
    const matchesSearch = !searchTerm ||
      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get stock status
  const getStockStatus = (item: any) => {
    if (item.quantity_available === 0) {
      return { status: 'Out of Stock', tone: 'text-black' };
    }

    if (item.quantity_available <= item.min_stock_level) {
      return { status: 'Low Stock', tone: 'text-black/70' };
    }

    if (item.quantity_available >= item.max_stock_level) {
      return { status: 'Overstock', tone: 'text-black/50' };
    }

    return { status: 'In Stock', tone: 'text-black/40' };
  };

  // Check expiry status
  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;

    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return { status: 'Expired', tone: 'text-black' };
    }

    if (daysUntilExpiry <= 30) {
      return { status: `Expires in ${daysUntilExpiry} days`, tone: 'text-black/70' };
    }

    if (daysUntilExpiry <= 90) {
      return { status: `Expires in ${daysUntilExpiry} days`, tone: 'text-black/50' };
    }

    return null;
  };

  return (
    <AdminPage>
      <AdminPageHeader
        title="Inventory"
        actions={
          <Button
            variant="link"
            className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
          >
            Add Inventory Item
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <AdminTabsList
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'locations', label: 'By Location' },
            { value: 'alerts', label: 'Alerts' },
          ]}
        />

        <TabsContent value="overview" className="mt-6 space-y-4">
          <AdminSearch
            placeholder="Search products or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Product</AdminTableHead>
                <AdminTableHead>Location</AdminTableHead>
                <AdminTableHead>Stock</AdminTableHead>
                <AdminTableHead>Expiry</AdminTableHead>
                <AdminTableHead>Value</AdminTableHead>
                <AdminTableHead>Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
                {filteredInventory.map((item) => {
                  const product = mockDb.getProductById(item.product_id);
                  const stockStatus = getStockStatus(item);
                  const expiryStatus = getExpiryStatus(item.expiry_date);

                  return (
                    <AdminTableRow key={item.id}>
                      <TableCell className="px-2 py-3">
                        <div className="font-medium">{product?.name}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                          {item.batch_number}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-3">
                        <div className="font-medium">{item.warehouse_name}</div>
                        <div className="text-[10px] text-black/40">
                          {item.aisle} - {item.shelf}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-3">
                        <div className="font-medium tabular-nums">{item.quantity_available}</div>
                        <div className="text-[10px] text-black/40">
                          Min {item.min_stock_level} / Max {item.max_stock_level || '∞'}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-3">
                        {expiryStatus ? (
                          <span className={`text-[10px] uppercase tracking-[0.2em] ${expiryStatus.tone}`}>
                            {expiryStatus.status}
                          </span>
                        ) : (
                          <span className="text-black/30">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-3">
                        <div className="font-medium tabular-nums">
                          ${(item.quantity_available * (item.cost_price || 0)).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-black/40 tabular-nums">
                          @ ${(item.cost_price || 0).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-3">
                        <div className="flex items-center gap-4 text-xs text-black/60">
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-black/60 hover:text-black">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-black/60 hover:text-black">
                            Move
                          </Button>
                        </div>
                      </TableCell>
                    </AdminTableRow>
                  );
                })}
            </AdminTableBody>
          </AdminTable>
        </TabsContent>

        <TabsContent value="locations" className="mt-6 space-y-4">
          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Location</AdminTableHead>
                <AdminTableHead>Items</AdminTableHead>
                <AdminTableHead>Total Value</AdminTableHead>
                <AdminTableHead>Low Stock</AdminTableHead>
                <AdminTableHead>Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {locations.map(location => {
                const locationItems = inventoryData.filter(item => item.warehouse_name === location);
                const totalValue = locationItems.reduce((sum, item) => {
                  return sum + (item.quantity_available * (item.cost_price || 0));
                }, 0);
                const totalItemsByLocation = locationItems.reduce(
                  (sum, item) => sum + item.quantity_available,
                  0
                );
                const lowStockByLocation = locationItems.filter(
                  item => item.quantity_available <= item.min_stock_level
                ).length;

                return (
                  <AdminTableRow key={location}>
                    <TableCell className="px-2 py-3">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
                        {location}
                      </div>
                      <div className="mt-1 text-xs text-black/50">
                        {locationItems.length} items
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-3 tabular-nums">{totalItemsByLocation}</TableCell>
                    <TableCell className="px-2 py-3 tabular-nums">${totalValue.toLocaleString()}</TableCell>
                    <TableCell className="px-2 py-3 tabular-nums">{lowStockByLocation}</TableCell>
                    <TableCell className="px-2 py-3">
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px] uppercase tracking-[0.2em]">
                        View
                      </Button>
                    </TableCell>
                  </AdminTableRow>
                );
              })}
            </AdminTableBody>
          </AdminTable>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6 space-y-4">
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
              Low Stock
            </div>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Product</AdminTableHead>
                  <AdminTableHead>Location</AdminTableHead>
                  <AdminTableHead>Quantity</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {lowStockItems.map((item) => {
                  const product = mockDb.getProductById(item.product_id);
                  return (
                    <AdminTableRow key={item.id}>
                      <TableCell className="px-2 py-3 font-medium text-black">{product?.name}</TableCell>
                      <TableCell className="px-2 py-3">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                          {item.warehouse_name} • {item.aisle}-{item.shelf}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-3 text-black/60 tabular-nums">
                        {item.quantity_available} / {item.reorder_point} units
                      </TableCell>
                    </AdminTableRow>
                  );
                })}
                {lowStockItems.length === 0 && (
                  <AdminTableRow>
                    <TableCell colSpan={3} className="py-6 text-center text-black/60">
                      All items are sufficiently stocked.
                    </TableCell>
                  </AdminTableRow>
                )}
              </AdminTableBody>
            </AdminTable>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
              Expiry
            </div>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Product</AdminTableHead>
                  <AdminTableHead>Batch</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead>Quantity</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {inventoryData
                  .filter(item => item.expiry_date)
                  .filter(item => {
                    const expiry = getExpiryStatus(item.expiry_date);
                    return expiry && (expiry.status.includes('Expires in') || expiry.status === 'Expired');
                  })
                  .map((item) => {
                    const product = mockDb.getProductById(item.product_id);
                    const expiry = getExpiryStatus(item.expiry_date);
                    return (
                      <AdminTableRow key={item.id}>
                        <TableCell className="px-2 py-3 font-medium text-black">{product?.name}</TableCell>
                        <TableCell className="px-2 py-3">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                            {item.batch_number}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-3">
                          <div className={`text-[10px] uppercase tracking-[0.2em] ${expiry?.tone || 'text-black/50'}`}>
                            {expiry?.status}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-3 text-black/50 tabular-nums">
                          {item.quantity_available} units
                        </TableCell>
                      </AdminTableRow>
                    );
                  })}
                {inventoryData.filter(item => {
                  const expiry = getExpiryStatus(item.expiry_date);
                  return expiry && expiry.status.includes('Expires in');
                }).length === 0 && (
                  <AdminTableRow>
                    <TableCell colSpan={4} className="py-6 text-center text-black/60">
                      No items approaching expiry.
                    </TableCell>
                  </AdminTableRow>
                )}
              </AdminTableBody>
            </AdminTable>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
};

export default Inventory;
