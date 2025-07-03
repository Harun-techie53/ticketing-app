import { getTicketStatusClass } from "@/helpers/utils/statusClasses";
import { Order, Ticket, User } from "@/types";
import React, { useEffect, useState } from "react";
import ExpirationCountdown from "../expiration-countdown";
import { apiGet } from "@/helpers/axios/config";
import { TicketStatus } from "@hrrtickets/common";
import Link from "next/link";

export enum TicketType {
  InStock = "instock",
  Reserved = "reserved",
}

const TicketCard = ({
  ticket,
  onViewDetails,
  onPlacedOrder,
  type,
}: {
  ticket: Ticket;
  onViewDetails: () => void;
  onPlacedOrder?: () => void;
  type: TicketType;
}) => {
  const [ticketOrder, setTicketOrder] = useState<Order | null>(null);
  const fetchTicketOrder = async () => {
    const orderId = !!ticket.order && ticket.order.id;

    if (!!orderId) {
      try {
        const ticketOrder = await apiGet<Order>({
          apiPath: `/api/orders/${orderId}`,
        });

        if (!!ticketOrder) {
          setTicketOrder(ticketOrder);
        }
      } catch (error) {
        console.log("Error occurred fetching ticket order ", error);
      }
    }
  };

  const [reservedUser, setReservedUser] = useState<User | null>(null);

  const fetchReservedUser = async () => {
    const userId = ticket.order.user;

    if (!!userId) {
      try {
        const user = await apiGet<User>({
          apiPath: `/api/users/${userId}`,
        });

        if (!!user) {
          setReservedUser(user);
        }
      } catch (error) {
        console.log("Error fetching reserved user ", error);
      }
    }
  };
  useEffect(() => {
    if (type === TicketType.Reserved) {
      fetchTicketOrder();
    }

    if (
      type === TicketType.InStock &&
      (ticket.status === TicketStatus.Reserved ||
        ticket.status === TicketStatus.Sold)
    ) {
      fetchReservedUser();
    }
  }, [type, ticket]);
  return (
    <div className="card bg- border border-zinc-100 p-5 w-full shadow-sm mb-5">
      <div className="flex justify-between align-center">
        <div className="flex flex-col md:align-center md:flex-row md:align-center md:gap-3 gap-2">
          <p className="card-title">{ticket.title}</p>
          <div
            className={`badge badge-sm ${getTicketStatusClass(
              ticket.status
            )} capitalize font-semibold`}
          >
            {ticket.status}
          </div>
        </div>
        {type === TicketType.Reserved && ticketOrder?.expiresAt && (
          <ExpirationCountdown expiresAt={ticketOrder?.expiresAt!} />
        )}
      </div>
      {type === TicketType.InStock &&
        ticket.status === TicketStatus.Reserved &&
        !!ticket.order.id && (
          <span className="text-xs text-ghost mt-3">
            Reserved by{" "}
            <span className="font-semibold">
              {reservedUser?.firstName} {reservedUser?.lastName}
            </span>
          </span>
        )}
      {type === TicketType.InStock &&
        ticket.status === TicketStatus.Sold &&
        !!ticket.order.id && (
          <span className="text-xs text-ghost mt-3">
            Owned by{" "}
            <span className="font-semibold">
              {reservedUser?.firstName} {reservedUser?.lastName}
            </span>
          </span>
        )}
      <div className="text-sm my-4">
        <p>{ticket.description}</p>
        <p>${ticket.price}</p>
      </div>
      <div className="flex gap-2 size-fit">
        {type === TicketType.Reserved &&
        ticket.status === TicketStatus.Reserved &&
        ticket.order.id ? (
          <Link href={`/payments/orders/${ticket?.order?.id}`}>
            <button className="btn btn-info btn-sm">
              Pay With Credit Card
            </button>
          </Link>
        ) : (
          <button className="btn btn-info btn-sm" onClick={onViewDetails}>
            View Details
          </button>
        )}
        {!ticket.order && (
          <button className="btn btn-primary btn-sm" onClick={onPlacedOrder!}>
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
