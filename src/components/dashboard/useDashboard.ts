import { useEffect, useState } from "react";
import lessonsApi from "@/api/lessons";  // your updated API file
import usersApi from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";
import type { Lesson } from "@/types/lesson";

// Define DashboardUser type for use in this file
type Group = { group_id: string };
type DashboardUser = { groups?: Group[] };

export function useDashboard() {
  const { user } = useAuth();
  const [myLessons, setMyLessons] = useState<Lesson[]>([]);
  const [myDraftLessons, setMyDraftLessons] = useState<Lesson[]>([]);
  const [classMembers, setClassMembers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [activeSection, setActiveSection] = useState<string>("all-lessons");
  // For demo purposes, assuming only one classId (could use groupId, etc.)
  const classId = user?.groups?.[0]?.group_id || null;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Lessons created by the current user (could filter by tutor_id on backend)
        const lessonsRes = await lessonsApi.getAllLessons();
        // If 'status: draft' is used
        const draftLessons = (lessonsRes.data.lessons || []).filter(
          (l: Lesson) => l.status === "draft"
        );
        const publishedLessons = (lessonsRes.data.lessons || []).filter(
          (l: Lesson) => l.status !== "draft"
        );
        setMyDraftLessons(draftLessons);
        setMyLessons(publishedLessons);
        // Class/group members
        let members: DashboardUser[] = [];
        if (classId) {
          const membersRes = await usersApi.getAllUsers(); // Filter as needed.
          members = membersRes.data.users.filter(
            (u: DashboardUser) =>
              u.groups?.some((g: Group) => g.group_id === classId)
          );
        }
        setClassMembers(members);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, classId]);

  return {
    myLessons,
    myDraftLessons,
    classMembers,
    loading,
    error,
    activeSection,
    setActiveSection,
    user,
    classId,
  };
}