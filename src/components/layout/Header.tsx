import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  AccountCircle,
  Store,
  Logout,
  Person,
  Add,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: '#F7FAFC',
  border: '1px solid #E2E8F0',
  '&:hover': {
    borderColor: '#E53E3E',
  },
  '&:focus-within': {
    borderColor: '#E53E3E',
    boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#718096',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1A202C',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    fontSize: '0.95rem',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
    '&::placeholder': {
      color: '#718096',
      opacity: 1,
    },
  },
}));

interface HeaderProps {
  onCartOpen: () => void;
  onSearchChange: (query: string) => void;
}

export default function Header({ onCartOpen, onSearchChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <Store fontSize="large" />
        </IconButton>
        
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 0,
            fontWeight: 700,
            color: 'primary.main',
            cursor: 'pointer',
            mr: 4,
            fontSize: '1.5rem',
          }}
          onClick={() => navigate('/')}
        >
          Haversack
        </Typography>

        <SearchContainer>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchContainer>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && (
            <Button
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/manage-products')}
              sx={{ mr: 1 }}
            >
              Vender
            </Button>
          )}

          <IconButton
            color="primary"
            onClick={onCartOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={cartItemsCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="primary"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.firstName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <Person sx={{ mr: 1 }} />
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={() => { navigate('/manage-products'); handleMenuClose(); }}>
                  <Store sx={{ mr: 1 }} />
                  Mis Productos
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="primary"
              variant="contained"
              startIcon={<AccountCircle />}
              onClick={() => navigate('/login')}
            >
              Ingresar
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}