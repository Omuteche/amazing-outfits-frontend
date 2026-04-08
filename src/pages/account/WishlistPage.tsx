import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatKES } from '@/lib/formatCurrency';
import { toast } from 'sonner';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
    isOnSale: boolean;
  };
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await api.removeFromWishlist(productId);
      setItems(items.filter(item => item.product._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <div className="glass-card rounded-lg p-6 animate-pulse">Loading wishlist...</div>;

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-lg p-8 text-center">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-display tracking-wider mb-2">YOUR WISHLIST IS EMPTY</h3>
        <p className="text-muted-foreground mb-4">Save items you love for later.</p>
        <Link to="/shop"><Button className="btn-neon">Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map(item => {
        const product = item.product;
        if (!product) return null;
        const isOnSale = product.isOnSale && product.salePrice;
        return (
          <div key={item._id} className="glass-card rounded-lg p-4 flex gap-4">
            <Link to={`/product/${product.slug}`} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
              <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${product.slug}`}><h3 className="font-semibold truncate hover:text-primary transition-colors">{product.name}</h3></Link>
              <div className="flex items-center gap-2 mt-1">
                {isOnSale ? (
                  <>
                    <span className="font-bold text-accent">{formatKES(product.salePrice!)}</span>
                    <span className="text-sm text-muted-foreground line-through">{formatKES(product.price)}</span>
                  </>
                ) : (
                  <span className="font-bold">{formatKES(product.price)}</span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Link to={`/product/${product.slug}`}><Button size="sm" className="btn-neon">View</Button></Link>
                <Button size="sm" variant="outline" onClick={() => removeItem(product._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
