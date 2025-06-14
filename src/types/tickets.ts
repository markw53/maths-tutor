// types/tickets.ts

export interface Ticket {
  id: number;
  lesson_id: number;
  user_id: number;
  registration_id: number;
  paid: boolean;
  ticket_code: string;
  issued_at: string;
  used_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface VerifiedTicket extends Ticket {
  lesson_title: string;
  start_time: string;
  end_time: string;
  location: string;
  username: string;
  email: string;
}

export interface CreateTicketParams {
  lesson_id: number;
  user_id: number;
  registration_id: number;
  paid: boolean;
  [key: string]: unknown;
}

export interface UpdateTicketParams {
  paid?: boolean;
  status?: string;
  [key: string]: unknown;
}