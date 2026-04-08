import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { formatKES } from '@/lib/formatCurrency';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Cart | AmazingOutfits</title></Helmet>
        <Layout>
          <div className="container mx-auto px-4 py-16 text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl md:text-4xl font-display tracking-wider mb-4">YOUR CART IS EMPTY</h1>
            <p className="text-muted-foreground mb-8">Add some amazing outfits to get started!</p>
            <Button asChild className="btn-neon">
              <Link to="/shop">CONTINUE SHOPPING</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Cart ({itemCount}) | AmazingOutfits</title></Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-display tracking-wider mb-8">SHOPPING CART</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="glass-card rounded-lg p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                        <p>Price: {formatKES(item.salePrice ?? item.price)}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {formatKES((item.salePrice ?? item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-lg p-6 h-fit sticky top-24">
              <h2 className="text-xl font-display tracking-wider mb-4">ORDER SUMMARY</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Items ({itemCount})</span>
                  <span>{formatKES(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatKES(total)}</span>
                </div>
              </div>
              <Button
                className="w-full btn-neon"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                PROCEED TO CHECKOUT
              </Button>
              <Button
                variant="outline"
                className="w-full mt-4"
                asChild
              >
                <Link to="/shop">CONTINUE SHOPPING</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
