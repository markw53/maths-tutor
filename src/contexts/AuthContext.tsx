import {
  createContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "@/api/auth";
import usersApi from "@/api/users";
import type { User } from "@/types/users"; // CHANGE to your user type

// 1. TypeScript interfaces for strongly typing context
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

// 2. Create Context (not exported!), only export the hook and the Provider component
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

// 3. Custom hook to use AuthContext everywhere
// Moved to useAuth.ts for Fast Refresh compatibility

// 4. Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSiteAdmin, setIsSiteAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch full user data from API
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

  // Checks user admin status
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

  // Update user data in context and local storage
  const updateUserData = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));
  };

  // Load auth state on mount or on cross-tab storage events
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
          if (parsedUserData.id) {
            await fetchUserData(parsedUserData.id);
          }
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
    // eslint-disable-next-line
  }, []);

  // Helper to clear everything from localStorage and state
  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
    setIsSiteAdmin(false);
  };

  // Login logic
  const login = async (username: string, password: string): Promise<void> => {
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
      localStorage.setItem("userData", JSON.stringify(initialUserData));
      setUser(initialUserData);
      setIsAuthenticated(true);
      if (initialUserData.id) {
        await fetchUserData(initialUserData.id);
      }
      window.dispatchEvent(new Event("storage"));
      // Do not return anything to match Promise<void>
    } catch (err: unknown) {
      let errorMessage = "Login failed. Please try again.";
      if (err && typeof err === "object") {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object"
        ) {
          const response = (err as { response?: { data?: { message?: string; msg?: string } } }).response;
          errorMessage =
            response?.data?.message ||
            response?.data?.msg ||
            (err as unknown as Error).message ||
            errorMessage;
        } else if (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message?: string }).message === "string"
        ) {
          errorMessage = (err as { message?: string }).message as string;
        }
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout logic
  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setLoading(false);
      navigate("/auth/login");
      window.dispatchEvent(new Event("storage"));
    }
  };

  // Object that will be used by the context consumers
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
