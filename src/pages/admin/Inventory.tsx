import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Clock,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
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
    const product = mockDb.getProductById(item.product_id);

    if (item.quantity_available === 0) {
      return { status: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: TrendingDown };
    }

    if (item.quantity_available <= item.min_stock_level) {
      return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }

    if (item.quantity_available >= item.max_stock_level) {
      return { status: 'Overstock', color: 'bg-blue-100 text-blue-800', icon: TrendingUp };
    }

    return { status: 'In Stock', color: 'bg-green-100 text-green-800', icon: Package };
  };

  // Check expiry status
  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;

    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    }

    if (daysUntilExpiry <= 30) {
      return { status: `Expires in ${daysUntilExpiry} days`, color: 'bg-orange-100 text-orange-800' };
    }

    if (daysUntilExpiry <= 90) {
      return { status: `Expires in ${daysUntilExpiry} days`, color: 'bg-yellow-100 text-yellow-800' };
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track stock levels, manage locations, and monitor inventory health
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Inventory Item
        </Button>
      </div>

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="space-y-3">
          {lowStockCount > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>{lowStockCount} items</strong> are running low on stock and need attention.
              </AlertDescription>
            </Alert>
          )}
          {outOfStockCount > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{outOfStockCount} items</strong> are completely out of stock.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Units across all locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total value at cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Below reorder point
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Items unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products or locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-48">
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
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                Detailed view of all inventory across locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => {
                      const product = mockDb.getProductById(item.product_id);
                      const stockStatus = getStockStatus(item);
                      const expiryStatus = getExpiryStatus(item.expiry_date);
                      const StatusIcon = stockStatus.icon;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product?.name}</div>
                              <div className="text-sm text-muted-foreground">{item.batch_number}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{item.warehouse_name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.aisle} - {item.shelf}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.quantity_available}</div>
                              <div className="text-sm text-muted-foreground">
                                Min: {item.min_stock_level} / Max: {item.max_stock_level || '∞'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {stockStatus.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {expiryStatus ? (
                              <Badge className={expiryStatus.color}>
                                <Clock className="h-3 w-3 mr-1" />
                                {expiryStatus.status}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${(item.quantity_available * (item.cost_price || 0)).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              @ ${(item.cost_price || 0).toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map(location => {
              const locationItems = inventoryData.filter(item => item.warehouse_name === location);
              const totalValue = locationItems.reduce((sum, item) => {
                return sum + (item.quantity_available * (item.cost_price || 0));
              }, 0);

              return (
                <Card key={location}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {location}
                    </CardTitle>
                    <CardDescription>
                      {locationItems.length} items • ${totalValue.toLocaleString()} value
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Items:</span>
                          <div className="font-medium">
                            {locationItems.reduce((sum, item) => sum + item.quantity_available, 0)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Low Stock:</span>
                          <div className="font-medium text-yellow-600">
                            {locationItems.filter(item => item.quantity_available <= item.min_stock_level).length}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-700">Low Stock Alerts</CardTitle>
              <CardDescription>
                Items that need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item) => {
                  const product = mockDb.getProductById(item.product_id);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <div className="font-medium">{product?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.warehouse_name} • {item.aisle}-{item.shelf}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-yellow-700">
                          {item.quantity_available} / {item.reorder_point} units
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reorder needed
                        </div>
                      </div>
                    </div>
                  );
                })}
                {lowStockItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4" />
                    <p>All items are sufficiently stocked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expiry Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700">Expiry Alerts</CardTitle>
              <CardDescription>
                Items approaching or past expiry date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                      <div key={item.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <div>
                            <div className="font-medium">{product?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Batch: {item.batch_number}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={expiry?.color}>
                            {expiry?.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>No items approaching expiry</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
