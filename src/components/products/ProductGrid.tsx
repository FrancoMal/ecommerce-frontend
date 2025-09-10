import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Product, ProductFilters } from '../../types';
import { getProducts } from '../../services/productService';
import ProductCard from './ProductCard';

interface ProductGridProps {
  categoryId?: number | null;
  searchQuery?: string;
}

export default function ProductGrid({ categoryId, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchProducts = async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getProducts({
        categoryId: categoryId || undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 12,
        ...filters,
      });
      
      setProducts(response.data);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery, currentPage, sortBy, sortOrder]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    if (value === 'name-asc') {
      setSortBy('name');
      setSortOrder('asc');
    } else if (value === 'name-desc') {
      setSortBy('name');
      setSortOrder('desc');
    } else if (value === 'price-asc') {
      setSortBy('price');
      setSortOrder('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortOrder('desc');
    } else if (value === 'newest') {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  };

  const getSortValue = () => {
    if (sortBy === 'name' && sortOrder === 'asc') return 'name-asc';
    if (sortBy === 'name' && sortOrder === 'desc') return 'name-desc';
    if (sortBy === 'price' && sortOrder === 'asc') return 'price-asc';
    if (sortBy === 'price' && sortOrder === 'desc') return 'price-desc';
    if (sortBy === 'createdAt' && sortOrder === 'desc') return 'newest';
    return 'name-asc';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with filters */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          {categoryId ? 'Productos por Categoría' : searchQuery ? `Resultados para: "${searchQuery}"` : 'Todos los Productos'}
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={getSortValue()}
            onChange={handleSortChange}
            label="Ordenar por"
          >
            <MenuItem value="name-asc">Nombre (A-Z)</MenuItem>
            <MenuItem value="name-desc">Nombre (Z-A)</MenuItem>
            <MenuItem value="price-asc">Precio (Menor a Mayor)</MenuItem>
            <MenuItem value="price-desc">Precio (Mayor a Menor)</MenuItem>
            <MenuItem value="newest">Más Recientes</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron productos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery 
              ? 'Intenta con otros términos de búsqueda'
              : 'No hay productos disponibles en esta categoría'
            }
          </Typography>
        </Box>
      ) : (
        <>
          {/* Products Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}