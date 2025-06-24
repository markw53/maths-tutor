// User type definitions for MathsTutor

// User roles suggestion for a maths tutor site:
export type UserRole = "student" | "tutor" | "admin"; // expand as needed

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role?: "student" | "tutor" | "admin";
  groups?: UserGroup[]; // Optional, if using groups or classes
  is_site_admin?: boolean;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// For updating a user (admin or user editing own profile)
export interface UpdateUserParams {
  username?: string;
  email?: string;
  profile_image_url?: string;
  full_name?: string;
  role?: UserRole;
  [key: string]: unknown;
}

// For creating a new user
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role?: UserRole;
}

// Admin promoting a user
export interface PromoteToAdminParams {
  is_site_admin: boolean;
}

/**
 * Example: If using groups or classes instead of teams,
 * create an interface like below. Otherwise, keep teams as is.
 */
// export interface UserGroup {
//   group_id: number;
//   group_name: string;
//   group_description: string;
//   role: string; // "member" | "tutor" | "group_admin"
// }

// Teams, if you keep them:
export interface UserGroup {
  group_id: number;
  group_name: string;
  group_description: string;
  role: string; // "team_admin", "member", etc.
}