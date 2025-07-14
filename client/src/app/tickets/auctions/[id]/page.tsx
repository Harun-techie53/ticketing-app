"use client";

import { ExpandableText } from "@/components/expandable-text";
import ExpirationCountdown from "@/components/expiration-countdown";
import { useToast } from "@/contexts/ToastContext";
import { apiGet, apiPut } from "@/helpers/axios/config";
import socket from "@/helpers/socket";
import { utils } from "@/helpers/utils";
import { showGlobalToast } from "@/helpers/utils/globals";
import { Auction, AuctionStatusType, BidDoc, ToastType, User } from "@/types";
import React, { useEffect, useState, use } from "react";

const AuctionPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [auctionPrice, setAuctionPrice] = useState("");
  const [error, setError] = useState("");
  const [auctionBids, setAuctionBids] = useState<BidDoc[]>([]);
  const [highestBidder, setHighestBidder] = useState<
    Auction["highestBidder"] | null
  >(null);

  const fetchAuction = async () => {
    try {
      const auction = await apiGet<Auction>({
        apiPath: `/api/tickets/auctions/${id}`,
        withCredentials: true,
      });

      setAuctionBids(auction.bids);
      setAuction(auction);
      setHighestBidder(auction.highestBidder);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auction) return;

    if (parseInt(auctionPrice) < auction.basePrice) {
      setError("Bid price cannot be less than auction base price");
      return;
    }

    setError("");

    try {
      const response = await apiPut({
        apiPath: `/api/tickets/auctions/${auction?.id}`,
        data: {
          price: parseInt(auctionPrice),
        },
        withCredentials: true,
      });

      setAuctionPrice("");
      showGlobalToast("Successfully placed the bid", ToastType.Info);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    socket.on("auction-update", (data) => {
      setAuctionBids(data.bids);
      setHighestBidder(data.highestBidder);
      console.log("Data ", data);
    });
  }, [id]);

  return (
    <div className="container mx-auto px-6 py-10">
      {auction ? (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <p className="text-lg font-semibold text-neutral">{auction.id}</p>
              {auction.status === AuctionStatusType.Active ? (
                <div className="indicator">
                  <span className="indicator-item status status-success"></span>
                  <p className="badge badge-success badge-outline badge-sm">
                    Active
                  </p>
                </div>
              ) : (
                <div className="indicator">
                  <span className="indicator-item status status-error"></span>
                  <p className="badge badge-error badge-outline badge-sm">
                    Inactive
                  </p>
                </div>
              )}
            </div>
            <span className="flex items-end gap-1">
              <p className="text-sm text-gray-600">Created by</p>{" "}
              <p className="font-semibold">
                {auction.raisedBy?.firstName} {auction.raisedBy?.lastName}
              </p>
            </span>
            <span className="flex items-end gap-1">
              <p className="text-sm text-gray-600">Starting Price</p>{" "}
              <strong>${auction.basePrice}</strong>
            </span>
          </div>

          {/* Ticket Details */}
          <div className="card border border-zinc-100 p-5 w-full shadow-sm">
            <p className="card-title">{auction.ticket.title}</p>
            <div className="text-sm my-4 space-y-2">
              <ExpandableText text={auction.ticket.description} lines={3} />

              <span className="flex items-end gap-1">
                <p className="text-sm text-gray-600">Regular Price</p>{" "}
                <strong>${auction.ticket.price}</strong>
              </span>
              <span className="flex items-end gap-1">
                <p className="text-sm text-gray-600">Max Resale Price</p>{" "}
                <strong>${auction.ticket.maxResalePrice}</strong>
              </span>
            </div>
          </div>

          {/* Bids Section */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">📈 Listed Bids</h3>

              {auctionBids?.length > 0 ? (
                <div className="space-y-4">
                  {auctionBids.map((bid) => (
                    <div
                      key={bid._id}
                      className="card border border-zinc-100 p-5 w-full shadow-sm space-y-1"
                    >
                      <p className="text-[1rem]">
                        {bid.user?.firstName ?? ""} {bid.user?.lastName ?? ""}
                      </p>
                      <p>
                        <strong>Amount:</strong>{" "}
                        <span className="text-success font-semibold">
                          ${bid.price}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 font-semibold">
                        Placed{" "}
                        {utils.getRelativeTime(
                          new Date(bid.placedAt).toISOString()
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No bids placed yet.</p>
              )}

              {auction.status === AuctionStatusType.Active && (
                <form onSubmit={handleSubmitBid} className="mt-6 space-y-4">
                  {error && (
                    <p className="text-error text-sm font-medium">{error}</p>
                  )}
                  <div className="form-control space-x-2">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Your Bid Amount
                      </span>
                    </label>
                    <label className="input input-bordered w-full max-w-xs">
                      <span className="label">$</span>
                      <input
                        name="price"
                        type="number"
                        min={auction.basePrice}
                        value={auctionPrice}
                        onChange={(e) => setAuctionPrice(e.target.value)}
                        required
                        placeholder="Enter amount"
                      />
                    </label>
                    <button className="btn btn-primary w-fit" type="submit">
                      Place Bid
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Highest Bidder */}
          {highestBidder && (
            <div className="card border border-zinc-100 p-5 w-full shadow-sm space-y-1">
              <h3 className="text-xl font-semibold mb-4">Highest Bidder</h3>
              <p className="text-[1rem]">
                {highestBidder.user?.firstName ?? ""}{" "}
                {highestBidder.user?.lastName ?? ""}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                <span className="text-success font-semibold">
                  ${highestBidder.price}
                </span>
              </p>
              <p className="text-xs text-gray-500 font-semibold">
                Placed{" "}
                {utils.getRelativeTime(
                  new Date(highestBidder.placedAt).toISOString()
                )}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-500">Auction not found.</p>
        </div>
      )}
    </div>
  );
};

export default AuctionPage;
