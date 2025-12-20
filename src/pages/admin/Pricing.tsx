import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Percent,
  Tag,
  Calendar,
  Users,
  Package,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Gift,
  Target
} from 'lucide-react';
import { mockDb } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('tiers');
  const [isCreateTierDialogOpen, setIsCreateTierDialogOpen] = useState(false);
  const [isCreatePromoDialogOpen, setIsCreatePromoDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  // Get data
  const pricingTiers = mockDb.getPricingTiers();
  const promotions = mockDb.getPromotions();

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

  const getPromotionTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return Percent;
      case 'fixed': return DollarSign;
      case 'buy_x_get_y': return Gift;
      case 'free_shipping': return Package;
      default: return Tag;
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing & Promotions</h1>
        </div>
      </div>

      {/* Single-line metrics */}
      <div className="text-sm text-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Tiers: <span className="font-medium text-foreground tabular-nums">{pricingTiers.length}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Promotions: <span className="font-medium text-foreground tabular-nums">{activePromotions.length}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Discount value:{' '}
          <span className="font-medium text-foreground tabular-nums">
            ${totalDiscountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Pricing Tiers</div>
              <Dialog open={isCreateTierDialogOpen} onOpenChange={setIsCreateTierDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
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
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Customer Type</TableHead>
                    <TableHead>Min Quantity</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingTiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell className="font-medium">{tier.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCustomerTypeLabel(tier.customer_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{tier.min_quantity}+ units</TableCell>
                      <TableCell>
                        {tier.discount_percentage > 0 ? (
                          <span className="text-green-600">{tier.discount_percentage}% off</span>
                        ) : (
                          <span className="text-blue-600">${tier.discount_amount} off</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tier.is_active ? 'default' : 'secondary'}>
                          {tier.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingTier(tier)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTier(tier.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

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

        <TabsContent value="promotions" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Promotions</div>
              <Dialog open={isCreatePromoDialogOpen} onOpenChange={setIsCreatePromoDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
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

            <div className="space-y-4">
              {promotions.map((promo) => {
                const TypeIcon = getPromotionTypeIcon(promo.type);
                return (
                  <div key={promo.id} className="border-l-4 border-l-blue-500 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TypeIcon className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{promo.name}</h3>
                          <p className="text-sm text-foreground/70">{promo.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{promo.type.replace('_', ' ')}</Badge>
                            <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                              {promo.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-sm text-foreground/70">
                              Used {promo.usage_count} times
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="font-medium">
                            {promo.type === 'percentage' ? `${promo.discount_value}% off` :
                             promo.type === 'fixed' ? `$${promo.discount_value} off` :
                             promo.type === 'free_shipping' ? 'Free Shipping' :
                             `${promo.discount_value} items free`}
                          </div>
                          <div className="text-sm text-foreground/70">
                            Valid until {new Date(promo.valid_until || promo.valid_from).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Switch
                            checked={promo.is_active}
                            onCheckedChange={(checked) => handleTogglePromotion(promo.id, checked)}
                          />
                          <Button variant="ghost" size="sm" onClick={() => setEditingPromo(promo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {promotions.length === 0 && (
                <div className="text-center py-8 text-foreground/70">
                  <Target className="h-12 w-12 mx-auto mb-4 text-foreground/30" />
                  <p>No promotional campaigns yet</p>
                </div>
              )}
            </div>
          </div>

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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-md border p-4 space-y-3">
              <div className="text-sm font-medium">Pricing Impact</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    23%
                  </div>
                  <p className="text-sm text-foreground/70">Avg Discount Rate</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    $1,450
                  </div>
                  <p className="text-sm text-foreground/70">Monthly Savings</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 space-y-3">
              <div className="text-sm font-medium">Promotion Performance</div>
              <div className="space-y-3">
                {activePromotions.slice(0, 3).map((promo) => (
                  <div key={promo.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{promo.name}</p>
                      <p className="text-xs text-foreground/70">{promo.usage_count} redemptions</p>
                    </div>
                    <Badge variant="outline">
                      {promo.type === 'percentage' ? `${promo.discount_value}%` :
                       promo.type === 'fixed' ? `$${promo.discount_value}` :
                       'Free'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
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

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
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

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {promotion ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </div>
    </form>
  );
};

export default Pricing;

