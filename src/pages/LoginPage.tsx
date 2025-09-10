import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const switchToRegister = () => {
    setTabValue(1);
  };

  const switchToLogin = () => {
    setTabValue(0);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Haversack
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              fontWeight: 300,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Tu marketplace de confianza
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            overflow: 'hidden',
            borderRadius: 3,
            maxWidth: 600,
            mx: 'auto',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: alpha(theme.palette.common.white, 0.7),
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 2,
                },
                '& .Mui-selected': {
                  color: 'white',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3,
                },
              }}
            >
              <Tab label="Iniciar Sesión" />
              <Tab label="Crear Cuenta" />
            </Tabs>
          </Box>

          <Box sx={{ p: 0 }}>
            <TabPanel value={tabValue} index={0}>
              <LoginForm onSwitchToRegister={switchToRegister} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <RegisterForm onSwitchToLogin={switchToLogin} />
            </TabPanel>
          </Box>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.8),
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            © 2024 Haversack. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}