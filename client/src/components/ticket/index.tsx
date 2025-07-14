import { getTicketStatusClass } from "@/helpers/utils/statusClasses";
import { Order, Ticket, User } from "@/types";
import React, { useEffect, useState } from "react";
import ExpirationCountdown from "../expiration-countdown";
import { apiGet, apiPut } from "@/helpers/axios/config";
import { TicketStatus } from "@hrrtickets/common";
import Link from "next/link";
import { ExpandableText } from "../expandable-text";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/authContext";

export enum TicketType {
  InStock = "instock",
  Reserved = "reserved",
  Auction = "auction",
  Favorite = "favorite",
}

const TicketCard = ({
  ticket,
  onViewDetails,
  onPlacedOrder,
  handleDislikeTicket,
  handleLikeTicket,
  type,
}: {
  ticket: Ticket;
  onViewDetails?: () => void;
  onPlacedOrder?: () => void;
  handleDislikeTicket?: (ticketId: string) => void;
  handleLikeTicket?: (ticketId: string) => void;
  type: TicketType;
}) => {
  const { currentUser } = useAuth();
  const [ticketOrder, setTicketOrder] = useState<Order | null>(null);
  const [isFavoriteActive, setFavoriteActive] = useState(
    ticket.likedBy.includes(currentUser?.id!) || false
  );
  const fetchTicketOrder = async () => {
    const orderId = !!ticket.order && ticket.order.id;

    if (!!orderId) {
      try {
        const ticketOrder = await apiGet<Order>({
          apiPath: `/api/orders/${orderId}`,
          withCredentials: true,
        });

        if (!!ticketOrder) {
          setTicketOrder(ticketOrder);
        }
      } catch (error) {
        console.log("Error occurred fetching ticket order ", error);
      }
    }
  };

  const likedTicket = async () => {
    try {
      const response = await apiPut({
        apiPath: `/api/tickets/${ticket.id}/like`,
        withCredentials: true,
      });

      if (response.status === "success") {
        setFavoriteActive(true);
        handleLikeTicket?.(ticket.id);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const dislikedTicket = async () => {
    try {
      const response = await apiPut({
        apiPath: `/api/tickets/${ticket.id}/dislike`,
        withCredentials: true,
      });

      if (response.status === "success") {
        setFavoriteActive(false);
        handleDislikeTicket?.(ticket.id);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleFavoriteClicked = () => {
    if (!isFavoriteActive) {
      likedTicket();
    } else {
      dislikedTicket();
    }
  };

  useEffect(() => {
    if (type === TicketType.Reserved) {
      fetchTicketOrder();
    }

    if (type === TicketType.Auction) {
      console.log("Auction Ticket ", ticket);
    }
  }, [type, ticket]);
  return (
    <div className="card bg- border border-zinc-100 p-5 w-full shadow-sm mb-5">
      <div className="flex justify-between align-center">
        <div>
          <div className="flex flex-col md:items-center md:flex-row md:gap-3 gap-2">
            <p className="card-title">{ticket.title}</p>
            <div
              className={`badge badge-sm ${getTicketStatusClass(
                ticket.status
              )} capitalize font-semibold`}
            >
              {ticket.status}
            </div>
            {(type === TicketType.InStock || type === TicketType.Favorite) &&
              ticket.status === TicketStatus.InStock && (
                <div
                  className="tooltip"
                  data-tip={`${
                    isFavoriteActive ? "Added to Favorite" : "Add to Favorite"
                  }`}
                >
                  <button
                    onClick={handleFavoriteClicked}
                    className={`btn btn-ghost btn-circle btn-sm`}
                  >
                    <Heart
                      size={20}
                      className={`${
                        isFavoriteActive
                          ? "fill-primary text-primary"
                          : "fill-none"
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              )}
          </div>
          {(ticket.status === TicketStatus.InStock ||
            type === TicketType.Favorite) && (
            <span className="flex items-center gap-1">
              <p className="text-sm text-gray-600">Liked by </p>
              <strong>{ticket.likedBy.length}</strong>
              <p className="text-sm text-gray-600"> people</p>
            </span>
          )}
        </div>
        {type === TicketType.Reserved && ticketOrder?.expiresAt && (
          <ExpirationCountdown expiresAt={ticketOrder?.expiresAt!} />
        )}
      </div>
      {type === TicketType.InStock &&
        ticket.status === TicketStatus.Reserved &&
        !!ticket.order.user && (
          <span className="text-xs text-ghost mt-3">
            Reserved by{" "}
            <span className="font-semibold">
              {ticket.order.user.firstName} {ticket.order.user.lastName}
            </span>
          </span>
        )}
      {type === TicketType.InStock &&
        ticket.status === TicketStatus.Sold &&
        !!ticket.order.user && (
          <span className="text-xs text-ghost mt-3">
            Owned by{" "}
            <span className="font-semibold">
              {ticket.order.user.firstName} {ticket.order.user.lastName}
            </span>
          </span>
        )}
      <div className="text-sm my-4">
        <ExpandableText text={ticket.description} lines={3} />

        <p className="text-lg font-semibold text-orange-500">${ticket.price}</p>
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
        ) : type === TicketType.Auction &&
          ticket.status === TicketStatus.Sold ? (
          <Link href={`/tickets/auctions/${ticket.id}`}>
            <button className="btn btn-info btn-outline btn-sm">
              See Auction Details
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
