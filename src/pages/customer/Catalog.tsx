import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isInStock: boolean;
  tags: string[];
  description: string;
}

// Mock data - in real app this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans - Ethiopian',
    price: 24.99,
    originalPrice: 29.99,
    image: '/placeholder.svg',
    category: 'Beverages',
    rating: 4.8,
    reviewCount: 127,
    isInStock: true,
    tags: ['organic', 'fair-trade'],
    description: 'Single-origin Ethiopian coffee beans with notes of blueberry and chocolate.'
  },
  {
    id: '2',
    name: 'Organic Green Tea',
    price: 12.99,
    image: '/placeholder.svg',
    category: 'Beverages',
    rating: 4.6,
    reviewCount: 89,
    isInStock: true,
    tags: ['organic', 'caffeine-free'],
    description: 'Premium organic green tea leaves with antioxidant properties.'
  },
  {
    id: '3',
    name: 'Artisan Sourdough Bread',
    price: 8.99,
    image: '/placeholder.svg',
    category: 'Bakery',
    rating: 4.9,
    reviewCount: 203,
    isInStock: false,
    tags: ['artisan', 'fresh'],
    description: 'Handcrafted sourdough bread made with organic flour and natural starters.'
  },
  {
    id: '4',
    name: 'Grass-Fed Beef Ribeye',
    price: 32.99,
    image: '/placeholder.svg',
    category: 'Meat',
    rating: 4.7,
    reviewCount: 156,
    isInStock: true,
    tags: ['grass-fed', 'premium'],
    description: 'Premium grass-fed beef ribeye steak, aged for 21 days for maximum flavor.'
  },
  {
    id: '5',
    name: 'Organic Free-Range Eggs',
    price: 7.99,
    image: '/placeholder.svg',
    category: 'Dairy',
    rating: 4.5,
    reviewCount: 78,
    isInStock: true,
    tags: ['organic', 'free-range'],
    description: 'Dozen organic free-range eggs from pasture-raised hens.'
  },
  {
    id: '6',
    name: 'Seasonal Mixed Vegetables',
    price: 18.99,
    image: '/placeholder.svg',
    category: 'Produce',
    rating: 4.4,
    reviewCount: 92,
    isInStock: true,
    tags: ['seasonal', 'local'],
    description: 'Fresh seasonal mixed vegetables from local organic farms.'
  }
];

const categories = ['All', 'Beverages', 'Bakery', 'Dairy', 'Meat', 'Produce', 'Pantry'];
const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'price-high', label: 'Price (High to Low)' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products] = useState<Product[]>(mockProducts);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Get unique tags from all products
  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesTags = selectedTags.length === 0 ||
                         selectedTags.some(tag => product.tags.includes(tag));
      const matchesStock = !inStockOnly || product.isInStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesTags && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getStatusLabel = (product: Product) => {
    // Minimal mock logic: if not in stock, treat as back order for now
    // (we can wire real inventory states later)
    if (product.isInStock) return 'IN STOCK';
    return 'BACK ORDER';
  };

  const canOrder = (product: Product) => getStatusLabel(product) !== 'OUT OF STOCK';

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group">
      <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-36 sm:h-44 md:h-48 object-cover bg-white"
          />
        </div>

      <div className="mt-2">
        <Link to={`/customer/product/${product.id}`}>
          {/* Reserve space for exactly two lines (even for short names) */}
          <div className="mt-2 text-[12px] font-medium leading-4 text-black line-clamp-2 min-h-8">
            {product.name}
          </div>
        </Link>

        {/* Price / Status / Order (same width as image) */}
        <div className="mt-2 w-full flex items-center justify-between text-[10px] leading-4 text-black whitespace-nowrap">
          <span className="tabular-nums">${product.price}</span>
          <span className="text-black/70">{getStatusLabel(product)}</span>
          <span className={canOrder(product) ? 'underline underline-offset-2' : 'opacity-40'}>
            ORDER
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 bg-white">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Categories row (horizontal, above search) */}
        <div className="overflow-x-auto">
          <div className="flex items-center gap-4 whitespace-nowrap text-[12px] text-black">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? 'underline underline-offset-4'
                    : 'hover:underline underline-offset-4 text-black/70'
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

          {/* Search and Sort */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-0 top-3 h-4 w-4 text-black/40" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-6 border-0 shadow-none rounded-[5px] bg-gray-100 h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-0 shadow-none rounded-[5px] px-3 bg-gray-100 h-9 text-xs focus:ring-0 focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-black/60">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Catalog;
