import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', county: '' });

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAddress(formData);
      toast.success('Address added');
      setDialogOpen(false);
      setFormData({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', county: '' });
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const setDefault = async (id: string) => {
    try {
      await api.setDefaultAddress(id);
      fetchAddresses();
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to set default');
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await api.deleteAddress(id);
      fetchAddresses();
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="glass-card rounded-lg p-6 animate-pulse">Loading addresses...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display tracking-wider">SAVED ADDRESSES</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="btn-neon"><Plus className="h-4 w-4 mr-2" /> Add Address</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display tracking-wider">ADD NEW ADDRESS</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required /></div>
                <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
              </div>
              <div><Label>Address Line 1</Label><Input value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} required /></div>
              <div><Label>Address Line 2 (Optional)</Label><Input value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City</Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required /></div>
                <div><Label>County</Label><Input value={formData.county} onChange={(e) => setFormData({ ...formData, county: e.target.value })} /></div>
              </div>
              <Button type="submit" className="w-full btn-neon">Save Address</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {addresses.length === 0 ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-display tracking-wider mb-2">NO ADDRESSES SAVED</h3>
          <p className="text-muted-foreground">Add a delivery address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map(address => (
            <div key={address._id} className={`glass-card rounded-lg p-4 ${address.isDefault ? 'border-primary' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{address.fullName}</p>
                    {address.isDefault && <span className="badge-new text-[10px]">DEFAULT</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <p className="text-sm text-muted-foreground mt-1">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</p>
                  <p className="text-sm text-muted-foreground">{address.city}{address.county && `, ${address.county}`}</p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && <Button variant="outline" size="sm" onClick={() => setDefault(address._id)}><Check className="h-4 w-4" /></Button>}
                  <Button variant="outline" size="sm" onClick={() => deleteAddress(address._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
