import api from './api';
import { Product, Category, CreateProductData, ProductFilters, PaginatedResponse, Tag } from '../types';

// Mock data for development
const mockCategories: Category[] = [
  { id: 1, name: 'Electrónicos', description: 'Dispositivos electrónicos y gadgets' },
  { id: 2, name: 'Ropa', description: 'Ropa y accesorios de moda' },
  { id: 3, name: 'Hogar', description: 'Artículos para el hogar y decoración' },
  { id: 4, name: 'Deportes', description: 'Equipamiento deportivo y fitness' },
  { id: 5, name: 'Libros', description: 'Libros y material educativo' },
];

const mockTags: Tag[] = [
  { id: 1, name: 'Premium', color: '#E53E3E' },
  { id: 2, name: 'Nuevo', color: '#10B981' },
  { id: 3, name: 'Descuento', color: '#F59E0B' },
  { id: 4, name: 'Limitado', color: '#8B5CF6' },
  { id: 5, name: 'Bestseller', color: '#EF4444' },
  { id: 6, name: 'Eco-friendly', color: '#059669' },
  { id: 7, name: 'Tech', color: '#3B82F6' },
  { id: 8, name: 'Gaming', color: '#7C3AED' },
  { id: 9, name: 'Fitness', color: '#F97316' },
  { id: 10, name: 'Casual', color: '#6B7280' },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'El último modelo de iPhone con tecnología Pro',
    price: 999.99,
    stock: 50,
    categoryId: 1,
    brand: 'Apple',
    userId: 1,
    isActive: true,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    tags: [mockTags[0], mockTags[1], mockTags[6]], // Premium, Nuevo, Tech
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
    brand: 'Apple',
    userId: 1,
    isActive: true,
    featured: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    tags: [mockTags[0], mockTags[6], mockTags[4]], // Premium, Tech, Bestseller
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
    brand: 'Nike',
    userId: 2,
    isActive: true,
    featured: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    tags: [mockTags[0], mockTags[5], mockTags[9]], // Premium, Eco-friendly, Casual
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
    brand: 'Herman Miller',
    userId: 2,
    isActive: true,
    featured: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    tags: [mockTags[0], mockTags[1]], // Premium, Nuevo
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
    brand: 'Adidas',
    userId: 2,
    isActive: true,
    featured: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    tags: [mockTags[4], mockTags[8], mockTags[2]], // Bestseller, Fitness, Descuento
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
    userId: 3,
    isActive: true,
    featured: false,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
    tags: [mockTags[4], mockTags[6]], // Bestseller, Tech
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
  },
  {
    id: 7,
    name: 'Smartphone Samsung Galaxy',
    description: 'Smartphone de última generación con cámara profesional',
    price: 899.99,
    stock: 45,
    categoryId: 1,
    brand: 'Samsung',
    userId: 1,
    isActive: true,
    featured: false,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
    tags: [mockTags[1], mockTags[6], mockTags[7]], // Nuevo, Tech, Gaming
    images: [
      {
        id: 7,
        productId: 7,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        altText: 'Samsung Galaxy',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 8,
    name: 'Jeans Casual',
    description: 'Jeans de mezclilla premium para uso diario',
    price: 79.99,
    stock: 120,
    categoryId: 2,
    brand: 'Levis',
    userId: 2,
    isActive: true,
    featured: false,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    tags: [mockTags[9], mockTags[5]], // Casual, Eco-friendly
    images: [
      {
        id: 8,
        productId: 8,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        altText: 'Jeans Casual',
        isPrimary: true,
        displayOrder: 0
      }
    ]
  },
  {
    id: 9,
    name: 'Lámpara LED Inteligente',
    description: 'Lámpara LED con control por aplicación móvil',
    price: 149.99,
    stock: 35,
    categoryId: 3,
    userId: 1,
    isActive: true,
    featured: true,
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
    tags: [mockTags[1], mockTags[6]], // Nuevo, Tech
    images: [
      {
        id: 9,
        productId: 9,
        imageUrl: 'https://http2.mlstatic.com/D_Q_NP_983139-MLU78058287734_082024-O.webp',
        altText: 'Lámpara LED',
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
    
    // Apply category filter
    if (filters?.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters?.categories?.length) {
      filteredProducts = filteredProducts.filter(p => filters.categories!.includes(p.categoryId));
    }
    
    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply tag filter
    if (filters?.tags?.length) {
      filteredProducts = filteredProducts.filter(p =>
        p.tags.some(tag => filters.tags!.includes(tag.name))
      );
    }
    
    // Apply brand filter
    if (filters?.brands?.length) {
      filteredProducts = filteredProducts.filter(p => {
        if (!p.brand) return filters.brands!.includes('Sin marca');
        return filters.brands!.includes(p.brand);
      });
    }
    
    // Apply price filter
    if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(p => {
        const price = p.price;
        const minPrice = filters.priceMin ?? 0;
        const maxPrice = filters.priceMax ?? 999999;
        return price >= minPrice && price <= maxPrice;
      });
    }
    
    // Apply featured filter
    if (filters?.featured) {
      filteredProducts = filteredProducts.filter(p => p.featured);
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

// Get unique brands from all products
export const getBrands = async (): Promise<string[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const brands = new Set<string>();
    mockProducts.forEach(product => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    
    const brandsList = Array.from(brands).sort();
    brandsList.push('Sin marca'); // Para productos sin marca
    
    return brandsList;
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener marcas');
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

export const getTags = async (): Promise<Tag[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTags;
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener tags');
  }
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct: Product = {
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      categoryId: productData.categoryId,
      brand: productData.brand,
      tags: productData.tags,
      featured: productData.featured || false,
      userId: 1, // Would come from auth context
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: []
    };
    
    // Handle images - convert Files to URLs for mock
    if (productData.images) {
      newProduct.images = productData.images.map((imageData, index) => ({
        id: Date.now() + index,
        productId: newProduct.id,
        imageUrl: typeof imageData === 'string' 
          ? imageData 
          : URL.createObjectURL(imageData as File),
        isPrimary: index === 0,
        displayOrder: index
      }));
    }
    
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
      updatedImages = productData.images.map((imageData, index) => ({
        id: Date.now() + index,
        productId: id,
        imageUrl: typeof imageData === 'string' 
          ? imageData 
          : URL.createObjectURL(imageData as File),
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

export const getUserProducts = async (isAdmin: boolean = false): Promise<Product[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isAdmin) {
      // Admin can see all products
      return mockProducts;
    } else {
      // Regular users can only see their own products (none for now in mock)
      return [];
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener productos del usuario');
  }
};