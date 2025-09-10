import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Close,
  LocalOffer,
} from '@mui/icons-material';
import { Tag } from '../../types';
import { getTags } from '../../services/productService';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
        setFilteredTags(tags);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };

    loadTags();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTags(availableTags);
    } else {
      setFilteredTags(
        availableTags.filter(tag =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, availableTags]);

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tag]);
      }
    }
  };

  const handleRemoveTag = (tagId: number) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Tags del producto
      </Typography>

      {/* Selected Tags */}
      <Box sx={{ mb: 2 }}>
        {selectedTags.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay tags seleccionados
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onDelete={() => handleRemoveTag(tag.id)}
                sx={{
                  bgcolor: tag.color,
                  color: 'white',
                  '& .MuiChip-deleteIcon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: 'white',
                    },
                  },
                }}
                size="small"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Add Tag Button */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleOpen}
        disabled={selectedTags.length >= maxTags}
        sx={{ mb: 2 }}
      >
        {selectedTags.length >= maxTags 
          ? `Máximo ${maxTags} tags`
          : 'Agregar Tags'
        }
      </Button>

      {/* Tag Selection Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalOffer color="primary" />
            Seleccionar Tags
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            placeholder="Buscar tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona hasta {maxTags} tags para tu producto:
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.some(t => t.id === tag.id);
              const isDisabled = !isSelected && selectedTags.length >= maxTags;

              return (
                <Tooltip 
                  key={tag.id}
                  title={isDisabled ? `Máximo ${maxTags} tags` : ''} 
                  arrow
                >
                  <span>
                    <Chip
                      label={tag.name}
                      onClick={() => handleTagToggle(tag)}
                      disabled={isDisabled}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{
                        bgcolor: isSelected ? tag.color : 'transparent',
                        color: isSelected ? 'white' : 'text.primary',
                        borderColor: tag.color,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        '&:hover': {
                          bgcolor: isDisabled 
                            ? 'transparent' 
                            : isSelected 
                              ? tag.color 
                              : `${tag.color}20`,
                        },
                        '&.Mui-disabled': {
                          opacity: 0.6,
                        },
                      }}
                    />
                  </span>
                </Tooltip>
              );
            })}
          </Box>

          {filteredTags.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron tags con "{searchQuery}"
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>
            Cerrar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleClose}
            disabled={selectedTags.length === 0}
          >
            Confirmar ({selectedTags.length} seleccionados)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}