// API functions for auth slider management
// This file provides additional API methods specifically for auth slider functionality

import api from './api';

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

// Fetch auth-specific sliders (could be filtered by a 'page' field in the future)
export const getAuthSliders = async (): Promise<SliderItem[]> => {
  try {
    // For now, use the existing sliders endpoint
    // In production, you might want to add a 'page' field to the Slider model
    // and filter by page: 'auth' or similar
    const sliders = await api.getSliders(true); // Get all sliders

    // Filter for active sliders only
    return sliders.filter((slider: SliderItem) => slider.isActive !== false);
  } catch (error) {
    console.error('Failed to fetch auth sliders:', error);
    throw error;
  }
};

// Example API response structure for documentation
export const exampleAuthSliderResponse = [
  {
    _id: 'slide-1',
    title: 'Welcome to AmazingOutfits',
    subtitle: 'Discover the latest streetwear trends and premium quality apparel',
    imageUrl: 'https://example.com/uploads/slider-1.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sortOrder: 0,
    isActive: true,
  },
  {
    _id: 'slide-2',
    title: 'Premium Quality Guaranteed',
    subtitle: 'Authentic streetwear for the modern fashion enthusiast',
    imageUrl: 'https://example.com/uploads/slider-2.jpg',
    buttonText: 'Explore Brands',
    buttonLink: '/brands',
    sortOrder: 1,
    isActive: true,
  },
];

// Admin functions for managing auth sliders
export const createAuthSlider = async (data: Omit<SliderItem, '_id'>): Promise<SliderItem> => {
  return api.createSlider(data);
};

export const updateAuthSlider = async (id: string, data: Partial<SliderItem>): Promise<SliderItem> => {
  return api.updateSlider(id, data);
};

export const deleteAuthSlider = async (id: string): Promise<void> => {
  return api.deleteSlider(id);
};

// Utility function to get fallback slides
export const getFallbackSlides = (): SliderItem[] => [
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
];
