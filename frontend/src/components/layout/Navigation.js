import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate(user?.is_staff ? '/admin' : '/dashboard')}
          >
            Rewards App
          </Typography>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">
                Welcome, {user.first_name || user.username}
              </Typography>
              {user.is_staff && (
                <Button 
                  color="inherit"
                  variant={isAdminPage ? "outlined" : "text"}
                  onClick={() => navigate('/admin')}
                  sx={{ fontWeight: 'bold' }}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button 
                color="inherit"
                variant={!isAdminPage ? "outlined" : "text"}
                onClick={() => navigate('/dashboard')}
              >
                User Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
