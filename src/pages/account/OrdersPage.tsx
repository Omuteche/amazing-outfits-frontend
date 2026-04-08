import { useState, useEffect } from 'react';
import { Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatKES } from '@/lib/formatCurrency';
import { format } from 'date-fns';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  paymentMethod?: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  _id: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await api.getMyOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'confirmed': return 'bg-blue-500/20 text-blue-500';
      case 'shipped': return 'bg-purple-500/20 text-purple-500';
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) return <div className="glass-card rounded-lg p-6 animate-pulse">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="glass-card rounded-lg p-8 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-display tracking-wider mb-2">NO ORDERS YET</h3>
        <p className="text-muted-foreground">Start shopping to see your orders here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="glass-card rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                <span className="font-bold">{formatKES(order.total)}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4 mr-1" /> View</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-display tracking-wider">ORDER {selectedOrder?.orderNumber}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between gap-4 text-sm">
                <div><p className="text-muted-foreground">Status</p><span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                <div><p className="text-muted-foreground">Date</p><p>{format(new Date(selectedOrder.createdAt), 'MMM d, yyyy h:mm a')}</p></div>
                <div><p className="text-muted-foreground">Payment</p><p className="capitalize">{selectedOrder.paymentMethod || 'N/A'}</p></div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden">
                        <img src={item.productImage || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">{item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatKES(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatKES(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatKES(selectedOrder.shippingFee || 0)}</span></div>
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatKES(selectedOrder.total)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
