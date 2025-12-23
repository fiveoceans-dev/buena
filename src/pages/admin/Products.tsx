import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Package } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { AdminPage, AdminPageHeader, AdminSearch, AdminTabsList } from '@/components/admin/AdminPage';
import { AdminTable, AdminTableBody, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/admin/AdminTable';

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


  return (
    <AdminPage>
      <AdminPageHeader
        title="Products"
        actions={
          <>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
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
            <Button
              variant="link"
              className="h-auto p-0 text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70"
              disabled
            >
              Add Category
            </Button>
          </>
        }
      />

      <Tabs defaultValue="all">
        <AdminTabsList tabs={[{ value: 'all', label: 'All' }]} />

        <TabsContent value="all" className="mt-6 space-y-4">
          <AdminSearch
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead className="w-16">Image</AdminTableHead>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableHead>SKU</AdminTableHead>
                <AdminTableHead>Category</AdminTableHead>
                <AdminTableHead>Price</AdminTableHead>
                <AdminTableHead>Stock</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead className="w-[70px]">Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
                {filteredProducts.map((product) => {
                  return (
                    <AdminTableRow key={product.id} className="h-14">
                      <TableCell className="px-2 py-0">
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className="h-full w-12 object-cover bg-gray-100"
                        />
                      </TableCell>
                      <TableCell className="px-2 py-0">
                        <span className="font-medium leading-tight">{product.name}</span>
                      </TableCell>
                      <TableCell className="px-2 py-3 font-mono">{product.sku}</TableCell>
                      <TableCell className="px-2 py-3">{product.category}</TableCell>
                      <TableCell className="px-2 py-3 tabular-nums">${product.price}</TableCell>
                      <TableCell className="px-2 py-3">
                        <span className="text-black tabular-nums">{product.stock}</span>
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
                    </AdminTableRow>
                  );
                })}
            </AdminTableBody>
          </AdminTable>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-black/20" />
              <h3 className="mt-2 text-sm font-semibold text-black/70">No products found</h3>
              <p className="mt-1 text-sm text-black/50">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first product.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
    </AdminPage>
  );
};

export default Products;
