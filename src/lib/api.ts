export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = '/api';
    this.token = null;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth
  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Products
  async getProducts(params?: { category?: string; featured?: boolean; search?: string; sort?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.featured) queryParams.set('featured', 'true');
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort) queryParams.set('sort', params.sort);
    
    const query = queryParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.request('/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string) {
    return this.request(`/cart?productId=${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request(`/wishlist?productId=${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payment
  async createPaymentOrder(amount: number) {
    return this.request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async verifyPayment(data: any) {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getUsers() {
    return this.request('/admin/users');
  }

  async updateUser(id: string, data: any) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdminOrders(status?: string) {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return this.request(`/admin/orders${query}`);
  }

  async updateOrder(id: string, data: any) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getStats() {
    return this.request('/admin/stats');
  }
}

export const api = new ApiClient();
