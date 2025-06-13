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
  group_id: number;
  user_id: number;
  full_name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  joined_at: string;
}

/** For use in the user's record, to connect them to their group */
export interface UserGroup {
  group_id: number;
  group_name: string;
  group_description?: string;
  role: "student" | "tutor" | "admin";
}

/** For API response list */
export interface GroupResponse {
  group: Group;
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