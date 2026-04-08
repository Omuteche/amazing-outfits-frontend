import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await api.getBrands();
      setBrands(data || []);
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

  return (
    <>
      <Helmet>
        <title>Brands | AmazingOutfits Kenya</title>
        <meta name="description" content="Explore all our featured brands. Find your favorite streetwear and sneaker brands." />
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display tracking-wider mb-4">
              OUR BRANDS
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover authentic streetwear and sneakers from the world's most iconic brands
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-secondary animate-pulse rounded-lg" />
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No brands available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/shop?brand=${brand.slug}`}
                  className="group glass-card rounded-lg p-6 flex items-center justify-center aspect-square hover-lift transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    {brand.logoUrl ? (
                      <img
                        src={resolveImageUrl(brand.logoUrl)}
                        alt={brand.name}
                        className="max-h-20 max-w-full object-contain mb-2"
                      />
                    ) : (
                      <span className="text-xl font-display tracking-wider text-muted-foreground group-hover:text-primary transition-colors mb-2">
                        {brand.name}
                      </span>
                    )}
                    {brand.description && (
                      <p className="text-xs text-muted-foreground text-center leading-tight">
                        {brand.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
