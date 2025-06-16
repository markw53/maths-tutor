import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lessonsApi from "@/api/lessons";
import groupsApi from "@/api/groups";
import usersApi from "@/api/users";
import ticketsApi from "@/api/tickets";
import { Lesson } from "@/types/lessons";
import { useDebounce } from "./useDebounce";
import { useState, useEffect } from "react";

// React Query Key Factory for Lessons
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...lessonKeys.lists(), filters] as const,
  categories: () => [...lessonKeys.all, "categories"] as const,
  search: (query: string) => [...lessonKeys.all, "search", query] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: number | string) => [...lessonKeys.details(), id] as const,
  enrollments: (id: number | string) =>
    [...lessonKeys.detail(id), "enrollments"] as const,
  userEnrollmentStatus: (lessonId: number | string, userId: number | string) =>
    [...lessonKeys.detail(lessonId), "enrolled", userId] as const,
  userPaymentStatus: (lessonId: number | string, userId: number | string) =>
    [...lessonKeys.detail(lessonId), "payment", userId] as const,
  editPermission: (lessonId: number | string, userId: number | string) =>
    [...lessonKeys.detail(lessonId), "permissions", "edit", userId] as const,
};

export type LessonsFilters = {
  sortBy: string;
  sortOrder: string;
  category?: string;
  page: number;
  limit: number;
};

