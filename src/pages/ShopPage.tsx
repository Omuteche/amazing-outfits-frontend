import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatKES } from '@/lib/formatCurrency';

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
  brand?: { name: string };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchProducts();
    if (user) fetchWishlist();
  }, [searchParams, selectedCategories, selectedBrands, priceRange, sortBy, user]);

  const fetchFiltersData = async () => {
    try {
      const [cats, brs] = await Promise.all([api.getCategories(), api.getBrands()]);
      setCategories(cats || []);
      setBrands(brs || []);
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      const search = searchParams.get('search');
      const filter = searchParams.get('filter');
      const category = searchParams.get('category');
      const brand = searchParams.get('brand');

      if (search) params.search = search;
      if (filter === 'new') params.newArrival = 'true';
      if (filter === 'sale') params.onSale = 'true';
      if (category) params.category = category;
      if (brand) params.brand = brand;
      if (sortBy) params.sort = sortBy;

      const data = await api.getProducts(params);
      setProducts(data.products || data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const data = await api.getWishlist();
      setWishlist(data.map((w: any) => w.product?._id || w.productId) || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }
    const isInWishlist = wishlist.includes(productId);
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(productId);
        setWishlist(wishlist.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        await api.addToWishlist(productId);
        setWishlist([...wishlist, productId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(cat._id)}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedCategories([...selectedCategories, cat._id]);
                  else setSelectedCategories(selectedCategories.filter(id => id !== cat._id));
                }}
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Brands</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand._id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedBrands([...selectedBrands, brand._id]);
                  else setSelectedBrands(selectedBrands.filter(id => id !== brand._id));
                }}
              />
              <span className="text-sm">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider value={priceRange} onValueChange={(value) => setPriceRange(value as [number, number])} min={0} max={50000} step={500} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatKES(priceRange[0])}</span>
          <span>{formatKES(priceRange[1])}</span>
        </div>
      </div>
      <Button onClick={clearFilters} variant="outline" className="w-full">Clear Filters</Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Shop Streetwear Shoes | AmazingOutfits Kenya</title>
        <meta name="description" content="Browse our collection of authentic streetwear shoes. Nike, Adidas, Jordan sneakers available in Kenya with M-Pesa payment." />
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24 glass-card p-6 rounded-lg">
                <h3 className="font-display text-xl tracking-wider mb-6">FILTERS</h3>
                <FilterContent />
              </div>
            </aside>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display tracking-wider">
                    {searchParams.get('filter') === 'new' ? 'NEW ARRIVALS' : searchParams.get('filter') === 'sale' ? 'ON SALE' : 'ALL SHOES'}
                  </h1>
                  <p className="text-muted-foreground mt-1">{products.length} products</p>
                </div>
                <div className="flex items-center gap-4">
                  <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                      <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-background">
                      <SheetHeader><SheetTitle className="font-display tracking-wider">FILTERS</SheetTitle></SheetHeader>
                      <div className="mt-6"><FilterContent /></div>
                    </SheetContent>
                  </Sheet>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:flex border border-border rounded-lg">
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (<div key={i} className="aspect-square bg-secondary animate-pulse rounded-lg" />))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">No products found</p>
                  <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' : 'flex flex-col gap-4'}>
                  {products.map(product => (
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
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
