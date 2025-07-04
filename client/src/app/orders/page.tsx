"use client";

import { apiGet, apiPost } from "@/helpers/axios/config";
import { Order } from "@/types";
import React, { useEffect, useState } from "react";
import { getOrderStatusClass } from "@/helpers/utils/statusClasses"; // If you have a helper for status styling

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedAuctionTicket, setSelectedAuctionTicket] = useState<
    Order["ticket"] | null
  >(null);
  const [basePrice, setBasePrice] = useState<number>(
    selectedAuctionTicket?.price || 0
  );
  const [expiresIn, setExpiresIn] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const handleChangeExpiresIn = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentDatetime = new Date();
    const expirationMinutes = parseInt(e.target.value);

    const expiresAt = new Date(
      currentDatetime.getTime() + expirationMinutes * 60000
    );

    setExpiresIn(expiresAt);
  };

  const handleSubmit = async () => {
    if (!selectedAuctionTicket) return;

    if (basePrice > selectedAuctionTicket.maxResalePrice) {
      setError("Base price cannot exceed max resale price.");
      return;
    }

    setError("");

    try {
      const response = await apiPost({
        apiPath: `/api/tickets/auctions`,
        data: {
          ticketId: selectedAuctionTicket.id,
          basePrice,
          expiresAt: expiresIn,
        },
        withCredentials: true,
      });
      closeAuctionModal();
    } catch (err) {
      console.error("Auction creation failed:", err);
      setError("Failed to create auction. Try again.");
    }
  };

  const fetchOrders = async () => {
    try {
      const orders = await apiGet<Order[]>({ apiPath: "/api/orders/me" });
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const openAuctionModal = (ticket: Order["ticket"]) => {
    setSelectedAuctionTicket(ticket);
    const modal = document.getElementById(
      "modal_auction"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const closeAuctionModal = () => {
    setSelectedAuctionTicket(null);
    const modal = document.getElementById(
      "modal_auction"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          🧾 Your Orders
        </h2>

        {orders?.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="card bg-base-100 shadow-lg border border-base-300"
              >
                <div className="card-body space-y-3">
                  <h3 className="text-lg font-semibold">
                    Order ID:{" "}
                    <span className="text-sm text-gray-500 break-all">
                      {order.id}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    📅 Created At:{" "}
                    <span className="font-medium">
                      {new Date(order.expiresAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    📦 Status:{" "}
                    <span
                      className={`badge badge-sm ${getOrderStatusClass?.(
                        order.status
                      )} capitalize`}
                    >
                      {order.status}
                    </span>
                  </p>

                  {order.ticket && (
                    <div className="bg-gray-50 rounded-md p-3 border border-dashed border-gray-300">
                      <h4 className="text-md font-semibold mb-2">🎫 Ticket</h4>
                      <p>
                        <span className="text-gray-500">Title:</span>{" "}
                        <span className="font-medium">
                          {order.ticket.title}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Description:</span>{" "}
                        {order.ticket.description}
                      </p>
                      <p>
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="text-success font-semibold">
                          ${order.ticket.price}
                        </span>
                      </p>
                      {
                        
                      }
                      <button
                        className="btn btn-neutral btn-sm mt-3"
                        onClick={() => openAuctionModal(order.ticket)}
                      >
                        Make Auction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-lg text-gray-600">
              You haven’t placed any orders yet.
            </p>
          </div>
        )}
      </div>
      <dialog id="modal_auction" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h4 className="card-title">Confirm Auction</h4>
          <div className="my-5">
            <p className="font-semibold text-sm w-[95%]">
              Max Resale Price: ${selectedAuctionTicket?.maxResalePrice}
            </p>
            <p className="text-ghost text-gray-500 text-sm w-[95%]">
              Regular Price: ${selectedAuctionTicket?.price}
            </p>
          </div>
          <div className="space-y-5">
            <label className="input">
              <span className="label">Base Price</span>
              <input
                type="number"
                placeholder="Set auction price"
                defaultValue={selectedAuctionTicket?.price}
                value={basePrice}
                onChange={(e) => setBasePrice(parseInt(e.target.value))}
              />
            </label>
            <label className="select">
              <span className="label">Expires At</span>
              <select
                defaultValue="Select Expiration Time"
                onChange={handleChangeExpiresIn}
              >
                <option disabled={true}>Select Expiration Time</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </label>
            {error && <p className="text-error text-sm font-medium">{error}</p>}
          </div>
          <button className="btn btn-accent btn-sm mt-5" onClick={handleSubmit}>
            Confirm Auction
          </button>
        </div>
      </dialog>
    </>
  );
};

export default Orders;
