import type { Lesson } from "./lesson";

// Simplified user interface for auth context (maths tutoring focused)
export interface AuthUser {
  id: number;
  username: string;
  role?: string;
  is_site_admin?: boolean;
  // Add other lesson-platform-specific fields if needed, e.g. subject_expertise, etc.
}

// Card display variants for lessons (e.g. on dashboard, search, etc.)
export type LessonCardVariant = "default" | "dashboard" | "compact";

// Options controlling lesson card section visibility
export interface LessonCardOptions {
  showImage?: boolean;
  showCategory?: boolean;
  showLocation?: boolean;
  showDescription?: boolean;
  showTimeDetails?: boolean;
  showPriceDetails?: boolean;
  showTutorInfo?: boolean;            // was showCreatorInfo
  showActionButtons?: boolean;
  fixedHeight?: boolean;
  imageHeight?: string;
  titleLines?: number;
  descriptionLines?: number;
}

// Card props for displaying a lesson
export interface LessonProps {
  lesson: Lesson;
  userId?: string | number;
  className?: string;
  variant?: LessonCardVariant;
  options?: LessonCardOptions;
}

// Props for lesson form component (for creating/editing lessons)
export interface LessonFormProps {
  lesson?: Lesson;
  isEditing?: boolean;
}