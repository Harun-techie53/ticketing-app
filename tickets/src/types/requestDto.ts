import { TicketStatusType } from "../models/tickets";

export interface TicketDto {
  title: string;
  description: string;
  status: TicketStatusType;
  price: number;
}

export interface TicketUpdateDto {
  title?: string;
  description?: string;
  status?: TicketStatusType;
  price?: number;
}
