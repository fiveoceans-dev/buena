import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { mockDb } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { AdminPage, AdminPageHeader, AdminSearch, AdminTabsList } from '@/components/admin/AdminPage';
import { AdminTable, AdminTableBody, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/admin/AdminTable';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('tiers');
  const [isCreateTierDialogOpen, setIsCreateTierDialogOpen] = useState(false);
  const [isCreatePromoDialogOpen, setIsCreatePromoDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get data
  const pricingTiers = mockDb.getPricingTiers();
  const promotions = mockDb.getPromotions();

  const filteredTiers = pricingTiers.filter((tier) => {
    const query = searchTerm.toLowerCase();
    const name = tier.name?.toLowerCase() ?? '';
    const type = tier.customer_type?.toLowerCase() ?? '';

    return !query || name.includes(query) || type.includes(query);
  });

  const filteredPromotions = promotions.filter((promo) => {
    const query = searchTerm.toLowerCase();
    const name = promo.name?.toLowerCase() ?? '';
    const description = promo.description?.toLowerCase() ?? '';
    const type = promo.type?.toLowerCase() ?? '';

    return !query || name.includes(query) || description.includes(query) || type.includes(query);
  });

  // Calculate pricing impact
  const activePromotions = promotions.filter(p => p.is_active);
  const totalDiscountValue = activePromotions.reduce((sum, promo) => {
    // Simplified calculation - in real app would calculate actual discount value
    return sum + (promo.discount_value * promo.usage_count);
  }, 0);

  const handleCreateTier = (tierData: any) => {
    // In real app, this would call mockDb.createPricingTier()
    console.log('Creating pricing tier:', tierData);
    toast({
      title: 'Pricing tier created',
      description: 'New pricing tier has been added successfully.',
    });
    setIsCreateTierDialogOpen(false);
  };

  const handleUpdateTier = (tierData: any) => {
    console.log('Updating pricing tier:', tierData);
    toast({
      title: 'Pricing tier updated',
      description: 'Pricing tier has been updated successfully.',
    });
    setEditingTier(null);
  };

  const handleDeleteTier = (tierId: string) => {
    console.log('Deleting pricing tier:', tierId);
    toast({
      title: 'Pricing tier deleted',
      description: 'Pricing tier has been removed.',
    });
  };

  const handleCreatePromotion = (promoData: any) => {
    console.log('Creating promotion:', promoData);
    toast({
      title: 'Promotion created',
      description: 'New promotional campaign has been added.',
    });
    setIsCreatePromoDialogOpen(false);
  };

  const handleUpdatePromotion = (promoData: any) => {
    console.log('Updating promotion:', promoData);
    toast({
      title: 'Promotion updated',
      description: 'Promotional campaign has been updated.',
    });
    setEditingPromo(null);
  };

  const handleTogglePromotion = (promoId: string, isActive: boolean) => {
    console.log('Toggling promotion:', promoId, isActive);
    toast({
      title: isActive ? 'Promotion activated' : 'Promotion deactivated',
      description: `Promotion has been ${isActive ? 'activated' : 'deactivated'}.`,
    });
  };

  const getCustomerTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'business': return 'Business';
      case 'vip': return 'VIP';
      case 'bulk': return 'Bulk';
      default: return type;
    }
  };

  return (
    <AdminPage>
      <AdminPageHeader
        title="Prices"
        actions={
          <Dialog open={isCreateTierDialogOpen} onOpenChange={setIsCreateTierDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
              >
                Add Tier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Pricing Tier</DialogTitle>
                <DialogDescription>
                  Set up a new pricing tier for customer segmentation
                </DialogDescription>
              </DialogHeader>
              <PricingTierForm onSubmit={handleCreateTier} onCancel={() => setIsCreateTierDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <AdminTabsList
          tabs={[
            { value: 'tiers', label: 'Pricing Tiers' },
            { value: 'promotions', label: 'Promotions' },
          ]}
        />

        <TabsContent value="tiers" className="mt-6 space-y-4">
          <AdminSearch
            placeholder="Search tiers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableHead>Customer</AdminTableHead>
                <AdminTableHead>Min Qty</AdminTableHead>
                <AdminTableHead>Discount</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead>Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
                {filteredTiers.map((tier) => (
                  <AdminTableRow key={tier.id}>
                    <TableCell className="px-2 py-3 font-medium">{tier.name}</TableCell>
                    <TableCell className="px-2 py-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                        {getCustomerTypeLabel(tier.customer_type)}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-3">{tier.min_quantity}+ units</TableCell>
                    <TableCell className="px-2 py-3">
                      {tier.discount_percentage > 0 ? (
                        <span className="text-black">{tier.discount_percentage}% off</span>
                      ) : (
                        <span className="text-black">${tier.discount_amount} off</span>
                      )}
                    </TableCell>
                    <TableCell className="px-2 py-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                        {tier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-3">
                      <div className="flex items-center gap-4 text-xs text-black/60">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-black/60 hover:text-black"
                          onClick={() => setEditingTier(tier)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-black/60 hover:text-black"
                          onClick={() => handleDeleteTier(tier.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </AdminTableRow>
                ))}
                {filteredTiers.length === 0 && (
                  <AdminTableRow>
                    <TableCell colSpan={6} className="text-center text-black/60 py-8">
                      No pricing tiers yet.
                    </TableCell>
                  </AdminTableRow>
                )}
            </AdminTableBody>
          </AdminTable>

          {/* Edit Tier Dialog */}
          <Dialog open={!!editingTier} onOpenChange={() => setEditingTier(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Pricing Tier</DialogTitle>
                <DialogDescription>
                  Update pricing tier settings
                </DialogDescription>
              </DialogHeader>
              {editingTier && (
                <PricingTierForm
                  tier={editingTier}
                  onSubmit={handleUpdateTier}
                  onCancel={() => setEditingTier(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="promotions" className="mt-6 space-y-4">
          <AdminSearch
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center justify-end">
            <Dialog open={isCreatePromoDialogOpen} onOpenChange={setIsCreatePromoDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
                >
                  Create Promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Promotion</DialogTitle>
                  <DialogDescription>
                    Set up a new promotional campaign
                  </DialogDescription>
                </DialogHeader>
                <PromotionForm onSubmit={handleCreatePromotion} onCancel={() => setIsCreatePromoDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableHead>Type</AdminTableHead>
                <AdminTableHead>Value</AdminTableHead>
                <AdminTableHead>Usage</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead>Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {filteredPromotions.map((promo) => (
                <AdminTableRow key={promo.id}>
                  <TableCell className="px-2 py-3">
                    <div className="font-medium text-black">{promo.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      {promo.type.replace('_', ' ')}
                    </div>
                    <div className="mt-1 text-black/50">{promo.description}</div>
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                      {promo.type.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    {promo.type === 'percentage' ? `${promo.discount_value}% off` :
                     promo.type === 'fixed' ? `$${promo.discount_value} off` :
                     promo.type === 'free_shipping' ? 'Free Shipping' :
                     `${promo.discount_value} items free`}
                  </TableCell>
                  <TableCell className="px-2 py-3">Used {promo.usage_count} times</TableCell>
                  <TableCell className="px-2 py-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-black/50">
                      Valid until {new Date(promo.valid_until || promo.valid_from).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em]">
                      <Switch
                        checked={promo.is_active}
                        onCheckedChange={(checked) => handleTogglePromotion(promo.id, checked)}
                      />
                      <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => setEditingPromo(promo)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </AdminTableRow>
              ))}

              {filteredPromotions.length === 0 && (
                <AdminTableRow>
                  <TableCell colSpan={6} className="text-center text-black/60 py-8">
                    No promotional campaigns yet.
                  </TableCell>
                </AdminTableRow>
              )}
            </AdminTableBody>
          </AdminTable>

          {/* Edit Promotion Dialog */}
          <Dialog open={!!editingPromo} onOpenChange={() => setEditingPromo(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Promotion</DialogTitle>
                <DialogDescription>
                  Update promotional campaign settings
                </DialogDescription>
              </DialogHeader>
              {editingPromo && (
                <PromotionForm
                  promotion={editingPromo}
                  onSubmit={handleUpdatePromotion}
                  onCancel={() => setEditingPromo(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

      </Tabs>
    </AdminPage>
  );
};

// Pricing Tier Form Component
const PricingTierForm = ({ tier, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: tier?.name || '',
    customer_type: tier?.customer_type || 'individual',
    min_quantity: tier?.min_quantity || 1,
    discount_percentage: tier?.discount_percentage || 0,
    discount_amount: tier?.discount_amount || null,
    is_active: tier?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tier Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Business Bulk Discount"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_type">Customer Type</Label>
          <Select
            value={formData.customer_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, customer_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="bulk">Bulk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_quantity">Minimum Quantity</Label>
        <Input
          id="min_quantity"
          type="number"
          min="1"
          value={formData.min_quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, min_quantity: parseInt(e.target.value) || 1 }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
          <Input
            id="discount_percentage"
            type="number"
            min="0"
            max="100"
            value={formData.discount_percentage}
            onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount_amount">Fixed Discount Amount ($)</Label>
          <Input
            id="discount_amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.discount_amount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: parseFloat(e.target.value) || null }))}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="link"
          onClick={onCancel}
          className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="link"
          className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black"
        >
          {tier ? 'Update Tier' : 'Create Tier'}
        </Button>
      </div>
    </form>
  );
};

// Promotion Form Component
const PromotionForm = ({ promotion, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    description: promotion?.description || '',
    type: promotion?.type || 'percentage',
    discount_value: promotion?.discount_value || 0,
    min_purchase_amount: promotion?.min_purchase_amount || null,
    applicable_products: promotion?.applicable_products || [],
    applicable_categories: promotion?.applicable_categories || [],
    customer_types: promotion?.customer_types || ['individual'],
    valid_from: promotion?.valid_from || new Date().toISOString().split('T')[0],
    valid_until: promotion?.valid_until?.split('T')[0] || '',
    is_active: promotion?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Promotion Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., New Year Special"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Discount Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage Off</SelectItem>
              <SelectItem value="fixed">Fixed Amount Off</SelectItem>
              <SelectItem value="buy_x_get_y">Buy X Get Y Free</SelectItem>
              <SelectItem value="free_shipping">Free Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Promotion description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_value">Discount Value</Label>
          <Input
            id="discount_value"
            type="number"
            min="0"
            step={formData.type === 'percentage' ? '1' : '0.01'}
            value={formData.discount_value}
            onChange={(e) => setFormData(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
            placeholder={formData.type === 'percentage' ? '20' : '10.00'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_purchase">Min Purchase Amount</Label>
          <Input
            id="min_purchase"
            type="number"
            min="0"
            step="0.01"
            value={formData.min_purchase_amount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, min_purchase_amount: parseFloat(e.target.value) || null }))}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valid_from">Valid From</Label>
          <Input
            id="valid_from"
            type="date"
            value={formData.valid_from}
            onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valid_until">Valid Until</Label>
          <Input
            id="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="link"
          onClick={onCancel}
          className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="link"
          className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black"
        >
          {promotion ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </div>
    </form>
  );
};

export default Pricing;
