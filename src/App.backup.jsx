import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import skaevTheme from "./theme";
import useAuthStore from "./store/authStore";

// Layout Components
import AppLayout from "./components/layout/AppLayout/AppLayout";

// Auth Pages
import LoginPage from "./pages/auth/Login";

// Public Pages
import HomePage from "./pages/public/Home";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import FindStations from "./pages/customer/FindStations";

// Owner Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import StationManagement from "./pages/owner/StationManagement";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    switch (user?.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "owner":
        return <Navigate to="/owner/dashboard" replace />;
      case "customer":
        return <Navigate to="/customer/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={skaevTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Customer Routes */}
            <Route
              path="/customer/*"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <AppLayout>
                    <Routes>
                      <Route path="dashboard" element={<CustomerDashboard />} />
                      <Route path="find-stations" element={<FindStations />} />
                      <Route
                        path="*"
                        element={<Navigate to="dashboard" replace />}
                      />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Owner Routes */}
            <Route
              path="/owner/*"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <AppLayout>
                    <Routes>
                      <Route path="dashboard" element={<OwnerDashboard />} />
                      <Route path="stations" element={<StationManagement />} />
                      <Route
                        path="*"
                        element={<Navigate to="dashboard" replace />}
                      />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route
                        path="*"
                        element={<Navigate to="dashboard" replace />}
                      />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Routes */}
            <Route
              path="/unauthorized"
              element={<div>Unauthorized Access</div>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
