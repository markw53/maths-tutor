// src/contexts/AuthContext.tsx
import {
  createContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth";  // <-- These functions should use a backend hooked to PostgreSQL
import usersApi from "../api/users";
import type { User } from "../types/users";

// Context type definition
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  isSiteAdmin: boolean;
  checkSiteAdmin: () => Promise<void>;
  updateUserData: (userData: Partial<User>) => void;
}

// Default context value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  error: null,
  isSiteAdmin: false,
  checkSiteAdmin: async () => {},
  updateUserData: () => {},
});

// useAuth hook moved to its own file (useAuth.ts)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSiteAdmin, setIsSiteAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get updated user data
  const fetchUserData = async (userId: number) => {
    try {
      const response = await usersApi.getUserById(userId.toString());
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsSiteAdmin(!!userData.is_site_admin);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  };

  // Check admin status (using API)
  const checkSiteAdmin = async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const response = await usersApi.getIsSiteAdmin(user.id.toString());
      setIsSiteAdmin(response.data.is_site_admin === true);
    } catch (error) {
      console.error("Failed to check admin status:", error);
      setIsSiteAdmin(false);
    }
  };

  // Update user in context+localStorage
  const updateUserData = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage")); // sync
  };

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setIsAuthenticated(true);
          setIsSiteAdmin(!!parsedUserData.is_site_admin);
          if (parsedUserData.id) await fetchUserData(parsedUserData.id);
        } catch (e) {
          console.error("Failed to parse user data:", e);
          clearAuthData();
        }
      }

      setLoading(false);
    };

    initializeAuth();
    window.addEventListener("storage", initializeAuth);
    return () => window.removeEventListener("storage", initializeAuth);
  }, []);

  // Helper to clear all auth
  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
    setIsSiteAdmin(false);
  };

  // Login (adjust for actual backend API + JWT!)
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ username, password });
      const responseData = response.data.data;
      if (!responseData || !responseData.accessToken) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("token", responseData.accessToken);
      localStorage.setItem("refreshToken", responseData.refreshToken);

      const initialUserData = responseData.user;
      // Ensure required fields for User type
      const userWithTimestamps = {
        ...initialUserData,
      };
      localStorage.setItem("userData", JSON.stringify(userWithTimestamps));
      setUser(userWithTimestamps);
      setIsAuthenticated(true);
      setIsSiteAdmin(!!initialUserData.is_site_admin);
      if (initialUserData.id) {
        await fetchUserData(initialUserData.id);
      }
      window.dispatchEvent(new Event("storage"));
      // Do not return anything to match the expected type
    } catch (err: unknown) {
      let errorMessage = "Login failed. Please try again.";
      if (typeof err === "object" && err !== null) {
        const errorObj = err as { response?: { data?: { message?: string; msg?: string } }; message?: string };
        if ("response" in errorObj && typeof errorObj.response === "object" && errorObj.response !== null) {
          const response = errorObj.response;
          if ("data" in response && typeof response.data === "object" && response.data !== null) {
            errorMessage =
              response.data.message ||
              response.data.msg ||
              errorMessage;
          }
        } else if ("message" in errorObj && typeof errorObj.message === "string") {
          errorMessage = errorObj.message;
        }
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuthData();
      setLoading(false);
      navigate("/auth/login");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    error,
    isSiteAdmin,
    checkSiteAdmin,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;