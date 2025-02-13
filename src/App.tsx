import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ClientsPage from './pages/ClientsPage';
import CompanyPage from './pages/CompanyPage';
import VehiclesPage from './pages/VehiclesPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import QuotesPage from './pages/QuotesPage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import InvoicesPage from './pages/InvoicesPage';
import SuppliersPage from './pages/SuppliersPage';
import ProfilePage from './pages/ProfilePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="empresa" element={<CompanyPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="vehiculos" element={<VehiclesPage />} />
          <Route path="diagnosticos" element={<DiagnosticsPage />} />
          <Route path="presupuestos" element={<QuotesPage />} />
          <Route path="ordenes" element={<WorkOrdersPage />} />
          <Route path="facturas" element={<InvoicesPage />} />
          <Route path="proveedores" element={<SuppliersPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;