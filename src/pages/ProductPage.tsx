import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

import api from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatKES } from '@/lib/formatCurrency';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  isOnSale: boolean;
  isNewArrival: boolean;
  brand?: { name: string };
  categoryId?: string;
}

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProduct(slug!);
      if (!data) {
        navigate('/shop');
        return;
      }
      setProduct(data);
      
      if (user) {
        try {
          const wishlistData = await api.getWishlist();
          setIsInWishlist(wishlistData.some((w: any) => (w.product?._id || w.productId) === data._id));
        } catch {}
      }
    } catch (error) {
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0] || '/placeholder.svg',
      size: selectedSize || 'N/A',
      color: selectedColor || 'N/A',
      quantity,
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    // Clear cart and add the current item
    clearCart();
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0] || '/placeholder.svg',
      size: selectedSize || 'N/A',
      color: selectedColor || 'N/A',
      quantity,
    });
    navigate('/checkout');
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }
    if (!product) return;
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(product._id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.addToWishlist(product._id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-secondary animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-secondary animate-pulse rounded w-3/4" />
              <div className="h-6 bg-secondary animate-pulse rounded w-1/2" />
              <div className="h-24 bg-secondary animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const isOnSale = product.isOnSale && product.salePrice;
  const currentPrice = isOnSale ? product.salePrice! : product.price;

  return (
    <>
      <Helmet>
        <title>{product.name} | AmazingOutfits Kenya</title>
        <meta name="description" content={product.description || `Buy ${product.name} at AmazingOutfits Kenya.`} />
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${index === selectedImage ? 'border-primary' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6">
              {product.brand && <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand.name}</p>}
              <h1 className="text-3xl md:text-4xl font-display tracking-wider">{product.name}</h1>
              <div className="flex items-center gap-4">
                {isOnSale ? (
                  <>
                    <span className="text-3xl font-bold text-accent">{formatKES(currentPrice)}</span>
                    <span className="text-xl text-muted-foreground line-through">{formatKES(product.price)}</span>
                    <span className="badge-sale">-{Math.round(((product.price - currentPrice) / product.price) * 100)}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{formatKES(currentPrice)}</span>
                )}
              </div>
              {product.description && <p className="text-muted-foreground">{product.description}</p>}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              )}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border rounded-lg transition-colors ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>{color}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1 btn-neon" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingBag className="mr-2 h-5 w-5" />Add to Cart
                </Button>
                <Button className="flex-1 btn-primary" size="lg" onClick={handleBuyNow} disabled={product.stock === 0}>
                  <CreditCard className="mr-2 h-5 w-5" />Proceed to Checkout
                </Button>
                <Button variant="outline" size="lg" onClick={toggleWishlist}>
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center"><Truck className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">Free Delivery</p></div>
                <div className="text-center"><RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">7-Day Returns</p></div>
                <div className="text-center"><Shield className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">Authentic</p></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
