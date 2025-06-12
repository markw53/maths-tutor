// Auth type definitions for MathsTutor

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  // Optionally add: full_name?: string;
  // Optionally add: role?: "student" | "tutor";
  // Add any other fields relevant to your registration form
}

export interface LoginParams {
  username: string; // or change to "emailOrUsername" if you support both
  password: string;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

// Optionally match structure of your User type for richer context
export interface AuthResponse {
  status: string;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      full_name?: string;
      role?: "student" | "tutor" | "admin";
      is_site_admin?: boolean;
      profile_image_url?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}