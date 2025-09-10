import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  TextField,
  ButtonGroup,
} from '@mui/material';
import {
  ArrowBack,
  AddShoppingCart,
  Inventory,
  LocalOffer,
  Add,
  Remove,
  Favorite,
  FavoriteBorder,
  Share,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID de producto inválido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await getProduct(parseInt(id));
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate('/login');
      }
      return;
    }

    if (product.stock === 0) {
      return;
    }

    try {
      setAddingToCart(true);
      addToCart(product, quantity);
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error adding to cart:', error.message);
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando producto...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Producto no encontrado'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          variant="contained"
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Navigation */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Product Images */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Box
              component="img"
              src={product.images[selectedImage]?.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
              alt={product.name}
              sx={{
                width: '100%',
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2,
              }}
            />
            
            {product.images.length > 1 && (
              <ImageList
                cols={product.images.length > 4 ? 4 : product.images.length}
                gap={8}
                sx={{ height: 80 }}
              >
                {product.images.map((image, index) => (
                  <ImageListItem
                    key={image.id}
                    onClick={() => handleImageSelect(index)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === index ? 2 : 1,
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText || product.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: 1 }}>
          <Box>
            {/* Title and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1, mr: 2 }}>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setFavorite(!favorite)}
                  color="secondary"
                >
                  {favorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton onClick={handleShare} color="primary">
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Price */}
            <Typography
              variant="h3"
              color="primary"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              ${product.price.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<LocalOffer />}
                label="Oferta especial"
                color="secondary"
                size="small"
              />
              {isLowStock && !isOutOfStock && (
                <Chip
                  label={`Solo ${product.stock} disponibles`}
                  color="warning"
                  size="small"
                />
              )}
              {isOutOfStock && (
                <Chip
                  label="Sin stock"
                  color="error"
                  size="small"
                />
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {/* Stock Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Inventory color="action" />
              <Typography variant="body2" color="text.secondary">
                Stock disponible: <strong>{product.stock} unidades</strong>
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Quantity and Add to Cart */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Cantidad:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ButtonGroup variant="outlined">
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    size="small"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handleQuantityChange(value);
                      }
                    }}
                    inputProps={{
                      min: 1,
                      max: product.stock,
                      style: { textAlign: 'center', width: '60px' }
                    }}
                    disabled={isOutOfStock}
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || isOutOfStock}
                  >
                    <Add />
                  </IconButton>
                </ButtonGroup>
                <Typography variant="body2" color="text.secondary">
                  Máximo: {product.stock}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={addingToCart ? <CircularProgress size={20} /> : <AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: isOutOfStock 
                    ? 'grey.400' 
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: isOutOfStock 
                      ? 'grey.400' 
                      : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  },
                }}
              >
                {addingToCart 
                  ? 'Agregando...'
                  : isOutOfStock 
                    ? 'Sin Stock'
                    : `Agregar al Carrito - $${(product.price * quantity).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                }
              </Button>

              {!isAuthenticated && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Debes iniciar sesión para comprar este producto
                </Alert>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}