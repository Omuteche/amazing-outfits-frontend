import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Smartphone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { formatKES } from '@/lib/formatCurrency';
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

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', county: '' });

  const shippingFee = total >= 5000 ? 0 : 300;
  const grandTotal = total + shippingFee;

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [user, items, navigate]);

  const fetchAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data || []);
      if (data && data.length > 0) {
        setSelectedAddress(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAddress = await api.createAddress(addressForm);
      toast.success('Address added');
      setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', county: '' });
      setShowAddAddress(false);
      fetchAddresses();
      setSelectedAddress(newAddress._id);
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);
    const address = addresses.find(a => a._id === selectedAddress);

    if (!address) {
      toast.error('Selected address not found. Please select a valid address.');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.productId,
          productName: item.name,
          productImage: item.image,
          price: item.salePrice ?? item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: address,
        paymentMethod,
        notes: '',
      };

      const order = await api.createOrder(orderData);

      // Initialize payment with Paystack
      const paymentData = await api.initializePayment({
        email: user.email,
        amount: grandTotal,
        orderId: order._id
      });

      // Redirect to Paystack payment page
      window.location.href = paymentData.authorization_url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | AmazingOutfits</title></Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-display tracking-wider mb-8">CHECKOUT</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-display tracking-wider mb-4">DELIVERY ADDRESS</h2>
                {addresses.length > 0 ? (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map(addr => (
                      <div key={addr._id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <RadioGroupItem value={addr._id} id={addr._id} />
                        <label htmlFor={addr._id} className="flex-1 cursor-pointer">
                          <p className="font-semibold">{addr.fullName}</p>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          <p className="text-sm text-muted-foreground">{addr.addressLine1}, {addr.city}</p>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-4">No addresses saved. Add one below to proceed with checkout.</p>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={addressForm.fullName} onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input id="addressLine1" value={addressForm.addressLine1} onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                        <Input id="addressLine2" value={addressForm.addressLine2} onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})} />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="county">County (Optional)</Label>
                        <Input id="county" value={addressForm.county} onChange={(e) => setAddressForm({...addressForm, county: e.target.value})} />
                      </div>
                      <Button type="submit" className="w-full">Add Address</Button>
                    </form>
                  </div>
                )}
              </div>
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-display tracking-wider mb-4">PAYMENT METHOD</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Smartphone className="h-5 w-5 text-primary" />
                    <label htmlFor="mpesa" className="flex-1 cursor-pointer">
                      <p className="font-semibold">M-Pesa</p>
                      <p className="text-sm text-muted-foreground">Pay via Paystack</p>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg mt-2">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <label htmlFor="card" className="flex-1 cursor-pointer">
                      <p className="font-semibold">Card Payment</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard via Paystack</p>
                    </label>
                  </div>
                </RadioGroup>
                {paymentMethod === 'mpesa' && (
                  <div className="mt-4">
                    <Label>M-Pesa Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="254712345678" className="input-urban mt-1" />
                  </div>
                )}
              </div>
            </div>
            <div className="glass-card rounded-lg p-6 h-fit sticky top-24">
              <h2 className="text-xl font-display tracking-wider mb-4">ORDER SUMMARY</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatKES((item.salePrice ?? item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatKES(total)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatKES(shippingFee)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border"><span>Total</span><span>{formatKES(grandTotal)}</span></div>
              </div>
              <Button className="w-full btn-neon mt-6" size="lg" onClick={handlePlaceOrder} disabled={loading || !selectedAddress}>
                {loading ? 'Processing...' : 'Place Order & Pay'}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
