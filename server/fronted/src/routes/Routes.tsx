import { Box } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import DashboardRoutes from "../features/dashboard/routes/DashboardRoutes";
import LoginRoutes from "../features/login/routes/LoginRoutes";
import SettingsRoutes from "../features/settings/routes/SettingsRoutes";
import Root from "./root";

const ProtectedRoute = ({ hasToken, children }) => {
  if (!hasToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ hasToken, children }) => {
  if (hasToken) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const routes = (hasToken) => [
  {
    path: "/",
    element: hasToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute hasToken={hasToken}>
        <Outlet />
      </PublicRoute>
    ),
    children: LoginRoutes(),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute hasToken={hasToken}>
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
    path: "/settings", // Ajoutez cette route pour les paramètres
    element: (
      <ProtectedRoute hasToken={hasToken}>
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

export default routes;