export function useLessons(filters: LessonsFilters) {
  let apiSortBy = filters.sortBy;
  let apiSortOrder = filters.sortOrder;

  // Available fields for server-side sorting
  const validSortBy = ["start_time", "price", "location", "max_students"];
  const needsClientSort = apiSortBy === "title";

  // If not a valid sort field, default to start_time
  if (!validSortBy.includes(apiSortBy) && !needsClientSort) {
    apiSortBy = "start_time";
  }

  return useQuery({
    queryKey: lessonKeys.list(filters),
    queryFn: async () => {
      const response = await lessonsApi.getAllLessons(
        needsClientSort ? "start_time" : apiSortBy,
        apiSortOrder,
        filters.limit,
        filters.page,
        filters.category === "All" ? undefined : filters.category
      );

      let lessons = response.data.lessons || [];

      // Client-side sort by title if needed
      if (needsClientSort && lessons.length > 0) {
        lessons = sortLessons(lessons, "title", apiSortOrder);
      }

      return {
        lessons,
        totalPages: response.data.total_pages || 1,
        totalLessons: response.data.total_lessons || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLessonCategories() {
  return useQuery({
    queryKey: lessonKeys.categories(),
    queryFn: () =>
      lessonsApi
        .getLessonCategories()
        .then((response) => response.data.categories || []),
    staleTime: 30 * 60 * 1000,
  });
}

export function useLessonSearch(
  searchQuery: string,
  options?: {
    categoryFilter?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) {
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [localResults, setLocalResults] = useState<Lesson[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const allLessonsQuery = useQuery({
    queryKey: lessonKeys.lists(),
    queryFn: () =>
      lessonsApi
        .getAllLessons(
          "start_time",
          "asc",
          100,
          1
        )
        .then((response) => response.data.lessons || []),
    staleTime: 5 * 60 * 1000,
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setIsSearching(false);
      setLocalResults([]);
      return;
    }

    setIsSearching(true);

    if (allLessonsQuery.data) {
      const searchTerm = debouncedQuery.toLowerCase();

      let results = allLessonsQuery.data.filter(
        (lesson: Lesson) =>
          lesson.title.toLowerCase().includes(searchTerm) ||
          lesson.description.toLowerCase().includes(searchTerm) ||
          lesson.location.toLowerCase().includes(searchTerm)
      );

      // Category
      if (options?.categoryFilter && options.categoryFilter !== "All") {
        results = results.filter(
          (lesson: Lesson) => lesson.category === options.categoryFilter
        );
      }

      // Sorting
      if (options?.sortBy && options?.sortOrder) {
        results = sortLessons(results, options.sortBy, options.sortOrder);
      }

      setLocalResults(results);
    }
  }, [
    debouncedQuery,
    allLessonsQuery.data,
    options?.categoryFilter,
    options?.sortBy,
    options?.sortOrder,
  ]);

  return {
    results: localResults,
    isSearching: debouncedQuery.trim().length > 0 && isSearching,
    isLoading: allLessonsQuery.isLoading,
  };
}

// Helper for sorting lessons
function sortLessons(lessons: Lesson[], sortBy: string, sortOrder: string) {
  return [...lessons].sort((a, b) => {
    if (sortBy === "title") {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    } else if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "start_time") {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "location") {
      const comparison = a.location.localeCompare(b.location);
      return sortOrder === "asc" ? comparison : -comparison;
    } else if (sortBy === "max_students") {
      return sortOrder === "asc"
        ? a.max_students - b.max_students
        : b.max_students - a.max_students;
    }
    return 0;
  });
}

export function useLesson(lessonId: string | number) {
  return useQuery({
    queryKey: lessonKeys.detail(lessonId),
    queryFn: () =>
      lessonsApi
        .getLessonById(lessonId.toString())
        .then((response) => response.data.lesson),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLessonEnrollmentStatus(
  lessonId: string | number,
  userId?: string | number
) {
  return useQuery({
    queryKey: lessonKeys.userEnrollmentStatus(lessonId, userId || "anonymous"),
    queryFn: () => {
      if (!userId) return Promise.resolve(false);
      return lessonsApi.isUserEnrolled(lessonId.toString(), userId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

export function useLessonPaymentStatus(
  lessonId: string | number,
  userId?: string | number
) {
  return useQuery({
    queryKey: lessonKeys.userPaymentStatus(lessonId, userId || "anonymous"),
    queryFn: () => {
      if (!userId) return Promise.resolve(false);
      return paymentsApi.hasUserPaidForLesson(
        userId.toString(),
        lessonId.toString()
      );
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

export function useEnrollInLesson(lessonId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string | number) =>
      lessonsApi.enrollInLesson(lessonId.toString(), userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.userEnrollmentStatus(lessonId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: lessonKeys.enrollments(lessonId),
      });
    },
  });
}

export function useLessonEditPermission(
  lessonId: string | number,
  userId?: string | number
) {
  return useQuery({
    queryKey: lessonKeys.editPermission(lessonId, userId || "anonymous"),
    queryFn: async () => {
      if (!userId) return false;

      try {
        // Check local storage cache
        const permissionCacheKey = `edit_permission_${userId}_${lessonId}`;
        const cachedPermission = localStorage.getItem(permissionCacheKey);
        const cacheTimestampKey = `edit_permission_timestamp_${userId}_${lessonId}`;
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        const cacheExpiry = 30 * 60 * 1000;

        if (cachedPermission !== null && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          if (now - timestamp < cacheExpiry) {
            return cachedPermission === "true";
          }
        }

        // Get lesson and user details
        const lessonResponse = await lessonsApi.getLessonById(lessonId.toString());
        const lesson = lessonResponse.data.lesson as Lesson;
        const userResponse = await usersApi.getUserById(userId.toString());
        const userData = userResponse.data.user;

        // Check if creator or site admin
        if (
          Number(userId) === Number(lesson.created_by) ||
          userData.username === lesson.creator_username ||
          userData.is_site_admin
        ) {
          localStorage.setItem(permissionCacheKey, "true");
          localStorage.setItem(cacheTimestampKey, Date.now().toString());
          return true;
        }

        if (userData.has_groups === false) {
          localStorage.setItem(permissionCacheKey, "false");
          localStorage.setItem(cacheTimestampKey, Date.now().toString());
          return false;
        }

        // Group admin/manager role grants edit
        const membershipResponse = await groupsApi.getMemberByUserId(
          userId.toString()
        );
        const memberships = membershipResponse.data.group_members || [];

        const hasEditPermission = memberships.some(
          (membership: any) =>
            membership.group_id === lesson.group_id &&
            ["group_admin", "owner", "organizer", "lesson_manager"].includes(
              membership.role
            )
        );

        localStorage.setItem(permissionCacheKey, hasEditPermission.toString());
        localStorage.setItem(cacheTimestampKey, Date.now().toString());
        return hasEditPermission;
      } catch (error) {
        console.error("Failed to check user permissions:", error);
        return false;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}