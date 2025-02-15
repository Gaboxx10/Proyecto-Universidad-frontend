import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { showAlert } from "../utils/alerts";

export default function LoginPage() {
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loginError = useAuthStore((state) => state.loginError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    await login(user_name, password);
    setLoading(false); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <i className="bi bi-tools text-4xl text-blue-600"></i>
          <h1 className="text-2xl font-bold ml-2">MecaSoft</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={user_name}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <i className="bi bi-person absolute left-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <i className="bi bi-lock absolute left-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            disabled={loading} 
          >
            {loading ? (
              <span>Cargando...</span> 
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
          {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
        </form>
      </div>
    </div>
  );
}
