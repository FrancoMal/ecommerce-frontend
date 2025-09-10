import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  StarBorder,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { getUserProducts, deleteProduct } from '../services/productService';
import ProductForm from '../components/products/ProductForm';

export default function ManageProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadProducts();
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const userProducts = await getUserProducts(user?.role === 'admin');
      setProducts(userProducts);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        await loadProducts(); // Reload products
      } catch (err: any) {
        setError(err.message || 'Error al eliminar producto');
      }
    }
  };

  const handleProductFormSuccess = () => {
    loadProducts();
  };

  const filteredProducts = showOnlyActive 
    ? products.filter(p => p.isActive)
    : products;

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Cargando productos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Volver al inicio
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {user?.role === 'admin' ? 'Gestión de Productos (Admin)' : 'Mis Productos'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role === 'admin' 
              ? 'Gestiona todos los productos de la plataforma'
              : 'Gestiona tus productos publicados'
            }
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setProductFormOpen(true)}
          sx={{ height: 'fit-content' }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
              color="primary"
            />
          }
          label="Solo productos activos"
        />
      </Box>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay productos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comienza creando tu primer producto
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setProductFormOpen(true)}
          >
            Crear Producto
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={product.images[0]?.imageUrl}
                        alt={product.name}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.description.slice(0, 50)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip label="Categoría" size="small" variant="outlined" />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      ${product.price.toLocaleString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={`${product.stock} unidades`}
                      color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {product.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          sx={{
                            bgcolor: tag.color,
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                      {product.tags.length > 2 && (
                        <Chip
                          label={`+${product.tags.length - 2}`}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip 
                        label={product.isActive ? 'Activo' : 'Inactivo'}
                        color={product.isActive ? 'success' : 'default'}
                        size="small"
                      />
                      {product.featured && (
                        <Chip
                          label="Destacado"
                          icon={<Star />}
                          color="secondary"
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Ver producto">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/products/${product.id}`)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Editar producto">
                        <IconButton
                          size="small"
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar producto">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProduct(product.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Form Dialog */}
      <ProductForm
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        onSuccess={handleProductFormSuccess}
      />
    </Container>
  );
}