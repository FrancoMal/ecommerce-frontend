import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

export const createHaversackTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#E53E3E', // Rojo vibrante Haversack
      light: '#F56565',
      dark: '#C53030',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#ffffff' : '#1A202C', // Blanco en dark mode, negro en light
      light: mode === 'dark' ? '#f7fafc' : '#2D3748',
      dark: mode === 'dark' ? '#e2e8f0' : '#171923',
      contrastText: mode === 'dark' ? '#1A202C' : '#ffffff',
    },
    tertiary: {
      main: '#10b981', // Verde éxito
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: mode === 'dark' ? '#1A202C' : '#ffffff', // Negro en dark, blanco en light
      paper: mode === 'dark' ? '#2D3748' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#1A202C', // Blanco en dark, negro en light
      secondary: mode === 'dark' ? '#CBD5E0' : '#718096', // Gris claro en dark, gris medio en light
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #E53E3E 0%, #F56565 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #C53030 0%, #E53E3E 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#2D3748' : '#ffffff',
          color: mode === 'dark' ? '#ffffff' : '#1A202C',
          boxShadow: mode === 'dark' 
            ? '0 1px 3px rgba(0,0,0,0.3)' 
            : '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: `1px solid ${mode === 'dark' ? '#4A5568' : '#E2E8F0'}`,
        },
      },
    },
  },
});

// Export default light theme for compatibility
export const theme = createHaversackTheme('light');