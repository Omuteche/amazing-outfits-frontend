import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await api.getBrands();
      setBrands((data || []).slice(0, 8));
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveImageUrl = (url?: string) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || /^\/\//.test(url)) return url;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const base = apiBase.replace(/\/api$/, '');
    return base + (url.startsWith('/') ? '' : '/') + url;
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display tracking-wider text-center mb-8">
            TOP BRANDS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-video bg-secondary animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display tracking-wider text-center mb-8">
          TOP BRANDS
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              to={`/shop?brand=${brand.slug}`}
              className="group glass-card rounded-lg p-6 flex items-center justify-center aspect-video hover-lift"
            >
              {brand.logoUrl ? (
                <img
                  src={resolveImageUrl(brand.logoUrl)}
                  alt={brand.name}
                  className="max-h-20 max-w-full object-contain"
                />
              ) : (
                <span className="text-2xl font-display tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
