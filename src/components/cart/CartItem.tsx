import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  Warning,
} from '@mui/icons-material';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(item.productId);
      return;
    }

    if (newQuantity > item.stock) {
      return; // Don't update if quantity exceeds stock
    }

    try {
      updateQuantity(item.productId, newQuantity);
    } catch (error: any) {
      console.error('Error updating quantity:', error.message);
    }
  };

  const handleRemoveItem = () => {
    removeFromCart(item.productId);
  };

  const subtotal = item.price * item.quantity;
  const isLowStock = item.stock <= 5;
  const isMaxQuantity = item.quantity >= item.stock;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        {/* Product Image */}
        <Avatar
          src={item.image}
          alt={item.name}
          variant="rounded"
          sx={{ 
            width: 60, 
            height: 60,
            bgcolor: 'grey.200'
          }}
        />

        {/* Product Info */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              mb: 1
            }}
          >
            {item.name}
          </Typography>

          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ fontWeight: 600, mb: 1 }}
          >
            ${item.price.toLocaleString('es-AR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>

          {/* Stock warning */}
          {isLowStock && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <Warning color="warning" sx={{ fontSize: 16 }} />
              <Typography variant="caption" color="warning.main">
                Solo {item.stock} disponibles
              </Typography>
            </Box>
          )}

          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
            >
              <Remove fontSize="small" />
            </IconButton>

            <TextField
              size="small"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0) {
                  handleQuantityChange(value);
                }
              }}
              inputProps={{
                min: 1,
                max: item.stock,
                style: { textAlign: 'center', width: '50px' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '32px',
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                },
              }}
            />

            <Tooltip title={isMaxQuantity ? 'Stock máximo alcanzado' : ''}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isMaxQuantity}
                  sx={{
                    border: '1px solid',
                    borderColor: isMaxQuantity ? 'grey.300' : 'grey.300',
                    '&:hover': {
                      borderColor: isMaxQuantity ? 'grey.300' : 'primary.main',
                      bgcolor: isMaxQuantity ? 'transparent' : 'primary.50',
                    },
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Eliminar producto">
              <IconButton
                size="small"
                onClick={handleRemoveItem}
                color="error"
                sx={{ ml: 1 }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Subtotal */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography 
              variant="subtitle2" 
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              ${subtotal.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
    </Box>
  );
}