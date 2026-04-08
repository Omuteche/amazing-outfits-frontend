import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { formatKES } from '@/lib/formatCurrency';
import { toast } from 'sonner';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: any;
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

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  processing: 'bg-blue-500/20 text-blue-500',
  shipped: 'bg-purple-500/20 text-purple-500',
  delivered: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getAdminOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <Helmet><title>Orders | Admin | AmazingOutfits</title></Helmet>
      <AdminLayout title="Orders">
        <p className="text-muted-foreground mb-6">{orders.length} orders</p>

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const address = order.shippingAddress;
                  return (
                    <tr key={order._id} className="border-b border-border/50">
                      <td className="py-4 font-mono text-sm">{order.orderNumber}</td>
                      <td className="py-4">{address?.fullName || 'N/A'}</td>
                      <td className="py-4">{formatKES(order.total)}</td>
                      <td className="py-4">
                        <Select value={order.status} onValueChange={(v) => updateStatus(order._id, v)}>
                          <SelectTrigger className="w-32">
                            <span className={`text-xs px-2 py-0.5 rounded ${statusColors[order.status] || ''}`}>{order.status}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right"><Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4" /></Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Order {selectedOrder?.orderNumber}</DialogTitle></DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Status</p><p className={`inline-block text-xs px-2 py-0.5 rounded ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</p></div>
                  <div><p className="text-muted-foreground">Payment</p><p>{selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}</p></div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Shipping Address</p>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-sm">
                      <p>{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.phone}</p>
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                      <p>{selectedOrder.shippingAddress.city}{selectedOrder.shippingAddress.county && `, ${selectedOrder.shippingAddress.county}`}</p>
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No address</p>}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map(item => (
                      <div key={item._id} className="flex gap-3 items-center">
                        {item.productImage && <img src={item.productImage} className="w-12 h-12 object-cover rounded" />}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`} x{item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatKES(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatKES(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{formatKES(selectedOrder.shippingFee || 0)}</span></div>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatKES(selectedOrder.total)}</span></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
}
