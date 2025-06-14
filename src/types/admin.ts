import type { Lesson } from "@/types/lesson";
import type { ReactNode } from "react";
import type { GroupResponse } from "./groups";
import type { GroupMember } from "./groups";
import type { User } from "./users";

// For lessons management modules
export interface LessonsManagementProps {
  lessons: Lesson[];
  totalLessons?: number;
  draftLessonsCount?: number;
}

// Often used for page shells/bases/shared UI shells
export interface ManagementBaseProps {
  title: string;
  description: string;
  addButtonLabel: string;
  addButtonIcon: ReactNode;
  onAddButtonClick?: () => void;
  loading: boolean;
  error: string | null;
  children: ReactNode;
}

// For managing collaborative groups
export interface GroupsManagementProps {
  groups: GroupResponse[];
  groupMembers: GroupMember[];
  totalGroups?: number;
  totalGroupMembers?: number;
}

// Used in create/edit group forms
export interface GroupParams {
  name: string;
  description?: string;
}

// For managing users
export interface UsersManagementProps {
  users: User[];
  totalUsers?: number;
}

// For super-admin/overview dashboard data
export interface AdminDashboardData {
  users: User[];
  groups: GroupResponse[];
  groupMembers: GroupMember[];
  lessons: Lesson[];  
  classes: Class[];
  classMembers: { id: number; userId: number; classId: number; role: string; }[];
  
}

// Define the Class type for better type safety
export interface Class {
  id: number;
  name: string;
  description?: string;
  // Add other relevant fields as needed
}

// If you need a flattened member shape for exports, etc.
export interface ExtractedGroupMember {
  userId: number;
  groupId: number;
  username: string;
  email: string;
  role: string;
}

// For statistical displays or dashboard cards
export interface StatsType {
  users: number;
  groups: number;
  lessons: number;
  groupMembers: number;
  classes: number;
  classMembers: number;
}