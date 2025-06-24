// types/groups.ts

/** Single group (study group/collaboration group) */
export interface Group {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

/** Group member (student or tutor in a group) */
export interface GroupMember {
  id: number;
  group_id: string;
  user_id: number;
  full_name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  joined_at: string;
  avatar_url?: string; // Optional avatar URL for the user
  username?: string; // Optional username for the user
  created_at: string;
}

/** For use in the user's record, to connect them to their group */
export interface UserGroup {
  group_id: string;
  group_name: string;
  group_description?: string;
  role: "student" | "tutor" | "admin";
  groups?: string;// For nested groups if needed
}

/** For API response list */
export interface GroupResponse {
  group: Group;
  id: number;
  name: string;
  // Add description if it should exist
  description?: string;
  created_at: string;
  updated_at?: string;
  member_count?: number;
}

export interface GroupListResponse {
  groups: Group[];
}
export interface GroupMemberResponse {
  member: GroupMember;
}
export interface GroupMemberListResponse {
  members: GroupMember[];
}
// For group creation/update (admin forms)
export interface CreateGroupParams {
  name: string;
  description?: string;
}
export interface UpdateGroupParams {
  name?: string;
  description?: string;
}

// For group member management (adding/removing)
export interface AddGroupMemberParams {
  group_id: number;
  user_id: number;
  role: "student" | "tutor" | "admin";
}