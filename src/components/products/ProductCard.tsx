import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatKES } from '@/lib/formatCurrency';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price?: number | null;
    images?: string[];
    sizes?: string[];
    is_on_sale?: boolean;
    is_new_arrival?: boolean;
    brands?: { name: string } | null;
  };
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ product, onWishlistToggle, isInWishlist }: ProductCardProps) {
  const mainImage = product.images?.[0] || '/placeholder.svg';
  const isOnSale = product.is_on_sale && product.sale_price;
  const discountPercent = isOnSale ? Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100) : 0;

  return (
    <div className="group glass-card rounded-lg overflow-hidden hover-lift">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/product/${product.slug}`}>
          <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new_arrival && <span className="badge-new">NEW</span>}
          {isOnSale && <span className="badge-sale">-{discountPercent}%</span>}
        </div>
        {onWishlistToggle && (
          <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background" onClick={() => onWishlistToggle(product.id)}>
            <Heart className={`h-5 w-5 transition-colors ${isInWishlist ? 'fill-accent text-accent' : 'text-foreground'}`} />
          </Button>
        )}
      </div>
      <div className="p-4">
        {product.brands && <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.brands.name}</p>}
        <Link to={`/product/${product.slug}`}><h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">{product.name}</h3></Link>
        <div className="mt-2 flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-accent">{formatKES(product.sale_price!)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatKES(product.price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">{formatKES(product.price)}</span>
          )}
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.sizes.slice(0, 5).map(size => (<span key={size} className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">{size}</span>))}
            {product.sizes.length > 5 && <span className="text-xs px-2 py-1 text-muted-foreground">+{product.sizes.length - 5}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
