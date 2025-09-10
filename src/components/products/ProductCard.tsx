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
  Tooltip,
} from '@mui/material';
import {
  AddShoppingCart,
  Visibility,
  Inventory,
  LocalOffer,
} from '@mui/icons-material';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
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

  const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || 
                      product.images[0]?.imageUrl || 
                      'https://via.placeholder.com/300x200?text=No+Image';

  const isOutOfStock = product.stock === 0;

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
        
        {!isOutOfStock && product.stock <= 5 && (
          <Chip
            label={`Solo ${product.stock} disponibles`}
            color="warning"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 600,
            }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            icon={<LocalOffer />}
            label="Oferta"
            color="secondary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
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

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.875rem',
            mb: 1,
          }}
        >
          Stock: {product.stock} disponibles
        </Typography>
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