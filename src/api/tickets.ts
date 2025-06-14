import axiosClient from "@/api/axiosClient";
import type { CreateTicketParams, UpdateTicketParams } from "@/types/tickets";

const ticketsApi = {
  // Get all tickets (for admin)
  getAllTickets: () => {
    return axiosClient.get("/tickets");
  },

  getTicketById: (id: string) => {
    return axiosClient.get(`/tickets/${id}`);
  },

  // All tickets a given user owns (could be for many lessons)
  getUserTickets: (userId: string) => {
    return axiosClient.get(`/tickets/user/${userId}`);
  },

  // All tickets for a specific lesson
  getLessonTickets: (lessonId: string) => {
    return axiosClient.get(`/tickets/lesson/${lessonId}`);
  },

  verifyTicket: (ticketCode: string) => {
    return axiosClient.get(`/tickets/verify/${ticketCode}`);
  },

  createTicket: (params: CreateTicketParams) => {
    return axiosClient.post("/tickets", params);
  },

  useTicket: (ticketCode: string) => {
    return axiosClient.post(`/tickets/use/${ticketCode}`);
  },

  updateTicket: (id: string, params: UpdateTicketParams) => {
    return axiosClient.patch(`/tickets/${id}`, params);
  },

  deleteTicket: (id: string) => {
    return axiosClient.delete(`/tickets/${id}`);
  },

  /**
   * Check if a user has a paid ticket for a lesson
   * @param userId The user ID to check
   * @param lessonId The lesson ID to check
   * @returns Promise resolving to true if the user has a paid ticket, false otherwise
   */
  hasUserPaidForLesson: async (
    userId: string | number,
    lessonId: string | number
  ): Promise<boolean> => {
    try {
      const response = await axiosClient.get(
        `/tickets/user/${userId}/lesson/${lessonId}`
      );

      // Check for the new API response format {hasUserPaid: boolean}
      if (response.data.hasUserPaid !== undefined) {
        return response.data.hasUserPaid;
      }

      // Fallback to the original implementation if the new format isn't present
      const tickets = response.data.tickets || [];
      type Ticket = { paid: boolean };
      return tickets.some((ticket: Ticket) => ticket.paid === true);
    } catch (error) {
      console.error("Error checking ticket status:", error);
      return false;
    }
  },
};

export default ticketsApi;