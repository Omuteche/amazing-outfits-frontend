/**
 * Centralized React Query query keys for consistent caching across the app
 * Prevents duplicate fetches and ensures cache invalidation works correctly
 */

export const queryKeys = {
  // Categories
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },

  // Brands
  brands: {
    all: ['brands'] as const,
    list: () => [...queryKeys.brands.all, 'list'] as const,
  },

  // Products
  products: {
    all: ['products'] as const,
    list: () => [...queryKeys.products.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.products.all, 'detail', slug] as const,
    filtered: (params: Record<string, string>) => 
      [...queryKeys.products.all, 'filtered', JSON.stringify(params)] as const,
  },

  // Sliders
  sliders: {
    all: ['sliders'] as const,
    list: () => [...queryKeys.sliders.all, 'list'] as const,
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    list: () => [...queryKeys.wishlist.all, 'list'] as const,
  },

  // Blog
  blog: {
    all: ['blog'] as const,
    posts: () => [...queryKeys.blog.all, 'posts'] as const,
    detail: (slug: string) => [...queryKeys.blog.all, 'detail', slug] as const,
  },

  // User/Auth
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },

  // Addresses
  addresses: {
    all: ['addresses'] as const,
    list: () => [...queryKeys.addresses.all, 'list'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: () => [...queryKeys.orders.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
  },
};
