import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatKES } from '@/lib/formatCurrency';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Shopping Cart | AmazingOutfits</title></Helmet>
        <Layout>
          <div className="container mx-auto px-4 py-16 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-display tracking-wider mb-4">YOUR CART IS EMPTY</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link to="/shop"><Button className="btn-neon">Continue Shopping<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </Layout>
      </>
    );
  }

  const shippingFee = total >= 5000 ? 0 : 300;
  const grandTotal = total + shippingFee;

  return (
    <>
      <Helmet><title>{`Shopping Cart (${items.length}) | AmazingOutfits`}</title></Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-display tracking-wider mb-8">SHOPPING CART</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => {
                const price = item.salePrice ?? item.price;
                return (
                  <div key={item.id} className="glass-card rounded-lg p-4 flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Size: {item.size} • Color: {item.color}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{formatKES(price * item.quantity)}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">Clear Cart</Button>
            </div>
            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-display tracking-wider mb-6">ORDER SUMMARY</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatKES(total)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatKES(shippingFee)}</span></div>
                  {shippingFee > 0 && <p className="text-xs text-primary">Add {formatKES(5000 - total)} more for free shipping!</p>}
                  <div className="border-t border-border pt-4 flex justify-between text-lg font-bold"><span>Total</span><span>{formatKES(grandTotal)}</span></div>
                </div>
                <Link to={user ? '/checkout' : '/auth?redirect=/checkout'}>
                  <Button className="w-full btn-neon" size="lg">{user ? 'Proceed to Checkout' : 'Sign in to Checkout'}<ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
                <Link to="/shop" className="block text-center mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
