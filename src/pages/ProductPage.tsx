import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

import { resolveImageUrl } from '@/lib/resolveImageUrl';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatKES } from '@/lib/formatCurrency';
import { toast } from 'sonner';
import { useProduct, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/lib/queryHooks';

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
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // React Query hooks
  const productQuery = useProduct(slug || '');
  const product = productQuery.data as Product | undefined;
  const isLoading = productQuery.isLoading;
  const { data: wishlistData = [] } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const wishlist = wishlistData.map((w: any) => w.product?._id || w.productId) || [];
  const isInWishlist = product ? wishlist.includes(product._id) : false;

  useEffect(() => {
    if (!product && !isLoading) {
      navigate('/shop');
    }
  }, [product, isLoading, navigate]);

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
        await removeFromWishlistMutation.mutateAsync(product._id);
      } else {
        await addToWishlistMutation.mutateAsync(product._id);
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (isLoading || !product) {
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

  const images = (product.images && product.images.length > 0 ? product.images : ['/placeholder.svg']).map(resolveImageUrl);

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
            <div className="space-y-4 min-w-0">

              <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-full min-w-0">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${index === selectedImage ? 'border-primary' : 'border-transparent'} min-w-0 max-w-full`}
                    >
                      <img src={img} alt="" className="w-full h-full max-w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6 min-w-0">

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
                  <div className="flex flex-wrap gap-2 min-w-0">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-11 min-w-[44px] px-4 py-2 border rounded-lg transition-colors max-w-full ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2 min-w-0">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`min-h-11 min-w-[44px] px-4 py-2 border rounded-lg transition-colors max-w-full ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4 min-w-0 flex-wrap">
                  <div className="flex items-center border border-border rounded-lg min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                    <span className="w-12 text-center font-semibold max-w-full">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
              </div>
              <div className="flex gap-4 min-w-0 flex-wrap">
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
