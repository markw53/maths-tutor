import axiosClient from "@/api/axiosClient";
import type {
  CreateLessonParams,
  UpdateLessonParams,
  Registration,
} from "@/types/lesson";

const lessonsApi = {
  // Fetch lessons with options for filtering, sorting, etc.
  getAllLessons: (
    sort_by: string = "start_time",
    order: string = "asc",
    limit: number = 10,
    page: number = 1,
    subject?: string // replaces category
  ) => {
    const params: {
      sort_by: string;
      order: string;
      limit: number;
      page: number;
      subject?: string;
    } = {
      sort_by,
      order,
      limit,
      page,
    };

    if (subject) {
      params.subject = subject;
    }

    return axiosClient.get("/lessons", { params });
  },

  // Get lessons that have already occurred
  getPastLessons: () => {
    return axiosClient.get("/lessons/past");
  },

  // List all available lesson subjects (was event categories)
  getLessonSubjects: () => {
    return axiosClient.get(`/lessons/subjects`);
  },

  // Get lessons in a specific subject
  getLessonSubjectByName: (name: string) => {
    return axiosClient.get(`/lessons/subjects/${name}`);
  },

  // Upcoming lessons
  getUpcomingLessons: () => {
    return axiosClient.get("/lessons/upcoming");
  },

  // Get a single lesson by ID
  getLessonById: (id: string) => {
    return axiosClient.get(`/lessons/${id}`);
  },

  // Get all registrations for a lesson
  getLessonRegistrations: (lessonId: string) => {
    return axiosClient.get(`/lessons/${lessonId}/registrations`);
  },

  // Check if a lesson is available for registration
  checkLessonAvailability: (lessonId: string) => {
    return axiosClient.get(`/lessons/${lessonId}/availability`);
  },

  // CRUD operations
  createLesson: (params: CreateLessonParams) => {
    return axiosClient.post("/lessons", params);
  },

  updateLesson: (id: string, params: UpdateLessonParams) => {
    return axiosClient.patch(`/lessons/${id}`, params);
  },

  deleteLesson: (id: string) => {
    return axiosClient.delete(`/lessons/${id}`);
  },

  // Register a user for a lesson
  registerForLesson: (lessonId: string, userId: string | number) => {
    return axiosClient.post(`/lessons/${lessonId}/register`, {
      user_id: Number(userId),
    });
  },

  // Cancel a registration
  cancelRegistration: (registrationId: string) => {
    return axiosClient.patch(`/lessons/registrations/${registrationId}/cancel`);
  },

  // Check if a user is already registered for a lesson
  isUserRegistered: async (
    lessonId: string,
    userId: string | number
  ): Promise<boolean> => {
    try {
      const response = await axiosClient.get(
        `/lessons/${lessonId}/registrations`
      );
      const registrations: Registration[] = response.data.registrations || [];
      return registrations.some(
        (registration) =>
          registration.user_id === Number(userId) &&
          registration.status === "registered"
      );
    } catch (error) {
      console.error("Error checking lesson registration status:", error);
      return false;
    }
  },
};

export default lessonsApi;