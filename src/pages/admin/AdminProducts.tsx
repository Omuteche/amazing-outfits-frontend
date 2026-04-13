import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatKES } from '@/lib/formatCurrency';
import { toast } from 'sonner';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
    category?: { _id: string; name: string };
    brand?: { _id: string; name: string };
    categoryId?: string;
    brandId?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
}

interface Category { _id: string; name: string; }
interface Brand { _id: string; name: string; }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', price: '', salePrice: '', stock: '0',
    categoryId: '', brandId: '', images: [] as string[], sizes: '', colors: '',
    isFeatured: false, isNewArrival: false, isOnSale: false,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.getProducts({}), api.getCategories(), api.getBrands()
      ]);
      setProducts(productsRes.products || productsRes || []);
      setCategories(categoriesRes || []);
      setBrands(brandsRes || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', price: '', salePrice: '', stock: '0', categoryId: '', brandId: '', images: [], sizes: '', colors: '', isFeatured: false, isNewArrival: false, isOnSale: false });
    setEditingProduct(null);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, slug: product.slug, description: product.description || '',
      price: String(product.price), salePrice: product.salePrice ? String(product.salePrice) : '',
      stock: String(product.stock),
      categoryId: product.category?._id || product.categoryId || '', brandId: product.brand?._id || product.brandId || '',
      images: product.images || [], sizes: product.sizes?.join(', ') || '', colors: product.colors?.join(', ') || '',
      isFeatured: product.isFeatured || false, isNewArrival: product.isNewArrival || false, isOnSale: product.isOnSale || false,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description || null,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      stock: Number(formData.stock),
      category: formData.categoryId || null,
      brand: formData.brandId || null,
      images: formData.images,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
      colors: formData.colors ? formData.colors.split(',').map(s => s.trim()) : [],
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isOnSale: formData.isOnSale,
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, productData);
        toast.success('Product updated');
      } else {
        await api.createProduct(productData);
        toast.success('Product created');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <Helmet><title>Products | Admin | AmazingOutfits</title></Helmet>
      <AdminLayout title="Products">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{products.length} products</p>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="btn-neon"><Plus className="h-4 w-4 mr-2" /> Add Product</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                  <div><Label>Slug</Label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="auto-generated" /></div>
                </div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Price (KES) *</Label><Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required /></div>
                  <div><Label>Sale Price</Label><Input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} /></div>
                  <div><Label>Stock</Label><Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <Select value={formData.brandId} onValueChange={v => setFormData({...formData, brandId: v})}>
                      <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                      <SelectContent>{brands.map(b => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Product Images</Label><MultiImageUpload value={formData.images} onChange={(urls) => setFormData({...formData, images: urls})} folder="products" maxImages={5} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Sizes (comma-separated)</Label><Input value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} placeholder="36, 37, 38..." /></div>
                  <div><Label>Colors (comma-separated)</Label><Input value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} placeholder="Black, White..." /></div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={formData.isFeatured} onCheckedChange={v => setFormData({...formData, isFeatured: v})} /><Label>Featured</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.isNewArrival} onCheckedChange={v => setFormData({...formData, isNewArrival: v})} /><Label>New Arrival</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.isOnSale} onCheckedChange={v => setFormData({...formData, isOnSale: v})} /><Label>On Sale</Label></div>
                </div>
                <Button type="submit" className="w-full btn-neon">{editingProduct ? 'Update' : 'Create'} Product</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b border-border/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div><p className="font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.slug}</p></div>
                      </div>
                    </td>
                    <td className="py-4"><p>{formatKES(product.price)}</p>{product.salePrice && <p className="text-sm text-primary">{formatKES(product.salePrice)}</p>}</td>
                    <td className="py-4">{product.stock}</td>
                    <td className="py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isFeatured && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Featured</span>}
                        {product.isNewArrival && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">New</span>}
                        {product.isOnSale && <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded">Sale</span>}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
