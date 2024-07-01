import { Box } from '@mui/material';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import DashboardRoutes from '../features/dashboard/routes/DashboardRoutes';
import LoginRoutes from '../features/login/routes/LoginRoutes';
import SettingsRoutes from '../features/settings/routes/SettingsRoutes';
import Root from './root';
import useAuthStore from '../stores/authStore';
// Assurez-vous d'importer correctement useAuthStore

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore(); // Utilisez le token depuis le store
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuthStore(); // Utilisez le token depuis le store
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const routes = () => {
  const { token } = useAuthStore(); // Utilisez le token depuis le store

  return [
    {
      path: '/',
      element: <Navigate to={token ? '/dashboard' : '/login'} replace />,
    },
    {
      path: '/login',
      element: (
        <PublicRoute>
          <Outlet />
        </PublicRoute>
      ),
      children: LoginRoutes(),
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Header />
          <Box className="mainContainer">
            <Outlet />
          </Box>
          <Root />
        </ProtectedRoute>
      ),
      children: DashboardRoutes(),
    },
    {
      path: '/settings',
      element: (
        <ProtectedRoute>
          <Header />
          <Box className="mainContainer">
            <Outlet />
          </Box>
          <Root />
        </ProtectedRoute>
      ),
      children: SettingsRoutes(),
    },
  ];
};

export default routes;
