import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import lessonsApi from "@/api/lessons";
import groupsApi from "@/api/groups";
import { Lesson } from "@/types/lesson";
import { GroupMember } from "@/types/groups";
import { UserGroup } from "@/types/users";

// Usage: const dashboard = useDashboard();

export function useDashboard() {
  const [groupDraftLessons, setGroupDraftLessons] = useState<Lesson[]>([]);
  const [groupLessons, setGroupLessons] = useState<Lesson[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isGroupMember, setIsGroupMember] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [groupId, setGroupId] = useState<number | null>(null);
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
          setGroupId(groupMemberData.group_id);

          // Update user data with group information
          // Create a UserGroup object to comply with the User type
          const userGroup: UserGroup = {
            group_id: groupMemberData.group_id,
            group_name: groupMemberData.group_name || "",
            group_description: groupMemberData.group_description || "",
            role: groupMemberData.role || "",
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
        const response = await lessonsApi.getGroupDraftLessons(groupId.toString());
        if (isMounted) {
          setGroupDraftLessons(response.data.lessons || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error(err?.message || "Unknown error")
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

  // Fetch all lessons
  useEffect(() => {
    let isMounted = true;

    const fetchGroupLessons = async () => {
      if (!groupId) return;

      setLoading(true);
      try {
        const response = await lessonsApi.getLessonsByGroup(groupId.toString());
        if (isMounted) {
          setGroupLessons(response.data.lessons || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error(err?.message || "Unknown error")
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
        const response = await groupsApi.getGroupMembers(groupId.toString());
        if (isMounted) {
          setGroupMembers(response.data.members || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error(err?.message || "Unknown error")
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