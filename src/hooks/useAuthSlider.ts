import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface SliderItem {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const useAuthSlider = () => {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sliders from the API
      // Note: This uses the existing sliders endpoint. In production, you might want to create
      // a specific endpoint for auth sliders or add a 'page' field to filter sliders by page
      const data = await api.getSliders(true); // Get all sliders

      // Filter for active sliders (you could add more specific filtering here)
      const activeSlides = data.filter((slide: SliderItem) => slide.isActive !== false);

      // Sort by sortOrder
      const sortedSlides = activeSlides.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      setSlides(sortedSlides);
    } catch (err) {
      console.error('Failed to fetch auth slider data:', err);
      setError('Failed to load slider content');

      // Provide fallback slides if API fails
      setSlides([
        {
          _id: 'fallback-1',
          title: 'Welcome to AmazingOutfits',
          subtitle: 'Discover the latest streetwear trends',
          imageUrl: '/api/placeholder/800/400?text=Auth+Slide+1',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          sortOrder: 0,
          isActive: true,
        },
        {
          _id: 'fallback-2',
          title: 'Premium Quality',
          subtitle: 'Authentic streetwear for the modern fashionista',
          imageUrl: '/api/placeholder/800/400?text=Auth+Slide+2',
          buttonText: 'Explore Brands',
          buttonLink: '/brands',
          sortOrder: 1,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { slides, loading, error, refetch: fetchSlides };
};
