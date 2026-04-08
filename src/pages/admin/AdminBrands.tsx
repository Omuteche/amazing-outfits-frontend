import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logoUrl: '', description: '' });

  useEffect(() => { fetchBrands(); }, []);

  const fetchBrands = async () => {
    try {
      const data = await api.getBrands();
      setBrands(data || []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', logoUrl: '', description: '' });
    setEditing(null);
  };

  const openEdit = (brand: Brand) => {
    setEditing(brand);
    setFormData({ name: brand.name, slug: brand.slug, logoUrl: brand.logoUrl || '', description: brand.description || '' });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const brandData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      logoUrl: formData.logoUrl || null,
      description: formData.description || null,
    };

    try {
      if (editing) {
        await api.updateBrand(editing._id, brandData);
        toast.success('Brand updated');
      } else {
        await api.createBrand(brandData);
        toast.success('Brand created');
      }
      setDialogOpen(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save brand');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await api.deleteBrand(id);
      toast.success('Brand deleted');
      fetchBrands();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Helmet><title>Brands | Admin | AmazingOutfits</title></Helmet>
      <AdminLayout title="Brands">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{brands.length} brands</p>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="btn-neon"><Plus className="h-4 w-4 mr-2" /> Add Brand</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Brand</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                <div><Label>Slug</Label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
                <div><Label>Logo</Label><ImageUpload value={formData.logoUrl} onChange={(url) => setFormData({...formData, logoUrl: url})} folder="brands" /></div>
                <div><Label>Description</Label><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <Button type="submit" className="w-full btn-neon">{editing ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map(brand => (
              <div key={brand._id} className="glass-card rounded-lg p-4 text-center">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="h-16 mx-auto mb-3 object-contain" />
                ) : (
                  <div className="h-16 flex items-center justify-center text-2xl font-display mb-3">{brand.name[0]}</div>
                )}
                <h3 className="font-semibold">{brand.name}</h3>
                <div className="flex gap-2 justify-center mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(brand)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(brand._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
