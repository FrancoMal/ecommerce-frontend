// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
  color: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category; // Para populate
  brand?: string; // Marca del producto (opcional)
  userId: number;
  images: ProductImage[];
  tags: Tag[];
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  brand?: string;
  images: File[] | string[];
  tags: Tag[];
  featured?: boolean;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

// Cart types
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order types
export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  loading: boolean;
}

export interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

// Filter types
export interface ProductFilters {
  categoryId?: number;
  categories?: number[];
  search?: string;
  tags?: string[];
  colors?: string[];
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  featured?: boolean;
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// Upload types
export interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

// Admin types
export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}