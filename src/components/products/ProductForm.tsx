import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Close,
  Save,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateProductData, Category, Tag, UploadedImage } from '../../types';
import { getCategories, createProduct } from '../../services/productService';
import ImageUploader from '../common/ImageUploader';
import TagSelector from '../common/TagSelector';
import { useAuth } from '../../context/AuthContext';

// Define a specific form data type
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  brand: string;
}

const schema = yup.object({
  name: yup
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .required('El nombre es requerido'),
  description: yup
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .required('La descripción es requerida'),
  price: yup
    .number()
    .min(0.01, 'El precio debe ser mayor a 0')
    .max(999999, 'El precio es demasiado alto')
    .required('El precio es requerido'),
  stock: yup
    .number()
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .max(999999, 'El stock es demasiado alto')
    .required('El stock es requerido'),
  categoryId: yup
    .number()
    .required('La categoría es requerida'),
  brand: yup
    .string()
    .default(''),
});

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: any; // For future edit functionality
}

const steps = ['Información Básica', 'Imágenes', 'Tags y Características'];

export default function ProductForm({
  open,
  onClose,
  onSuccess,
  editProduct,
}: ProductFormProps) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      brand: '',
    },
  });

  const formValues = watch();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    if (open) {
      loadCategories();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      reset();
      setImages([]);
      setSelectedTags([]);
      setFeatured(false);
      setActiveStep(0);
      setError('');
      setSuccess('');
    }
  }, [open, reset]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Basic validation for required fields
      const currentValues = watch();
      if (!currentValues.name?.trim() || !currentValues.description?.trim() || !currentValues.price || !currentValues.categoryId) {
        setError('Complete todos los campos básicos para continuar');
        return;
      }
    }
    
    if (activeStep === 1) {
      // Validate images
      if (images.length === 0) {
        setError('Debe agregar al menos una imagen');
        return;
      }
    }

    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setError('');

      // Validate final requirements
      if (images.length === 0) {
        setError('Debe agregar al menos una imagen');
        return;
      }

      if (selectedTags.length === 0) {
        setError('Debe seleccionar al menos un tag');
        return;
      }

      const productData: CreateProductData = {
        ...data,
        brand: data.brand.trim() || undefined, // Convierte string vacío a undefined
        images: images.map(img => img.file),
        tags: selectedTags,
        featured,
      };

      await createProduct(productData);
      
      setSuccess('¡Producto creado exitosamente!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: 600 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        bgcolor: 'primary.main',
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6" component="div">
          {editProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Information */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Información Básica
              </Typography>

              <TextField
                {...register('name')}
                fullWidth
                label="Nombre del producto"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />

              <TextField
                {...register('description')}
                fullWidth
                label="Descripción"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  {...register('price')}
                  label="Precio"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  sx={{ flex: 1 }}
                />

                <TextField
                  {...register('stock')}
                  label="Stock"
                  type="number"
                  inputProps={{ min: 0 }}
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                  sx={{ flex: 1 }}
                />
              </Box>

              <FormControl fullWidth error={!!errors.categoryId} sx={{ mb: 2 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  {...register('categoryId')}
                  label="Categoría"
                  defaultValue={0}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                {...register('brand')}
                fullWidth
                label="Marca (opcional)"
                placeholder="Ej: Apple, Nike, Samsung..."
                helperText="Deja vacío si no tiene marca específica"
              />
            </Box>
          )}

          {/* Step 2: Images */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Imágenes del Producto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Agrega imágenes atractivas para mostrar tu producto
              </Typography>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                maxImages={5}
                maxSize={5}
              />
            </Box>
          )}

          {/* Step 3: Tags and Features */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Tags y Características
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Agrega tags para ayudar a los usuarios a encontrar tu producto
              </Typography>

              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                maxTags={5}
              />

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Producto destacado</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Los productos destacados aparecen primero en la lista
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            disabled={loading}
            startIcon={<ArrowBack />}
          >
            Anterior
          </Button>
        )}

        {!isLastStep ? (
          <Button
            onClick={handleNext}
            variant="contained"
            endIcon={<ArrowForward />}
            disabled={loading}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            startIcon={<Save />}
            disabled={loading || images.length === 0 || selectedTags.length === 0}
          >
            {loading ? 'Creando...' : 'Crear Producto'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}