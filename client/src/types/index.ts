import { OrderStatus, TicketStatus, UserRoles } from "@hrrtickets/common";

export enum AuctionStatusType {
  Active = "active",
  Inactive = "inactive",
}

export enum ToastType {
  Success = "success",
  Error = "error",
  Info = "info",
}

export interface BidDoc {
  _id: string;
  userId: string;
  price: number;
  placedAt: Date;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  price: number;
  user: string;
  version: number;
  order: {
    id: string;
    user: string;
  };
  maxResalePrice: number;
  resaledPrice: number | null;
}

export interface Auction {
  id: string;
  ticket: Ticket;
  basePrice: number;
  expiresAt: Date;
  status: AuctionStatusType;
  highestBidder: BidDoc;
  bids: BidDoc[];
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
}

export interface Order {
  id: string;
  user: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: Ticket;
  version: number;
  resaled: boolean;
  resaledAt?: Date;
  createdAt: Date;
}
