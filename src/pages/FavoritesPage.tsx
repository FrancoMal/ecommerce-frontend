import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Product } from '../types';
import { getProduct } from '../services/productService';
import ProductCard from '../components/products/ProductCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadFavoriteProducts();
  }, [user, navigate, favorites]);

  const loadFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const products = await Promise.all(
        favorites.map(id => getProduct(id))
      );
      
      // Filter out any products that might have been deleted
      const validProducts = products.filter(Boolean);
      setFavoriteProducts(validProducts);
    } catch (err: any) {
      setError('Error al cargar productos favoritos');
      console.error('Error loading favorite products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Cargando favoritos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Volver al inicio
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Favorite color="error" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Mis Productos Favoritos
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {favoriteProducts.length} producto{favoriteProducts.length !== 1 ? 's' : ''} en tu lista de favoritos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Favorites Grid */}
      {favoriteProducts.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Favorite sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes productos favoritos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Explora nuestros productos y marca tus favoritos haciendo clic en el corazón
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, #E53E3E 0%, #F56565 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #C53030 0%, #E53E3E 100%)',
              },
            }}
          >
            Explorar Productos
          </Button>
        </Box>
      ) : (
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
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      )}
    </Container>
  );
}