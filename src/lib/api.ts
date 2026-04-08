// API client for self-hosted backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://amazing-outfits.onrender.com/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  getStoredUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setStoredUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearStoredUser(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    const token = this.getAuthToken();

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setAuthToken(data.token);
    this.setStoredUser(data.user);
    return data;
  }

  async register(email: string, password: string, fullName: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: { email, password, fullName },
    });
    this.setAuthToken(data.token);
    this.setStoredUser(data.user);
    return data;
  }

  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  async updateProfile(data: { fullName?: string; phone?: string }) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: data,
    });
  }

  logout() {
    this.clearAuthToken();
    this.clearStoredUser();
  }

  // Products
  async getProducts(params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any>(`/products${queryString}`);
  }

  async getProduct(slug: string) {
    return this.request<any>(`/products/slug/${slug}`);
  }

  async createProduct(data: any) {
    return this.request<any>('/products', { method: 'POST', body: data });
  }

  async updateProduct(id: string, data: any) {
    return this.request<any>(`/products/${id}`, { method: 'PATCH', body: data });
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/products/${id}`, { method: 'DELETE' });
  }

  // Categories
  async getCategories() {
    return this.request<any>('/categories');
  }

  async createCategory(data: any) {
    return this.request<any>('/categories', { method: 'POST', body: data });
  }

  async updateCategory(id: string, data: any) {
    return this.request<any>(`/categories/${id}`, { method: 'PATCH', body: data });
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/categories/${id}`, { method: 'DELETE' });
  }

  // Brands
  async getBrands() {
    return this.request<any>('/brands');
  }

  async createBrand(data: any) {
    return this.request<any>('/brands', { method: 'POST', body: data });
  }

  async updateBrand(id: string, data: any) {
    return this.request<any>(`/brands/${id}`, { method: 'PUT', body: data });
  }

  async deleteBrand(id: string) {
    return this.request<any>(`/brands/${id}`, { method: 'DELETE' });
  }

  // Orders
  async getOrders() {
    return this.request<any>('/orders');
  }

  async getMyOrders() {
    return this.request<any>('/orders/my-orders');
  }

  async getAllOrders() {
    return this.request<any>('/orders/all');
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request<any>('/orders', { method: 'POST', body: data });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<any>(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
  }

  // Sliders
  async getSliders(activeOnly = false) {
    const query = activeOnly ? '?active=true' : '';
    return this.request<any>(`/sliders${query}`);
  }

  async createSlider(data: any) {
    return this.request<any>('/sliders', { method: 'POST', body: data });
  }

  async updateSlider(id: string, data: any) {
    return this.request<any>(`/sliders/${id}`, { method: 'PUT', body: data });
  }

  async deleteSlider(id: string) {
    return this.request<any>(`/sliders/${id}`, { method: 'DELETE' });
  }

  // Blog
  async getBlogPosts(params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any>(`/blog${queryString}`);
  }

  async getBlogPost(slug: string) {
    return this.request<any>(`/blog/slug/${slug}`);
  }

  async createBlogPost(data: any) {
    return this.request<any>('/blog', { method: 'POST', body: data });
  }

  async updateBlogPost(id: string, data: any) {
    return this.request<any>(`/blog/${id}`, { method: 'PUT', body: data });
  }

  async deleteBlogPost(id: string) {
    return this.request<any>(`/blog/${id}`, { method: 'DELETE' });
  }

  // Addresses
  async getAddresses() {
    return this.request<any>('/addresses');
  }

  async createAddress(data: any) {
    return this.request<any>('/addresses', { method: 'POST', body: data });
  }

  async updateAddress(id: string, data: any) {
    return this.request<any>(`/addresses/${id}`, { method: 'PUT', body: data });
  }

  async deleteAddress(id: string) {
    return this.request<any>(`/addresses/${id}`, { method: 'DELETE' });
  }

  async setDefaultAddress(id: string) {
    return this.request<any>(`/addresses/${id}/default`, { method: 'PATCH' });
  }

  // Wishlist
  async getWishlist() {
    return this.request<any>('/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.request<any>('/wishlist', { method: 'POST', body: { productId } });
  }

  async removeFromWishlist(productId: string) {
    return this.request<any>(`/wishlist/${productId}`, { method: 'DELETE' });
  }

  // Users (Admin)
  async getUsers() {
    return this.request<any>('/auth/users');
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<any>(`/auth/users/${userId}/role`, { method: 'PATCH', body: { role } });
  }

  // Paystack
  async initializePayment(data: { email: string; amount: number; orderId: string }) {
    return this.request<any>('/paystack/initialize', { method: 'POST', body: data });
  }

  async verifyPayment(reference: string) {
    return this.request<any>(`/paystack/verify/${reference}`);
  }

  // File Upload
  async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async uploadImage(file: File, folder?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/upload/single`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  }

  async uploadImages(files: File[], folder?: string): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (folder) formData.append('folder', folder);

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.files.map((file: any) => file.url);
  }

  // Admin Stats
  async getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  // Admin Orders
  async getAdminOrders() {
    return this.request<any>('/orders/all');
  }

  // Admin Users
  async getAdminUsers() {
    return this.request<any>('/admin/users');
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
