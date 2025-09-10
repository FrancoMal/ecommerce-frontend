import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Alert,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Add,
  Image as ImageIcon,
} from '@mui/icons-material';
import { UploadedImage } from '../../types';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  maxSize = 5,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      setError('');
      const newImages: UploadedImage[] = [];

      Array.from(files).forEach((file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Solo se permiten archivos de imagen');
          return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(`El archivo debe ser menor a ${maxSize}MB`);
          return;
        }

        // Check if we haven't exceeded max images
        if (images.length + newImages.length >= maxImages) {
          setError(`Máximo ${maxImages} imágenes permitidas`);
          return;
        }

        const uploadedImage: UploadedImage = {
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random().toString(),
        };

        newImages.push(uploadedImage);
      });

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, maxImages, maxSize, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter(img => img.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Imágenes del producto *
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Upload Area */}
      <Paper
        variant="outlined"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: dragOver ? 'primary.main' : 'grey.300',
          bgcolor: dragOver ? 'primary.50' : 'background.paper',
          transition: 'all 0.2s ease',
          mb: 3,
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />

        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Arrastra imágenes aquí o haz clic para seleccionar
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Máximo {maxImages} imágenes, {maxSize}MB cada una
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<Add />}
          component="span"
        >
          Seleccionar Imágenes
        </Button>
      </Paper>

      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Subiendo imágenes...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Preview Images */}
      {images.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Imágenes cargadas ({images.length}/{maxImages})
          </Typography>
          
          <ImageList cols={4} gap={8}>
            {images.map((image, index) => (
              <ImageListItem
                key={image.id}
                sx={{
                  position: 'relative',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: index === 0 ? '2px solid' : '1px solid',
                  borderColor: index === 0 ? 'primary.main' : 'grey.300',
                }}
              >
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                  style={{
                    height: 100,
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
                
                {index === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    Principal
                  </Box>
                )}
                
                <IconButton
                  onClick={() => removeImage(image.id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'error.main',
                    color: 'white',
                    width: 28,
                    height: 28,
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                  }}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ImageListItem>
            ))}
            
            {/* Add more button */}
            {images.length < maxImages && (
              <ImageListItem
                sx={{
                  border: '1px dashed',
                  borderColor: 'grey.400',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  },
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleInputChange}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <ImageIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="caption">Agregar</Typography>
                </Box>
              </ImageListItem>
            )}
          </ImageList>
        </Box>
      )}
    </Box>
  );
}