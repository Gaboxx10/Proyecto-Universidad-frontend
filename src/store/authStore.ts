import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { persist } from "zustand/middleware";

// Definir la interfaz de usuario
interface User {
  id: string;
  user_name: string;
  nombre: string;
  rol: string;
}

// Definir la interfaz del estado de autenticación
interface AuthState {
  user: User;
  isAuthenticated: boolean;
  loginError: string | null;
  login: (user_name: string, password: string) => void;
  logout: () => void;
  mutateLogin: (user_name: string, password: string) => Promise<void>;
  fetchUserData: (userId: string, token: string) => Promise<void>;
}

// Crear el store con Zustand y persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "",
        user_name: "",
        nombre: "",
        rol: "",
      },
      isAuthenticated: false,
      loginError: null,

      // Login
      login: (user_name, password) => {
        set({ loginError: null });
        useAuthStore.getState().mutateLogin(user_name, password);
      },

      // Logout
      logout: () => {
        localStorage.removeItem("token");
        set({
          user: { id: "", user_name: "", nombre: "", rol: "" },
          isAuthenticated: false,
        });
      },

      // Lógica de login (mutación)
      mutateLogin: async (user_name: string, password: string) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/auth/login",
            {
              user_name,
              password,
            }
          );

          const { token } = response.data;

          if (token) {
            localStorage.setItem("token", token);

            const decodedToken = jwtDecode<{ sub: string }>(token);
            const userId = decodedToken.sub;

            await useAuthStore.getState().fetchUserData(userId, token);
          } else {
            throw new Error("Token no encontrado.");
          }
        } catch (error) {
          console.error("Error en la autenticación:", error);
          set({
            loginError: error.response?.data?.message || "Error desconocido",
          });
        }
      },

      // Obtener datos del usuario
      fetchUserData: async (userId: string, token: string) => {
        try {
          const userDataResponse = await axios.get(
            `http://localhost:3000/usuario/users/id/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const userData = userDataResponse.data.data;
          if (userData && userData.datos) {
            set({
              user: {
                id: userData.id,
                user_name: userData.user_name,
                nombre: `${userData.datos.nombres} ${userData.datos.apellidos}`,
                rol: userData.rol,
              },
              isAuthenticated: true,
            });
          } else {
            throw new Error("Datos del usuario no encontrados.");
          }
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
          set({ loginError: error.message || "Error desconocido" });
        }
      },
    }),
    {
      name: "auth-storage", // Nombre único para el almacenamiento
      // Almacenar en localStorage (por defecto)
    }
  )
);
