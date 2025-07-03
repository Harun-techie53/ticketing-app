"use client";
import TicketCard, { TicketType } from "@/components/ticket";
import { apiGet, apiPost } from "@/helpers/axios/config";
import { Ticket } from "@/types";
import React, { useEffect, useState } from "react";

const Tickets = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reservedTickets, setReservedTickets] = useState<Ticket[]>([]);
  const [auctionTickets, setAuctionTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    try {
      const tickets = await apiGet<Ticket[]>({
        apiPath: "/api/tickets",
        withCredentials: true,
      });
      console.log("tickets", tickets);
      setTickets(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchReservedTickets = async () => {
    try {
      const tickets = await apiGet<Ticket[]>({
        apiPath: "/api/tickets/reserved/me",
        withCredentials: true,
      });
      console.log("tickets", tickets);
      setReservedTickets(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchAuctionTickets = async () => {
    try {
      const tickets = await apiGet<Ticket[]>({
        apiPath: "/api/tickets/auctions/currentUser",
        withCredentials: true,
      });
      setAuctionTickets(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const closePlacedOrderModal = () => {
    setSelectedTicket(null);
    const modal = document.getElementById(
      "modal_placed_order"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const handlePlacedTicketOrder = async () => {
    console.log("Placed ordered ticket ", selectedTicket);
    try {
      const response = await apiPost({
        apiPath: "/api/orders",
        data: { ticketId: selectedTicket?.id },
        withCredentials: true,
      });

      console.log("placed order response ", response);
      closePlacedOrderModal();
      setReservedTickets((prev) => [...prev, selectedTicket!]);
    } catch (error) {
      console.log("Error occurred placing order ", error);
    }
  };

  const openModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    const modal = document.getElementById("ticket_modal") as HTMLDialogElement;
    modal?.showModal();
  };

  const openPlacedOrderModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    const modal = document.getElementById(
      "modal_placed_order"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleChangeTab = (tab: string) => {
    setCurrentTab(tab);
  };
  useEffect(() => {
    if (currentTab === "reserved") {
      fetchReservedTickets();
    } else if (currentTab === "auction") {
      fetchAuctionTickets();
    } else {
      fetchTickets();
    }
  }, [currentTab]);
  return (
    <div className="container mx-auto px-10 py-5">
      <div
        role="tablist"
        className="tabs tabs-border mb-10 border border-gray-300 rounded-md"
      >
        <a
          role="tab"
          className={`tab ${
            currentTab === "all" && "tab-active font-semibold"
          } gap-1 font-medium`}
          onClick={() => handleChangeTab("all")}
        >
          All Tickets
          <span
            className={`badge badge-sm ${
              currentTab === "all" ? "badge-neutral" : "badge-soft"
            }`}
          >
            {tickets.length || 0}
          </span>
        </a>
        <a
          role="tab"
          className={`tab ${
            currentTab === "reserved" && "tab-active font-semibold"
          } gap-1 font-medium`}
          onClick={() => handleChangeTab("reserved")}
        >
          Reserved Tickets
          <span
            className={`badge badge-sm ${
              currentTab === "reserved" ? "badge-neutral" : "badge-soft"
            }`}
          >
            {reservedTickets.length || 0}
          </span>
        </a>
        <a
          role="tab"
          className={`tab ${
            currentTab === "auction" && "tab-active font-semibold"
          } gap-1 font-medium`}
          onClick={() => handleChangeTab("auction")}
        >
          Auction Tickets
          <span
            className={`badge badge-sm ${
              currentTab === "auction" ? "badge-neutral" : "badge-soft"
            }`}
          >
            {auctionTickets.length || 0}
          </span>
        </a>
      </div>
      {currentTab === "reserved" ? (
        reservedTickets.length > 0 ? (
          <>
            <h1>Reserved Tickets Listed Below</h1>
            {reservedTickets.map((ticket) => (
              <TicketCard
                ticket={ticket}
                key={ticket.id}
                onViewDetails={() => setSelectedTicket(ticket)}
                type={TicketType.Reserved}
              />
            ))}
          </>
        ) : (
          <h1>No reserved tickets found</h1>
        )
      ) : currentTab === "auction" ? (
        auctionTickets.length > 0 ? (
          <>
            <h1>Reserved Tickets Listed Below</h1>
            {/* {auctionTickets.map((auction) => (
              <TicketCard ticket={auction.ticket} key={auction.id} />
            ))} */}
          </>
        ) : (
          <h1>No reserved tickets found</h1>
        )
      ) : (
        <>
          <h2 className="pb-5">Tickets Listed Below</h2>
          {tickets?.map((ticket) => (
            <TicketCard
              ticket={ticket}
              key={ticket.id}
              onViewDetails={() => openModal(ticket)}
              onPlacedOrder={() => openPlacedOrderModal(ticket)}
              type={TicketType.InStock}
            />
          ))}
          <dialog id="ticket_modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              {selectedTicket ? (
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {selectedTicket.title}
                  </h3>
                  <p>
                    <strong>ID:</strong> {selectedTicket.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedTicket.status}
                  </p>
                  <p>
                    <strong>Price:</strong> ${selectedTicket.price}
                  </p>
                  <p className="mt-2">{selectedTicket.description}</p>
                </div>
              ) : (
                <p>No ticket selected.</p>
              )}
            </div>
          </dialog>
          <dialog id="modal_placed_order" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <p className="font-semibold text-sm w-[95%]">
                ⚠️ Please note: Once you confirm the order, you’ll have 3
                minutes to complete the payment before the reservation is
                released.
              </p>
              <button
                className="btn btn-accent btn-sm mt-5"
                onClick={handlePlacedTicketOrder}
              >
                Confirm Order
              </button>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
};

export default Tickets;
