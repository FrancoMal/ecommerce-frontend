import api from './api';
import { Product, Category, CreateProductData, ProductFilters, PaginatedResponse } from '../types';

// Mock data for development
const mockCategories: Category[] = [
  { id: 1, name: 'Electrónicos', description: 'Dispositivos electrónicos y gadgets' },
  { id: 2, name: 'Ropa', description: 'Ropa y accesorios de moda' },
  { id: 3, name: 'Hogar', description: 'Artículos para el hogar y decoración' },
  { id: 4, name: 'Deportes', description: 'Equipamiento deportivo y fitness' },
  { id: 5, name: 'Libros', description: 'Libros y material educativo' },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'El último modelo de iPhone con tecnología Pro',
    price: 999.99,
    stock: 50,
    categoryId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    images: [
      {
        id: 1,
        productId: 1,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        altText: 'iPhone 15 Pro',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    description: 'Laptop ultradelgada con chip M2 de Apple',
    price: 1299.99,
    stock: 30,
    categoryId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    images: [
      {
        id: 2,
        productId: 2,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        altText: 'MacBook Air M2',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 3,
    name: 'Camiseta Premium',
    description: 'Camiseta de algodón 100% premium',
    price: 29.99,
    stock: 100,
    categoryId: 2,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    images: [
      {
        id: 3,
        productId: 3,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        altText: 'Camiseta Premium',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 4,
    name: 'Silla Ergonómica',
    description: 'Silla de oficina ergonómica con soporte lumbar',
    price: 299.99,
    stock: 20,
    categoryId: 3,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    images: [
      {
        id: 4,
        productId: 4,
        imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
        altText: 'Silla Ergonómica',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 5,
    name: 'Zapatillas Running',
    description: 'Zapatillas deportivas para running de alto rendimiento',
    price: 129.99,
    stock: 75,
    categoryId: 4,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    images: [
      {
        id: 5,
        productId: 5,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        altText: 'Zapatillas Running',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 6,
    name: 'JavaScript: The Good Parts',
    description: 'Libro clásico sobre JavaScript por Douglas Crockford',
    price: 39.99,
    stock: 40,
    categoryId: 5,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
    images: [
      {
        id: 6,
        productId: 6,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        altText: 'JavaScript Book',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  }
];

export const getProducts = async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProducts = [...mockProducts];
    
    // Apply filters
    if (filters?.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (filters?.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue, bValue;
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    
    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
    return {
      data: paginatedProducts,
      total: filteredProducts.length,
      page,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener productos');
  }
};

export const getProduct = async (id: number): Promise<Product> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener producto');
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener categorías');
  }
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct: Product = {
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      ...productData,
      userId: 1, // Would come from auth context
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: productData.images.map((url, index) => ({
        id: Date.now() + index,
        productId: 0, // Will be set after product creation
        imageUrl: url,
        isPrimary: index === 0,
        displayOrder: index
      }))
    };
    
    // Update image productId
    newProduct.images.forEach(img => img.productId = newProduct.id);
    
    // Add to mock data
    mockProducts.push(newProduct);
    
    return newProduct;
  } catch (error: any) {
    throw new Error(error.message || 'Error al crear producto');
  }
};

export const updateProduct = async (id: number, productData: Partial<CreateProductData>): Promise<Product> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    
    const currentProduct = mockProducts[productIndex];
    
    // Handle images conversion if needed
    let updatedImages = currentProduct.images;
    if (productData.images) {
      updatedImages = productData.images.map((url, index) => ({
        id: Date.now() + index,
        productId: id,
        imageUrl: typeof url === 'string' ? url : url,
        isPrimary: index === 0,
        displayOrder: index
      }));
    }
    
    const updatedProduct: Product = {
      ...currentProduct,
      ...productData,
      images: updatedImages,
      updatedAt: new Date().toISOString()
    };
    
    mockProducts[productIndex] = updatedProduct;
    return updatedProduct;
  } catch (error: any) {
    throw new Error(error.message || 'Error al actualizar producto');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    
    mockProducts.splice(productIndex, 1);
  } catch (error: any) {
    throw new Error(error.message || 'Error al eliminar producto');
  }
};

export const getUserProducts = async (): Promise<Product[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter products by current user (mock)
    return mockProducts.filter(p => p.userId === 1);
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener productos del usuario');
  }
};