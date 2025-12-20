import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Edit, Trash2, Eye, Package } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  image?: string;
}

// Mock data - in real app this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    sku: 'CFB-001',
    price: 24.99,
    category: 'Beverages',
    stock: 150,
    status: 'active',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Organic Green Tea',
    sku: 'TEA-002',
    price: 12.99,
    category: 'Beverages',
    stock: 89,
    status: 'active',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Artisan Bread Loaf',
    sku: 'BRD-003',
    price: 8.99,
    category: 'Bakery',
    stock: 0,
    status: 'active',
    image: '/placeholder.svg'
  }
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (productData: any) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
      status: 'active'
    };
    setProducts([...products, newProduct]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateProduct = (productData: any) => {
    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...productData }
          : p
      ));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', tone: 'text-black' };
    if (stock < 10) return { label: 'Low Stock', tone: 'text-black/70' };
    return { label: 'In Stock', tone: 'text-black/40' };
  };

  return (
    <div className="space-y-8 text-black">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 whitespace-nowrap text-[12px] text-black">
          <span className="text-[11px] uppercase tracking-[0.2em] text-black/60">
            Products
          </span>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="h-auto p-0 text-[11px] uppercase tracking-[0.2em]"
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your catalog
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                onSubmit={handleCreateProduct}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Single-line metrics */}
      <div className="text-xs text-black/60 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Total: <span className="font-medium text-black tabular-nums">{products.length}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Active:{' '}
          <span className="font-medium text-black tabular-nums">
            {products.filter(p => p.status === 'active').length}
          </span>
        </span>
        <span aria-hidden="true">•</span>
        <span>
          Low stock:{' '}
          <span className="font-medium text-black tabular-nums">
            {products.filter(p => p.stock < 10).length}
          </span>
        </span>
      </div>

      {/* Search + Table (no cards) */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-0 top-3 h-4 w-4 text-black/40" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-6 border-0 shadow-none rounded-[5px] bg-gray-100 h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="border-t border-black/10">
          <Table className="text-xs">
            <TableHeader className="[&_tr]:border-black/10">
              <TableRow className="hover:bg-transparent border-black/10">
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Product</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">SKU</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Category</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Price</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Stock</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Status</TableHead>
                <TableHead className="w-[70px] text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:border-black/10">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <TableRow key={product.id} className="hover:bg-transparent">
                    <TableCell className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className="h-8 w-8 object-cover bg-gray-100"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-3 font-mono">{product.sku}</TableCell>
                    <TableCell className="px-2 py-3">{product.category}</TableCell>
                    <TableCell className="px-2 py-3 tabular-nums">${product.price}</TableCell>
                    <TableCell className="px-2 py-3">
                      <div className="flex flex-col text-[10px] uppercase tracking-[0.2em]">
                        <span className="text-black tabular-nums">{product.stock}</span>
                        <span className={stockStatus.tone}>{stockStatus.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-black/20" />
            <h3 className="mt-2 text-sm font-semibold text-black/70">No products found</h3>
            <p className="mt-1 text-sm text-black/50">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first product.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
