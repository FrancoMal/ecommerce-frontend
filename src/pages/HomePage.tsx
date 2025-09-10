import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Fab,
} from '@mui/material';
import {
  KeyboardArrowUp,
} from '@mui/icons-material';
import Header from '../components/layout/Header';
import ProductGrid from '../components/products/ProductGrid';
import CartSidebar from '../components/cart/CartSidebar';
import FilterSidebar from '../components/products/FilterSidebar';
import { getCategories } from '../services/productService';
import { Category } from '../types';

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as number[],
    colors: [] as string[],
    priceMin: 0,
    priceMax: 2000,
  });

  // Load categories
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (categoryIds: number[]) => {
    setFilters(prev => ({ ...prev, categories: categoryIds }));
  };

  const handlePriceFilter = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const handleColorFilter = (colors: string[]) => {
    setFilters(prev => ({ ...prev, colors }));
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      priceMin: 0,
      priceMax: 2000,
    });
    setSearchQuery('');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header onCartOpen={handleCartOpen} onSearchChange={handleSearchChange} />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            marginRight: isMobile ? 0 : '280px',
          }}
        >
          <Container maxWidth="xl">
            {/* Welcome Section */}
            {!searchQuery && filters.categories.length === 0 && (
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(135deg, #E53E3E 0%, #F56565 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Haversack
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ mb: 4, fontWeight: 300 }}
                >
                  Tu marketplace de confianza
                </Typography>
                <Box
                  sx={{
                    height: 4,
                    width: 80,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    mx: 'auto',
                    mb: 4,
                  }}
                />
              </Box>
            )}

            {/* Product Grid */}
            <ProductGrid 
              categoryId={filters.categories.length > 0 ? filters.categories[0] : null}
              searchQuery={searchQuery}
            />
          </Container>
        </Box>

        {/* Filter Sidebar */}
        {!isMobile && (
          <FilterSidebar
            categories={categories}
            onCategoryFilter={handleCategoryFilter}
            onPriceFilter={handlePriceFilter}
            onColorFilter={handleColorFilter}
            onClearFilters={handleClearFilters}
          />
        )}
      </Box>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onClose={handleCartClose} />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Box>
  );
}