import axiosClient from "../api/axiosClient";
import type {
  RegisterParams,
  LoginParams,
  RefreshTokenParams,
  AuthResponse, // adjust depending on your backend response shape
} from "../types/auth";

/**
 * Auth API interface - assumes your backend provides these endpoints:
 *   - POST /auth/register
 *   - POST /auth/login
 *   - POST /auth/refresh-token
 *   - POST /auth/logout
 *
 * Your backend (Node/Express, Django, etc.) is responsible for talking to PostgreSQL.
 */
const authApi = {
  /**
   * Registers a user account.
   * POST /auth/register
   */
  register: (params: RegisterParams) => {
    return axiosClient.post<AuthResponse>("/auth/register", params);
  },

  /**
   * Login with username/email and password.
   * POST /auth/login
   * Returns JWT access/refresh tokens and user data.
   */
  login: (params: LoginParams) => {
    return axiosClient.post<AuthResponse>("/auth/login", params);
  },

  /**
   * Refresh the access token.
   * POST /auth/refresh-token
   * Expects: { refreshToken }
   */
  refreshToken: (params: RefreshTokenParams) => {
    return axiosClient.post<AuthResponse>("/auth/refresh-token", params);
  },

  /**
   * Logout (invalidate refresh token server side).
   * POST /auth/logout
   */
  logout: (refreshToken: string) => {
    return axiosClient.post("/auth/logout", { refreshToken });
  },
};

export default authApi;