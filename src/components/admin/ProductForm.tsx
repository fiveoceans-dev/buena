import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id?: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  image?: string;
  description?: string;
  tags?: string[];
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const categories = [
  'Beverages',
  'Bakery',
  'Dairy',
  'Produce',
  'Meat & Seafood',
  'Pantry',
  'Frozen',
  'Household',
  'Personal Care'
];

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    sku: '',
    price: 0,
    category: '',
    stock: 0,
    status: 'active',
    description: '',
    tags: []
  });

  const [images, setImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImages(product.image ? [product.image] : []);
    }
  }, [product]);

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload to a service like Cloudinary, AWS S3, etc.
    // For now, we'll simulate with placeholder images
    const newImages = Array.from(files).map(() => '/placeholder.svg');
    setImages(prev => [...prev, ...newImages]);

    toast({
      title: 'Images uploaded',
      description: `${files.length} image(s) uploaded successfully.`
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.sku || formData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const productData = {
        ...formData,
        image: images[0] // Use first image as main product image
      };

      onSubmit(productData);

      toast({
        title: 'Success',
        description: `Product ${product ? 'updated' : 'created'} successfully.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
          Basic Information
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
          Images
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-24 object-cover border border-black/10"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-[10px] uppercase tracking-[0.2em] text-black/50 hover:text-black inline-flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <label className="w-full h-24 border border-black/10 flex items-center justify-center cursor-pointer hover:border-black/30">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 inline-flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Add Image
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
          Tags
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button
            type="button"
            onClick={addTag}
            variant="link"
            className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 border border-black/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-black/60"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-black/40 hover:text-black"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-black/60">
          Status
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) =>
              handleInputChange('status', checked ? 'active' : 'inactive')
            }
          />
          <Label htmlFor="active">Active (visible to customers)</Label>
        </div>
      </div>

      {/* Actions */}
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
          disabled={isSubmitting}
          variant="link"
          className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black"
        >
          {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
