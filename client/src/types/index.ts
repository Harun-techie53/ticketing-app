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
  user: Partial<User>;
  price: number;
  placedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
  createdAt: Date;
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
    user: User;
  };
  maxResalePrice: number;
  resaledPrice: number | null;
  likedBy: string[];
}

export interface Auction {
  id: string;
  ticket: Ticket;
  basePrice: number;
  expiresAt: Date;
  status: AuctionStatusType;
  highestBidder: BidDoc;
  bids: BidDoc[];
  raisedBy: Partial<User>;
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
