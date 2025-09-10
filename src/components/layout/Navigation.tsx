import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Category,
  Laptop,
  Checkroom,
  Home,
  SportsBasketball,
  MenuBook,
  Store,
} from '@mui/icons-material';
import { Category as CategoryType } from '../../types';
import { getCategories } from '../../services/productService';

interface NavigationProps {
  open: boolean;
  onClose: () => void;
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategory: number | null;
}

const getCategoryIcon = (categoryId: number, isSelected: boolean) => {
  const iconColor = isSelected ? 'white' : 'inherit';
  const iconProps = { sx: { color: iconColor } };
  
  switch (categoryId) {
    case 1:
      return <Laptop {...iconProps} />;
    case 2:
      return <Checkroom {...iconProps} />;
    case 3:
      return <Home {...iconProps} />;
    case 4:
      return <SportsBasketball {...iconProps} />;
    case 5:
      return <MenuBook {...iconProps} />;
    default:
      return <Category {...iconProps} />;
  }
};

export default function Navigation({ 
  open, 
  onClose, 
  onCategorySelect, 
  selectedCategory 
}: NavigationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number | null) => {
    onCategorySelect(categoryId);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category />
          Categorías
        </Typography>
      </Box>
      
      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedCategory === null}
            onClick={() => handleCategoryClick(null)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon>
              <Store sx={{ color: selectedCategory === null ? 'white' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Todos los productos" />
          </ListItemButton>
        </ListItem>
        
        <Divider />
        
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon>
                {getCategoryIcon(category.id, selectedCategory === category.id)}
              </ListItemIcon>
              <ListItemText primary={category.name} />
              <Chip
                size="small"
                label="New"
                color="secondary"
                sx={{ 
                  display: selectedCategory === category.id ? 'none' : 'inline-flex',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          ¿No encuentras lo que buscas?
        </Typography>
        <Typography variant="body2" color="primary" align="center" sx={{ fontWeight: 500 }}>
          ¡Vende tu producto!
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          border: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}