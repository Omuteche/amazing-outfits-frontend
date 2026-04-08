import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Slider {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export default function AdminSliders() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Slider | null>(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonLink: '', sortOrder: '0', isActive: true });

  useEffect(() => { fetchSliders(); }, []);

  const fetchSliders = async () => {
    try {
      const data = await api.getSliders();
      setSliders(data || []);
    } catch (error) {
      console.error('Failed to fetch sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonLink: '', sortOrder: '0', isActive: true });
    setEditing(null);
  };

  const openEdit = (slider: Slider) => {
    setEditing(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || '',
      imageUrl: slider.imageUrl,
      buttonText: slider.buttonText || '',
      buttonLink: slider.buttonLink || '',
      sortOrder: String(slider.sortOrder || 0),
      isActive: slider.isActive ?? true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Please upload an image');
      return;
    }

    const sliderData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      imageUrl: formData.imageUrl,
      buttonText: formData.buttonText || null,
      buttonLink: formData.buttonLink || null,
      sortOrder: Number(formData.sortOrder),
      isActive: formData.isActive,
    };

    try {
      if (editing) {
        await api.updateSlider(editing._id, sliderData);
        toast.success('Slider updated');
      } else {
        await api.createSlider(sliderData);
        toast.success('Slider created');
      }
      setDialogOpen(false);
      resetForm();
      fetchSliders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save slider');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slider?')) return;
    try {
      await api.deleteSlider(id);
      toast.success('Slider deleted');
      fetchSliders();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Helmet><title>Sliders | Admin | AmazingOutfits</title></Helmet>
      <AdminLayout title="Sliders">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{sliders.length} sliders</p>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="btn-neon"><Plus className="h-4 w-4 mr-2" /> Add Slider</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Slider</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Title *</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
                <div><Label>Subtitle</Label><Input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
                <div><Label>Slider Image *</Label><ImageUpload value={formData.imageUrl} onChange={(url) => setFormData({...formData, imageUrl: url})} folder="sliders" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Button Text</Label><Input value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} /></div>
                  <div><Label>Button Link</Label><Input value={formData.buttonLink} onChange={e => setFormData({...formData, buttonLink: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Sort Order</Label><Input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: e.target.value})} /></div>
                  <div className="flex items-center gap-2 pt-6"><Switch checked={formData.isActive} onCheckedChange={v => setFormData({...formData, isActive: v})} /><Label>Active</Label></div>
                </div>
                <Button type="submit" className="w-full btn-neon">{editing ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="space-y-4">
            {sliders.map(slider => (
              <div key={slider._id} className="glass-card rounded-lg p-4 flex gap-4 items-center">
                <img src={slider.imageUrl} alt={slider.title} className="w-32 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{slider.title}</h3>
                  <p className="text-sm text-muted-foreground">{slider.subtitle}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${slider.isActive ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                      {slider.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-muted-foreground">Order: {slider.sortOrder}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(slider)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(slider._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
