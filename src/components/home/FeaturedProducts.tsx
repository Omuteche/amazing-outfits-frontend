import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useProducts, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/lib/queryHooks';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes?: string[];
  isOnSale: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  brand?: { name: string };
}

interface FeaturedProductsProps {
  title: string;
  filter: 'featured' | 'new' | 'sale';
}

export function FeaturedProducts({ title, filter }: FeaturedProductsProps) {
  const { user } = useAuth();

  const params: Record<string, string> = { limit: '8' };
  if (filter === 'featured') params.featured = 'true';
  else if (filter === 'new') params.newArrival = 'true';
  else if (filter === 'sale') params.onSale = 'true';

  const productsQuery = useProducts(params);
  const productsData = productsQuery.data;
  const isLoading = productsQuery.isLoading;
  const { data: wishlistData = [] } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const products = (productsData?.products || productsData || []) as Product[];
  const wishlist = wishlistData.map((w: any) => w.product?._id || w.productId) || [];

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    const isInWishlist = wishlist.includes(productId);

    try {
      if (isInWishlist) {
        await removeFromWishlistMutation.mutateAsync(productId);
      } else {
        await addToWishlistMutation.mutateAsync(productId);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const getFilterLink = () => {
    if (filter === 'new') return '/shop?filter=new';
    if (filter === 'sale') return '/shop?filter=sale';
    return '/shop';
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-display tracking-wider">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-secondary animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-display tracking-wider">{title}</h2>
          <Link to={getFilterLink()}>
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                sale_price: product.salePrice,
                images: product.images,
                sizes: product.sizes,
                is_on_sale: product.isOnSale,
                is_new_arrival: product.isNewArrival,
                brands: product.brand,
              }}
              onWishlistToggle={toggleWishlist}
              isInWishlist={wishlist.includes(product._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
