import React, { useState, useEffect } from 'react';
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
  Switch,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  Star,
} from '@mui/icons-material';
import { Category, Tag } from '../../types';
import { getTags, getBrands } from '../../services/productService';

interface FilterSidebarProps {
  categories: Category[];
  onCategoryFilter: (categoryIds: number[]) => void;
  onPriceFilter: (min: number, max: number) => void;
  onBrandFilter: (brands: string[]) => void;
  onTagFilter: (tags: string[]) => void;
  onFeaturedFilter: (featured: boolean) => void;
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

export default function FilterSidebar({
  categories,
  onCategoryFilter,
  onPriceFilter,
  onBrandFilter,
  onTagFilter,
  onFeaturedFilter,
  onClearFilters,
}: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Load tags and brands
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tags, brands] = await Promise.all([
          getTags(),
          getBrands()
        ]);
        setAvailableTags(tags);
        setAvailableBrands(brands);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    loadData();
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onCategoryFilter(newSelection);
  };

  const handleBrandChange = (brand: string) => {
    const newSelection = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    setSelectedBrands(newSelection);
    onBrandFilter(newSelection);
  };

  const handleTagChange = (tagName: string) => {
    const newSelection = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(newSelection);
    onTagFilter(newSelection);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    const [min, max] = newValue as number[];
    onPriceFilter(min, max);
  };

  const handleFeaturedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturedOnly(event.target.checked);
    onFeaturedFilter(event.target.checked);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTags([]);
    setFeaturedOnly(false);
    setPriceRange([0, 2000]);
    onClearFilters();
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedBrands.length > 0 || 
                          selectedTags.length > 0 ||
                          featuredOnly ||
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
            {selectedBrands.map(brand => (
              <Chip
                key={brand}
                label={brand}
                size="small"
                onDelete={() => handleBrandChange(brand)}
                color="primary"
              />
            ))}
            {selectedTags.map(tagName => (
              <Chip
                key={tagName}
                label={tagName}
                size="small"
                onDelete={() => handleTagChange(tagName)}
                color="primary"
              />
            ))}
            {featuredOnly && (
              <Chip
                label="Destacados"
                size="small"
                onDelete={() => handleFeaturedChange({ target: { checked: false } } as any)}
                color="secondary"
                icon={<Star />}
              />
            )}
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

      {/* Brand Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Marca
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {availableBrands.map((brand) => (
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

      {/* Tags Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Tags
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onClick={() => handleTagChange(tag.name)}
                variant={selectedTags.includes(tag.name) ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: selectedTags.includes(tag.name) ? tag.color : 'transparent',
                  color: selectedTags.includes(tag.name) ? 'white' : 'text.primary',
                  borderColor: tag.color,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: selectedTags.includes(tag.name) 
                      ? tag.color 
                      : `${tag.color}20`,
                  },
                }}
                size="small"
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Featured Filter */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={featuredOnly}
              onChange={handleFeaturedChange}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star color="action" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Solo productos destacados
              </Typography>
            </Box>
          }
        />
      </Box>

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