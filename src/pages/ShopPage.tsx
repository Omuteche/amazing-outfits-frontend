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
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatKES } from '@/lib/formatCurrency';
import { useCategories, useBrands, useProducts, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/lib/queryHooks';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // React Query hooks
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  
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

  const { data: productsData, isLoading: productsLoading } = useProducts(params);
  const { data: wishlistData = [], isLoading: wishlistLoading } = useWishlist();
  
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const products = productsData?.products || productsData || [];
  const wishlist = wishlistData.map((w: any) => w.product?._id || w.productId) || [];
  const loading = categoriesLoading || brandsLoading || productsLoading || wishlistLoading;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowFloatingBar(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-display text-3xl tracking-wider mb-3 relative">
          FILTERS
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></div>
        </h4>
      </div>
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
                <h3 className="font-display text-3xl tracking-wider mb-6 relative">
                  FILTERS
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></div>
                </h3>
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
<SheetContent side="left" className="bg-background overflow-y-auto">
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
                <motion.div
                  className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' : 'flex flex-col gap-4'}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                >
                  {products.map(product => (
                    <motion.div
                      key={product._id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
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
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Floating Sort & Filter Bar for Mobile */}
          {showFloatingBar && (
            <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Sort & Filter
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="bg-background h-96 overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle className="font-display tracking-wider text-left">SORT & FILTER</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <div className="mb-4">
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FilterContent />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {products.length} products
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
