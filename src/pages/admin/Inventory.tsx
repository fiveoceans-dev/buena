import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { mockDb } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

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
    const matchesLocation = selectedLocation === 'all' || item.warehouse_name === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  // Calculate inventory metrics
  const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity_available, 0);
  const totalValue = inventoryData.reduce((sum, item) => {
    const product = mockDb.getProductById(item.product_id);
    return sum + (item.quantity_available * (product?.basePrice || 0));
  }, 0);
  const lowStockCount = lowStockItems.length;
  const outOfStockCount = inventoryData.filter(item => item.quantity_available === 0).length;

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

  const handleUpdateStock = (inventoryId: string, newQuantity: number) => {
    const updated = mockDb.updateInventoryQuantity(inventoryId, newQuantity);
    if (updated) {
      toast({
        title: 'Stock updated',
        description: 'Inventory quantity has been updated successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update inventory.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8 text-black">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 whitespace-nowrap text-[12px] text-black">
          <span className="text-[11px] uppercase tracking-[0.2em] text-black/60">
            Inventory
          </span>
          <Button
            variant="link"
            className="h-auto p-0 text-[11px] uppercase tracking-[0.2em]"
          >
            Add Inventory Item
          </Button>
        </div>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="border-y border-black/10 py-3 text-xs text-black/60 flex flex-wrap items-center gap-4">
          {lowStockCount > 0 && (
            <span>
              Low stock: <span className="text-black tabular-nums">{lowStockCount}</span>
            </span>
          )}
          {outOfStockCount > 0 && (
            <span>
              Out of stock: <span className="text-black tabular-nums">{outOfStockCount}</span>
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-black/60 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Items: <span className="font-medium text-black tabular-nums">{totalItems.toLocaleString()}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Value:{' '}
          <span className="font-medium text-black tabular-nums">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Low stock: <span className="font-medium text-black tabular-nums">{lowStockCount}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Out of stock: <span className="font-medium text-black tabular-nums">{outOfStockCount}</span>
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto bg-transparent p-0 text-[12px] text-black/60 gap-4">
          <TabsTrigger
            value="overview"
            className="px-0 py-0 text-[11px] uppercase tracking-[0.2em] data-[state=active]:text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="locations"
            className="px-0 py-0 text-[11px] uppercase tracking-[0.2em] data-[state=active]:text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:shadow-none"
          >
            By Location
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="px-0 py-0 text-[11px] uppercase tracking-[0.2em] data-[state=active]:text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:shadow-none"
          >
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-0 top-3 h-4 w-4 text-black/40" />
              <Input
                placeholder="Search products or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-6 border-0 shadow-none rounded-[5px] bg-gray-100 h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48 border-0 shadow-none rounded-[5px] px-3 bg-gray-100 h-9 text-xs focus:ring-0 focus-visible:ring-0">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-black/10">
            <Table className="text-xs">
              <TableHeader className="[&_tr]:border-black/10">
                <TableRow className="hover:bg-transparent border-black/10">
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Product</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Location</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Stock</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Expiry</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Value</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-black/10">
                {filteredInventory.map((item) => {
                  const product = mockDb.getProductById(item.product_id);
                  const stockStatus = getStockStatus(item);
                  const expiryStatus = getExpiryStatus(item.expiry_date);

                  return (
                    <TableRow key={item.id} className="hover:bg-transparent">
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
                        <span className={`text-[10px] uppercase tracking-[0.2em] ${stockStatus.tone}`}>
                          {stockStatus.status}
                        </span>
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
                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em]">
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            Move
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="border-t border-black/10 divide-y divide-black/10">
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
                <div key={location} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
                      {location}
                    </div>
                    <div className="mt-1 text-xs text-black/50">
                      {locationItems.length} items • ${totalValue.toLocaleString()} value
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-black/60">
                    <span>
                      Total: <span className="text-black tabular-nums">{totalItemsByLocation}</span>
                    </span>
                    <span>
                      Low stock: <span className="text-black tabular-nums">{lowStockByLocation}</span>
                    </span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px] uppercase tracking-[0.2em]">
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6 space-y-8">
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
              Low Stock
            </div>
            <div className="divide-y divide-black/10 text-xs">
              {lowStockItems.map((item) => {
                const product = mockDb.getProductById(item.product_id);
                return (
                  <div key={item.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-black">{product?.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        {item.warehouse_name} • {item.aisle}-{item.shelf}
                      </div>
                    </div>
                    <div className="text-black/60 tabular-nums">
                      {item.quantity_available} / {item.reorder_point} units
                    </div>
                  </div>
                );
              })}
              {lowStockItems.length === 0 && (
                <div className="py-6 text-black/60">
                  All items are sufficiently stocked.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
              Expiry
            </div>
            <div className="divide-y divide-black/10 text-xs">
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
                    <div key={item.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-black">{product?.name}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Batch {item.batch_number}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] uppercase tracking-[0.2em] ${expiry?.tone || 'text-black/50'}`}>
                          {expiry?.status}
                        </div>
                        <div className="text-black/50 tabular-nums">
                          {item.quantity_available} units
                        </div>
                      </div>
                    </div>
                  );
                })}
              {inventoryData.filter(item => {
                const expiry = getExpiryStatus(item.expiry_date);
                return expiry && expiry.status.includes('Expires in');
              }).length === 0 && (
                <div className="py-6 text-black/60">
                  No items approaching expiry.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
