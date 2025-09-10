import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  DeleteForever,
  Payment,
  CheckCircle,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from './CartItem';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cart, clearCart, checkout, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) return;
    
    try {
      await checkout();
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setCheckoutDialog(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const openCheckoutDialog = () => {
    if (cart.items.length === 0) return;
    setCheckoutDialog(true);
  };

  const closeCheckoutDialog = () => {
    setCheckoutDialog(false);
    setCheckoutSuccess(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { 
            width: { xs: '100%', sm: 400 },
            maxWidth: '100vw'
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart />
              Mi Carrito ({cart.items.length})
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {cart.items.length === 0 ? (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary'
              }}>
                <ShoppingCart sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  Tu carrito está vacío
                </Typography>
                <Typography variant="body2">
                  Agrega productos para comenzar tu compra
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {cart.items.map((item) => (
                  <ListItem key={item.productId} sx={{ p: 0 }}>
                    <CartItem item={item} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          {cart.items.length > 0 && (
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ mb: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Total:
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                    ${cart.total.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForever />}
                  onClick={handleClearCart}
                  sx={{ flex: 1 }}
                >
                  Vaciar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Payment />}
                  onClick={openCheckoutDialog}
                  disabled={!isAuthenticated}
                  sx={{ 
                    flex: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  Finalizar Compra
                </Button>
              </Box>

              {!isAuthenticated && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Debes iniciar sesión para finalizar la compra
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Checkout Dialog */}
      <Dialog 
        open={checkoutDialog} 
        onClose={closeCheckoutDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {checkoutSuccess ? (
            <>
              <CheckCircle />
              ¡Compra Exitosa!
            </>
          ) : (
            <>
              <Payment />
              Confirmar Compra
            </>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {checkoutSuccess ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                ¡Tu compra se ha procesado exitosamente!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recibirás un email con los detalles de tu pedido.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Estás a punto de finalizar tu compra. Por favor, revisa los productos:
              </Typography>
              
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {cart.items.map((item) => (
                  <ListItem key={item.productId} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2">
                        {item.name} x {item.quantity}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${(item.price * item.quantity).toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Total a pagar:
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                  ${cart.total.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        {!checkoutSuccess && (
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={closeCheckoutDialog}
              variant="outlined"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCheckout}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
              sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
              }}
            >
              {loading ? 'Procesando...' : 'Confirmar Compra'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}