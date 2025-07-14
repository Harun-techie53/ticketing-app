"use client";
import NotFound from "@/components/not-found";
import SearchInput from "@/components/search-input";
import TicketSkeletonCard from "@/components/skeletons/TicketSkeletonCard";
import SortDropdown from "@/components/sort-dropdown";
import StatusFilterDropdown from "@/components/status-filter-dropdown";
import TicketCard, { TicketType } from "@/components/ticket";
import { useAuth } from "@/contexts/authContext";
import { apiGet, apiPost } from "@/helpers/axios/config";
import { utils } from "@/helpers/utils";
import { showGlobalToast } from "@/helpers/utils/globals";
import { Auction, Ticket, ToastType } from "@/types";
import { TicketStatus } from "@hrrtickets/common";
import React, { useEffect, useState } from "react";

const ticketSortOptions = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
];

const Tickets = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reservedTickets, setReservedTickets] = useState<Ticket[]>([]);
  const [auctionTickets, setAuctionTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketsLoading, setIsTicketsLoading] = useState<boolean>(false);
  const [ticketsTotalCount, setTicketsTotalCount] = useState<number | null>(
    null
  );
  const [totalCountAuctionTickets, setTotalCountAuctionTickets] = useState(0);
  const [isReservedTicketsLoading, setIsReservedTicketsLoading] =
    useState<boolean>(false);
  const [isAuctionTicketsLoading, setIsAuctionTicketsLoading] =
    useState<boolean>(false);
  const [selectedTicketsSortOption, setSelectedTicketsSortOption] =
    useState<string>("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [likedTickets, setLikedTickets] = useState<Ticket[]>([]);
  const [totalLikedTicketsCount, setTotalLikedTicketsCount] = useState(0);
  const [isLikedTicketsLoading, setIsLikedTicketsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchTickets = async ({ searchTerm }: { searchTerm?: string }) => {
    setIsTicketsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (selectedTicketsSortOption) {
        queryParams.append("sort", selectedTicketsSortOption);
      }

      if (selectedFilterStatus) {
        queryParams.append("status", selectedFilterStatus.value);
      }

      if (searchTerm) {
        queryParams.append("title", searchTerm || "");
      }

      const responseData = await apiGet<{
        tickets: Ticket[];
        totalDocumentsCount: number;
      }>({
        apiPath: `/api/tickets?${queryParams.toString()}`,
        withCredentials: true,
      });

      setTickets(responseData.tickets);
      setTicketsTotalCount(responseData.totalDocumentsCount);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsTicketsLoading(false);
    }
  };

  const fetchLikedTickets = async () => {
    setIsLikedTicketsLoading(true);
    try {
      const response = await apiGet<{
        tickets: Ticket[];
        totalDocumentsCount: number;
      }>({
        apiPath: "/api/tickets/liked/me",
        withCredentials: true,
      });
      setLikedTickets(response.tickets);
      setTotalLikedTicketsCount(response.totalDocumentsCount);
    } catch (error) {
      console.error("Error fetching liked tickets:", error);
    } finally {
      setIsLikedTicketsLoading(false);
    }
  };

  const fetchReservedTickets = async () => {
    setIsReservedTicketsLoading(true);
    try {
      const tickets = await apiGet<Ticket[]>({
        apiPath: "/api/tickets/reserved/me",
        withCredentials: true,
      });
      setReservedTickets(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsReservedTicketsLoading(false);
    }
  };

  const fetchAuctionTickets = async () => {
    setIsAuctionTicketsLoading(true);
    try {
      const response = await apiGet<{
        auctions: Auction[];
        totalDocumentsCount: number;
      }>({
        apiPath: "/api/tickets/auctions/currentUser",
        withCredentials: true,
      });

      const tickets = response.auctions.map((auction) => ({
        ...auction.ticket,
        id: auction.id,
      }));
      setAuctionTickets(tickets);
      setTotalCountAuctionTickets(response.totalDocumentsCount);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsAuctionTicketsLoading(false);
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
    try {
      const response = await apiPost({
        apiPath: "/api/orders",
        data: { ticketId: selectedTicket?.id },
        withCredentials: true,
      });

      showGlobalToast("Ticket is reserved", ToastType.Info);
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
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              order: { id: currentUser?.id ?? "", user: currentUser! },
            }
          : t
      )
    );
    const modal = document.getElementById(
      "modal_placed_order"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleChangeTicketsSortOption = (option: string) => {
    setSelectedTicketsSortOption(option);
  };

  const handleSelectFilterStatus = (status: {
    label: string;
    value: string;
  }) => {
    setSelectedFilterStatus(status);
  };

  const handleSearchTickets = () => {
    fetchTickets({ searchTerm: ticketSearchTerm });
  };

  const handleClearTicketSearchTerm = () => {
    setTicketSearchTerm("");
    fetchTickets({ searchTerm: "" });
  };

  const handleChangeTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleDislikeTicket = (ticketId: Ticket["id"]) => {
    setLikedTickets((prev) =>
      prev.filter((ticket) => ticket.id.toString() !== ticketId.toString())
    );
    setTotalLikedTicketsCount((prev) => prev - 1);
  };

  const handleLikeTicket = (ticketId: Ticket["id"]) => {
    setTotalLikedTicketsCount((prev) => prev + 1);
    const ticket = tickets.find((ticket) => ticket.id.toString() === ticketId);
    const updatedTickets = tickets.push(ticket!);

    console.log("updated tickets ", updatedTickets);
    // setLikedTickets(updatedTickets);
  };

  const handleClearFilters = () => {
    setSelectedFilterStatus(null);
    // handleSelectFilterStatus(null);
    setSelectedTicketsSortOption(ticketSortOptions[0].value);
    handleChangeTicketsSortOption(ticketSortOptions[0].value);
  };

  useEffect(() => {
    fetchReservedTickets();
    fetchAuctionTickets();
    fetchLikedTickets();
    fetchTickets({});
  }, []);

  useEffect(() => {
    if (currentTab === "reserved") {
      fetchReservedTickets();
    } else if (currentTab === "auction") {
      fetchAuctionTickets();
    } else if (currentTab === "all") {
      fetchTickets({});
    } else {
      fetchLikedTickets();
    }
  }, [currentTab]);

  useEffect(() => {
    fetchTickets({});
  }, [selectedTicketsSortOption, selectedFilterStatus]);
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
            {ticketsTotalCount || 0}
          </span>
        </a>
        {isAuthenticated && (
          <>
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
                {totalCountAuctionTickets || 0}
              </span>
            </a>
            <a
              role="tab"
              className={`tab ${
                currentTab === "favorites" && "tab-active font-semibold"
              } gap-1 font-medium`}
              onClick={() => handleChangeTab("favorites")}
            >
              Favorites
              <span
                className={`badge badge-sm ${
                  currentTab === "favorites" ? "badge-neutral" : "badge-soft"
                }`}
              >
                {totalLikedTicketsCount || 0}
              </span>
            </a>
          </>
        )}
      </div>
      {currentTab === "reserved" ? (
        reservedTickets.length > 0 ? (
          <>
            {isReservedTicketsLoading
              ? [1, 2, 3, 4, 5, 6].map((item) => (
                  <TicketSkeletonCard key={item} />
                ))
              : reservedTickets?.map((ticket) => (
                  <TicketCard
                    ticket={ticket}
                    key={ticket.id}
                    onViewDetails={() => setSelectedTicket(ticket)}
                    type={TicketType.Reserved}
                  />
                ))}
          </>
        ) : (
          <NotFound text="You have no Reserved tickets yet!" />
        )
      ) : currentTab === "auction" ? (
        auctionTickets.length > 0 ? (
          <>
            {isAuctionTicketsLoading
              ? Array(5).map((item) => <TicketSkeletonCard key={item} />)
              : auctionTickets?.map((ticket, index) => (
                  <TicketCard
                    key={index}
                    ticket={ticket}
                    type={TicketType.Auction}
                  />
                ))}
          </>
        ) : (
          <NotFound text="You have no Auction tickets yet!" />
        )
      ) : currentTab === "all" ? (
        <>
          {ticketsTotalCount && ticketsTotalCount > 0 && (
            <div className="flex items-center space-x-2 mb-5">
              <SearchInput
                onSearch={handleSearchTickets}
                onClear={handleClearTicketSearchTerm}
                onChange={(e) => setTicketSearchTerm(e.target.value)}
                searchTerm={ticketSearchTerm}
              />
              <SortDropdown
                onChange={handleChangeTicketsSortOption}
                options={ticketSortOptions}
              />
              <div className="flex items-center">
                <StatusFilterDropdown
                  statuses={Object.values(TicketStatus).map((status) => ({
                    label: utils.capitalizeFirst(status),
                    value: status,
                  }))}
                  onSelect={handleSelectFilterStatus}
                />
                <button
                  className="btn btn-link text-error"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
          {tickets.length > 0 ? (
            <>
              {isTicketsLoading
                ? [1, 2, 3, 4, 5, 6].map((item) => (
                    <TicketSkeletonCard key={item} />
                  ))
                : tickets?.map((ticket) => (
                    <TicketCard
                      ticket={ticket}
                      key={ticket.id}
                      onViewDetails={() => openModal(ticket)}
                      onPlacedOrder={() => openPlacedOrderModal(ticket)}
                      type={TicketType.InStock}
                    />
                  ))}{" "}
            </>
          ) : (
            <NotFound text="Tickets not found" />
          )}
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
      ) : (
        <>
          {likedTickets.length > 0 ? (
            <>
              {isLikedTicketsLoading
                ? [1, 2, 3, 4, 5, 6].map((item) => (
                    <TicketSkeletonCard key={item} />
                  ))
                : likedTickets?.map((ticket) => (
                    <TicketCard
                      ticket={ticket}
                      key={ticket.id}
                      onViewDetails={() => openModal(ticket)}
                      onPlacedOrder={() => openPlacedOrderModal(ticket)}
                      type={TicketType.Favorite}
                      handleDislikeTicket={handleDislikeTicket}
                      handleLikeTicket={handleLikeTicket}
                    />
                  ))}{" "}
            </>
          ) : (
            <NotFound text="Tickets not found" />
          )}
        </>
      )}
    </div>
  );
};

export default Tickets;
