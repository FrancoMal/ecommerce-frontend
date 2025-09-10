import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart,
  Visibility,
  Inventory,
  LocalOffer,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.stock > 0) {
      try {
        addToCart(product, 1);
      } catch (error: any) {
        console.error('Error adding to cart:', error.message);
      }
    }
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    toggleFavorite(product.id);
  };

  const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || 
                      product.images[0]?.imageUrl || 
                      'https://via.placeholder.com/300x200?text=No+Image';

  const isOutOfStock = product.stock === 0;
  const isProductFavorite = isAuthenticated && isFavorite(product.id);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(229, 62, 62, 0.15)',
        },
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #F7FAFC',
        borderRadius: '12px',
      }}
      onClick={handleViewDetails}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={primaryImage}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            filter: isOutOfStock ? 'grayscale(100%) opacity(0.6)' : 'none',
            backgroundColor: '#F7FAFC',
          }}
        />
        
        {isOutOfStock && (
          <Chip
            label="Sin Stock"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 600,
            }}
          />
        )}
        
        {/* Top Right Corner - Stock and Favorite */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          {/* Favorite Button */}
          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: isProductFavorite ? 'error.main' : 'text.secondary',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'white',
                color: 'error.main',
              },
            }}
            size="small"
          >
            {isProductFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>

          {!isOutOfStock && product.stock <= 5 && (
            <Chip
              label={`Solo ${product.stock}`}
              color="warning"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: 'calc(100% - 60px)',
          }}
        >
          {product.featured && (
            <Chip
              icon={<LocalOffer />}
              label="Destacado"
              color="secondary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 500,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            fontSize: '1rem',
            color: 'text.primary',
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: '1.5rem',
          }}
        >
          ${product.price.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.875rem' }}
          >
            Stock: {product.stock}
          </Typography>
          {product.brand && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: 'grey.100',
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              {product.brand}
            </Typography>
          )}
        </Box>

        {/* Product Tags */}
        {product.tags && product.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {product.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  bgcolor: tag.color,
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            ))}
            {product.tags.length > 3 && (
              <Chip
                label={`+${product.tags.length - 3}`}
                size="small"
                sx={{
                  bgcolor: 'grey.400',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          sx={{
            py: 1.2,
            fontWeight: 500,
            fontSize: '0.875rem',
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          {isOutOfStock ? 'Sin Stock' : 'Agregar'}
        </Button>

        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          sx={{
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
            },
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}