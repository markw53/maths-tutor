import axiosClient from "@/api/axiosClient";
import type { AddGroupMemberParams } from "@/types/groups";
import type { CreateGroupParams } from "@/types/groups";

const groupsApi = {
  getAllGroups: () => {
    return axiosClient.get("/groups");
  },

  getGroupById: (id: string) => {
    return axiosClient.get(`/groups/${id}`);
  },

  getGroupByName: (name: string) => {
    return axiosClient.get(`/groups/name/${name}`);
  },

  getGroupMembers: (id: string) => {
    return axiosClient.get(`/groups/${id}/members`);
  },

  getAllGroupMembers: () => {
    return axiosClient.get("/groups/members");
  },

  getMemberById: (id: string) => {
    return axiosClient.get(`/groups/members/${id}`);
  },

  getMemberRoleByUserId: (userId: string) => {
    return axiosClient.get(`/groups/members/${userId}/role`);
  },

  getMemberByUserId: async (userId: string) => {
    try {
      return await axiosClient.get(`/groups/members/user/${userId}`);
    } catch (error: unknown) {
      // If the error is a 404 (user has no groups), return an empty result instead of throwing
      interface AxiosErrorWithResponse {
        response?: {
          status?: number;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      }
      const err = error as AxiosErrorWithResponse;
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in err &&
        typeof err.response?.status === "number" &&
        err.response?.status === 404
      ) {
        return {
          data: {
            group_members: [],
            message: "User is not a member of any groups",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {},
        };
      }
      throw error;
    }
  },

  createGroup: (params: CreateGroupParams) => {
    return axiosClient.post("/groups", params);
  },

  updateGroup: (id: string, name: string) => {
    return axiosClient.patch(`/groups/${id}`, { name });
  },

  deleteGroup: (id: string) => {
    return axiosClient.delete(`/groups/${id}`);
  },

  deleteGroupMember: (groupId: string, memberId: string) => {
    return axiosClient.delete(`/groups/${groupId}/members/${memberId}`);
  },

  addGroupMember: (params: AddGroupMemberParams) => {
    return axiosClient.post("/groups/members", params);
  },
};

export default groupsApi;