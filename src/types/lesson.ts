// Lesson.ts

export interface Lesson {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  price?: number; // price is now optional
  max_attendees?: number;
  spots_remaining?: number; // clearer for lessons than tickets
  status: "draft" | "published" | "cancelled" | string;
  subject: string;
  tutor_username?: string; // replaces creator_username
  class_name?: string; // replaces creator_class_name
  is_public: boolean;
  is_past: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  lesson_img_url?: string;
}

export interface LessonDetail extends Lesson {}

export interface LessonsListProps {
  lessons: Lesson[];
  userId?: string | number;
}

export interface CreateLessonParams {
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  location?: string;
  price?: number;
  max_attendees?: number;
  subject?: string;
  is_public?: boolean;
  lesson_img_url?: string;
  [key: string]: unknown;
}

export interface UpdateLessonParams {
  title?: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
  max_attendees?: number;
  spots_remaining?: number;
  status?: "draft" | "published" | "cancelled";
  subject?: string;
  is_public?: boolean;
  lesson_img_url?: string;
}

export interface Registration {
  id: number;
  lesson_id: number;
  user_id: number;
  registration_time: string;
  status: string; // e.g. "registered" | "cancelled"
  username: string;
  email: string;
}

// Extended registration interface with lesson details used in calendar
export interface LessonRegistration extends Registration {
  start_time: string;
  end_time: string;
  lesson_title: string;
  lesson_description?: string;
  lesson_location?: string;
  lesson_status?: string;
  lesson_img_url?: string;
}

export interface CardItem {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

export interface Subject {
  id: number;
  name: string;
}

// If you use Stripe for lesson payments:
export interface StripeLessonCheckoutProps {
  lesson: LessonDetail;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}