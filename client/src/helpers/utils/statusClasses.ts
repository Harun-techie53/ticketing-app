import { OrderStatus, TicketStatus } from "@hrrtickets/common";

export const getTicketStatusClass = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.InStock:
      return "badge-success";
    case TicketStatus.Reserved:
      return "badge-warning";
    case TicketStatus.Sold:
      return "badge-primary";
    default:
      break;
  }
};

export const getOrderStatusClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return "badge-primary";
    case OrderStatus.Cancelled:
      return "badge-error";
    case OrderStatus.Complete:
      return "badge-success";
    default:
      break;
  }
};
