import axiosClient from "../api/axiosClient";
import type {
  UpdateUserParams,
  CreateUserParams,
  PromoteToAdminParams,
  // ... any extra user-related types
} from "../types/users";

/**
 * usersApi: Contains all user-related server calls.
 * Assumes your backend exposes these REST endpoints and talks to PostgreSQL
 */
const usersApi = {
  // Get all users (Admin only)
  getAllUsers: () => {
    return axiosClient.get("/users");
  },

  // Get a user by their id
  getUserById: (id: string) => {
    return axiosClient.get(`/users/${id}`);
  },

  // Check if a user is a site admin (by id)
  getIsSiteAdmin: (id: string) => {
    return axiosClient.get(`/users/${id}/is-site-admin`);
  },

  // Find a user by username (for profile search, etc.)
  getUserByUsername: (username: string) => {
    return axiosClient.get(`/users/username/${username}`);
  },

  // Find a user by email
  getUserByEmail: (email: string) => {
    return axiosClient.get(`/users/email/${email}`);
  },

  // Get this user's lesson registrations (RENAME if used for lessons, or remove if not needed)
  getUserLessonRegistrations: (id: string) => {
    return axiosClient.get(`/users/${id}/lesson-registrations`);
  },

  // Create a new user (Admin function, not for self-registered users)
  createUser: (params: CreateUserParams) => {
    return axiosClient.post("/users", params);
  },

  // Update user details (such as profile, etc.)
  updateUser: (id: string, params: UpdateUserParams) => {
    return axiosClient.patch(`/users/${id}`, params);
  },

  // Promote user to admin (Admin only)
  promoteToAdmin: (id: string, params: PromoteToAdminParams) => {
    return axiosClient.patch(`/admin/users/${id}`, params);
  },

  // Delete a user (Admin only)
  deleteUser: (id: string) => {
    return axiosClient.delete(`/users/${id}`);
  },

  // Admin dashboard consolidated data endpoint
  getAdminDashboardData: () => {
    return axiosClient.get("/admin/dashboard");
  },

  // Add custom endpoints as needed...
};

export default usersApi;