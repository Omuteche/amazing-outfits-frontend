/**
 * Custom React Query hooks for data fetching
 * Centralizes all query logic with consistent cache settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

// CACHE SETTINGS (in milliseconds)
const CACHE_TIME = {
  CATEGORIES: 1000 * 60 * 10, // 10 minutes
  BRANDS: 1000 * 60 * 10, // 10 minutes
  PRODUCTS: 1000 * 60 * 2, // 2 minutes
  SLIDERS: 1000 * 60 * 10, // 10 minutes
  WISHLIST: 1000 * 60 * 1, // 1 minute
  BLOG_POSTS: 1000 * 60 * 5, // 5 minutes
  BLOG_DETAIL: 1000 * 60 * 5, // 5 minutes
  USER_PROFILE: 1000 * 60 * 5, // 5 minutes
  ADDRESSES: 1000 * 60 * 5, // 5 minutes
  ORDERS: 1000 * 60 * 5, // 5 minutes
  ADMIN_STATS: 1000 * 60 * 5, // 5 minutes
};

// ============ CATEGORIES ============
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => api.getCategories(),
    staleTime: CACHE_TIME.CATEGORIES,
  });
}

// ============ BRANDS ============
export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: () => api.getBrands(),
    staleTime: CACHE_TIME.BRANDS,
  });
}

// ============ PRODUCTS ============
export function useProducts(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: queryKeys.products.filtered(params),
    queryFn: () => api.getProducts(params),
    staleTime: CACHE_TIME.PRODUCTS,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => api.getProduct(slug),
    staleTime: CACHE_TIME.PRODUCTS,
    enabled: !!slug,
  });
}

// ============ SLIDERS ============
export function useSliders(onlyActive: boolean = true) {
  return useQuery({
    queryKey: queryKeys.sliders.list(),
    queryFn: () => api.getSliders(onlyActive),
    staleTime: CACHE_TIME.SLIDERS,
  });
}

// ============ WISHLIST ============
export function useWishlist() {
  return useQuery({
    queryKey: queryKeys.wishlist.list(),
    queryFn: () => api.getWishlist(),
    staleTime: CACHE_TIME.WISHLIST,
    retry: 1,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => api.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    onError: () => {
      toast.error('Failed to add to wishlist');
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => api.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    onError: () => {
      toast.error('Failed to remove from wishlist');
    },
  });
}

// ============ BLOG ============
export function useBlogPosts(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.blog.posts(),
    queryFn: () => api.getBlogPosts(filters || { published: 'true' }),
    staleTime: CACHE_TIME.BLOG_POSTS,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.blog.detail(slug),
    queryFn: () => api.getBlogPost(slug),
    staleTime: CACHE_TIME.BLOG_DETAIL,
    enabled: !!slug,
  });
}

// ============ USER/AUTH ============
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => api.getProfile(),
    staleTime: CACHE_TIME.USER_PROFILE,
    retry: 1,
  });
}

// ============ ADDRESSES ============
export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses.list(),
    queryFn: () => api.getAddresses(),
    staleTime: CACHE_TIME.ADDRESSES,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      toast.success('Address added');
    },
    onError: () => {
      toast.error('Failed to add address');
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      toast.success('Default address updated');
    },
    onError: () => {
      toast.error('Failed to set default');
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      toast.success('Address deleted');
    },
    onError: () => {
      toast.error('Failed to delete address');
    },
  });
}

// ============ ORDERS ============
export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: () => api.getMyOrders(),
    staleTime: CACHE_TIME.ORDERS,
  });
}

// ============ ADMIN ============
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: () => api.getAdminStats(),
    staleTime: CACHE_TIME.ADMIN_STATS,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      toast.success('Brand created');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create brand');
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      toast.success('Brand updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update brand');
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      toast.success('Brand deleted');
    },
    onError: () => {
      toast.error('Failed to delete brand');
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success('Product created');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success('Product updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success('Product deleted');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (reference: string) => api.verifyPayment(reference),
  });
}
