import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/components/hooks/useAuth"; // NOTE: useAuth should be imported as a named import!
import lessonsApi from "@/api/lessons";
import groupsApi from "@/api/groups";
import type { Lesson } from "@/types/lesson";
import type { GroupMember } from "@/types/groups";
import type { UserGroup } from "@/types/groups"; // <- keep import consistent

// Usage: const dashboard = useDashboard();

export function useDashboard() {
  const [groupDraftLessons, setGroupDraftLessons] = useState<Lesson[]>([]);
  const [groupLessons, setGroupLessons] = useState<Lesson[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isGroupMember, setIsGroupMember] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [groupId, setGroupId] = useState<string | null>(null);
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  // Check if user is a member of any group
  useEffect(() => {
    let isMounted = true;

    const checkGroupMembership = async () => {
      if (!user?.id) return;

      try {
        const response = await groupsApi.getMemberByUserId(user.id.toString());
        // If we get a successful response, the user is a group member
        if (isMounted && response.data && response.data.groupMember) {
          const groupMemberData = response.data.groupMember;
          setIsGroupMember(true);

          // group_id is string in types/groups.ts, so always assign as string
          setGroupId(String(groupMemberData.group_id));

          // Build UserGroup with string group_id
          const userGroup: UserGroup = {
            group_id: String(groupMemberData.group_id),
            group_name: groupMemberData.group_name || "",
            group_description: groupMemberData.group_description || "",
            role: groupMemberData.role || "student",
          };

          updateUserData({ groups: [userGroup] });
        } else if (isMounted) {
          setIsGroupMember(false);
          navigate("/profile");
        }
      } catch (err) {
        if (isMounted) {
          setIsGroupMember(false);
          navigate("/profile");
        }
      }
    };

    checkGroupMembership();

    return () => {
      isMounted = false;
    };
  }, [user?.id, navigate, updateUserData]);

  // Fetch draft lessons when groupId is available
  useEffect(() => {
    let isMounted = true;

    const fetchGroupDraftLessons = async () => {
      if (!isGroupMember || !groupId) return;

      setLoading(true);
      try {
        const response = await lessonsApi.getPastLessons();
        if (isMounted) {
          setGroupDraftLessons(response.data.lessons || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error((typeof err === "object" && err !== null && "message" in err) ? (err as { message?: string }).message || "Unknown error" : "Unknown error")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGroupDraftLessons();

    return () => {
      isMounted = false;
    };
  }, [isGroupMember, groupId]);

  // Fetch all lessons for this group
  useEffect(() => {
    let isMounted = true;

    const fetchGroupLessons = async () => {
      if (!groupId) return;

      setLoading(true);
      try {
        const response = await lessonsApi.getAllLessons();
        if (isMounted) {
          const allLessons = response.data.lessons || [];
          // Make sure lesson.groupId is string or coerce to string for comparison
          const filteredLessons = allLessons.filter(
            (lesson: Lesson) => String(lesson.groupId) === groupId
          );
          setGroupLessons(filteredLessons);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error((typeof err === "object" && err !== null && "message" in err) ? (err as { message?: string }).message || "Unknown error" : "Unknown error")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGroupLessons();

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  // Fetch group members
  useEffect(() => {
    let isMounted = true;

    const fetchGroupMembers = async () => {
      if (!groupId) return;

      try {
        const response = await groupsApi.getGroupMembers(groupId);
        if (isMounted) {
          setGroupMembers(response.data.members || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error((typeof err === "object" && err !== null && "message" in err) ? (err as { message?: string }).message || "Unknown error" : "Unknown error")
          );
        }
      }
    };

    fetchGroupMembers();

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  return {
    groupDraftLessons,
    groupLessons,
    loading,
    error,
    isGroupMember,
    activeSection,
    setActiveSection,
    groupId,
    groupMembers,
    user,
  };
}