import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: 'bi-house', label: 'Inicio', path: '/dashboard' },
    { icon: 'bi-building', label: 'Empresa', path: '/dashboard/empresa', adminOnly: true },
    { icon: 'bi-people', label: 'Usuarios', path: '/dashboard/usuarios', adminOnly: true },
    { icon: 'bi-person', label: 'Clientes', path: '/dashboard/clientes' },
    { icon: 'bi-car-front', label: 'Vehículos', path: '/dashboard/vehiculos' },
    { icon: 'bi-tools', label: 'Diagnósticos', path: '/dashboard/diagnosticos' },
    { icon: 'bi-file-text', label: 'Presupuestos', path: '/dashboard/presupuestos' },
    { icon: 'bi-clipboard', label: 'Órdenes de Trabajo', path: '/dashboard/ordenes' },
    { icon: 'bi-receipt', label: 'Facturas', path: '/dashboard/facturas' },
    { icon: 'bi-shop', label: 'Proveedores', path: '/dashboard/proveedores' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <i className="bi bi-tools text-2xl"></i>
            <span className="text-xl font-bold">MecaSoft</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {menuItems.map((item) => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <i className={`bi ${item.icon} text-xl`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="bi bi-tools text-2xl text-blue-600"></i>
              <h1 className="text-2xl font-semibold text-gray-900">
                MecaSoft - {user.companyName || 'Taller Mecánico Default'}
              </h1>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="bi bi-person text-gray-600"></i>
                </div>
                <span className="text-gray-700">{user.nombre}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <i className="bi bi-person me-2"></i>
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}