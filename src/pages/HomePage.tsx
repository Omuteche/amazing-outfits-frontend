import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BrandShowcase } from '@/components/home/BrandShowcase';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>AmazingOutfits - Premium Streetwear Shoes in Kenya</title>
        <meta name="description" content="Shop authentic streetwear shoes and sneakers in Kenya. Nike, Adidas, Jordan and more. Free delivery in Nairobi. Pay with M-Pesa." />
      </Helmet>
      
      <Layout>
        <HeroSlider />
        <FeaturedProducts title="NEW ARRIVALS" filter="new" />
        <CategoryGrid />
        <FeaturedProducts title="FEATURED" filter="featured" />
        <BrandShowcase />
        <FeaturedProducts title="ON SALE" filter="sale" />
      </Layout>
    </>
  );
}
