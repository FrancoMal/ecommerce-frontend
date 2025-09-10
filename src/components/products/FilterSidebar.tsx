import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Chip,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
} from '@mui/icons-material';
import { Category } from '../../types';

interface FilterSidebarProps {
  categories: Category[];
  onCategoryFilter: (categoryIds: number[]) => void;
  onPriceFilter: (min: number, max: number) => void;
  onColorFilter: (colors: string[]) => void;
  onClearFilters: () => void;
}

const colors = [
  { name: 'Negro', value: 'black', color: '#000000' },
  { name: 'Rojo', value: 'red', color: '#E53E3E' },
  { name: 'Azul', value: 'blue', color: '#3182CE' },
  { name: 'Verde', value: 'green', color: '#38A169' },
  { name: 'Amarillo', value: 'yellow', color: '#D69E2E' },
  { name: 'Rosa', value: 'pink', color: '#ED64A6' },
];

const brands = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG'
];

export default function FilterSidebar({
  categories,
  onCategoryFilter,
  onPriceFilter,
  onColorFilter,
  onClearFilters,
}: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);

  const handleCategoryChange = (categoryId: number) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onCategoryFilter(newSelection);
  };

  const handleColorChange = (colorValue: string) => {
    const newSelection = selectedColors.includes(colorValue)
      ? selectedColors.filter(color => color !== colorValue)
      : [...selectedColors, colorValue];
    
    setSelectedColors(newSelection);
    onColorFilter(newSelection);
  };

  const handleBrandChange = (brand: string) => {
    const newSelection = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    setSelectedBrands(newSelection);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    const [min, max] = newValue as number[];
    onPriceFilter(min, max);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    onClearFilters();
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedColors.length > 0 || 
                          selectedBrands.length > 0 ||
                          priceRange[0] > 0 || 
                          priceRange[1] < 2000;

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: 'background.paper',
        borderLeft: '1px solid #E2E8F0',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          Filtros
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleClearAll}
            sx={{ textTransform: 'none' }}
          >
            Limpiar
          </Button>
        )}
      </Box>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Filtros activos:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedCategories.map(catId => {
              const category = categories.find(c => c.id === catId);
              return category ? (
                <Chip
                  key={catId}
                  label={category.name}
                  size="small"
                  onDelete={() => handleCategoryChange(catId)}
                  color="primary"
                />
              ) : null;
            })}
            {selectedColors.map(color => (
              <Chip
                key={color}
                label={colors.find(c => c.value === color)?.name}
                size="small"
                onDelete={() => handleColorChange(color)}
                color="primary"
              />
            ))}
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Categories Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Categorías
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    color="primary"
                  />
                }
                label={category.name}
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Color Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Color
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {colors.map((color) => (
              <Box
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: color.color,
                  cursor: 'pointer',
                  border: selectedColors.includes(color.value) 
                    ? '3px solid #E53E3E' 
                    : '2px solid #E2E8F0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
                title={color.name}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Brand Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Marca
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    color="primary"
                  />
                }
                label={brand}
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Price Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Precio
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
              marks={[
                { value: 0, label: '$0' },
                { value: 500, label: '$500' },
                { value: 1000, label: '$1K' },
                { value: 1500, label: '$1.5K' },
                { value: 2000, label: '$2K' },
              ]}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#E2E8F0',
                },
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}