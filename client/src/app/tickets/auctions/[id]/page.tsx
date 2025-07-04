"use client";

import { apiGet, apiPut } from "@/helpers/axios/config";
import socket from "@/helpers/socket";
import { Auction, AuctionStatusType, BidDoc, User } from "@/types";
import React, { useEffect, useState, use } from "react";

interface AuctionBid extends BidDoc {
  user: User & { fullName: string };
}

interface AuctionWithBids extends Auction {
  bids: AuctionBid[];
  highestBidder: AuctionBid;
}

const AuctionPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [auctionPrice, setAuctionPrice] = useState("");
  const [error, setError] = useState("");
  const [socketMessage, setSocketMessage] = useState(null);
  const [auctionBids, setAuctionBids] = useState<Auction["bids"]>([]);
  const [highestBidder, setHighestBidder] = useState<
    Auction["highestBidder"] | null
  >(null);

  const fetchAuction = async () => {
    try {
      const auction = await apiGet<Auction>({
        apiPath: `/api/tickets/auctions/${id}`,
      });

      setAuctionBids(auction.bids);
      setAuction(auction);
      setHighestBidder(auction.highestBidder);

      // const bidsWithUsers: AuctionBid[] = await Promise.all(
      //   auction.bids?.map(async (bid: BidDoc) => {
      //     const bidUser = await apiGet<User>({
      //       apiPath: `/api/users/${bid.userId}`,
      //     });
      //     return {
      //       ...bid,
      //       user: {
      //         ...bidUser,
      //         fullName: `${bidUser.firstName} ${bidUser.lastName}`,
      //       },
      //     };
      //   }) || []
      // );

      // const highestBidderUser = await apiGet<User>({
      //   apiPath: `/api/users/${auction.highestBidder.userId}`,
      // });

      // const highestBidder: AuctionBid = {
      //   ...auction.highestBidder,
      //   user: {
      //     ...highestBidderUser,
      //     fullName: `${highestBidderUser.firstName} ${highestBidderUser.lastName}`,
      //   },
      // };

      // const auctionModified: AuctionWithBids = {
      //   ...auction,
      //   bids: bidsWithUsers,
      //   highestBidder,
      // };
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
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // socket.emit("join", id);

    socket.on("auction-update", (data) => {
      // setSocketMessage(data.bid.message);
      setAuctionBids((prev) => [...prev, ...data.bids]);
      setHighestBidder(data.highestBidder);
      console.log("Data ", data)
    });

    // return () => {
    //   socket.off("auction:update");
    // };
  }, [id]);

  return (
    <div className="container mx-auto px-6 py-10">
      <p>Socket Message: {socketMessage || ""}</p>
      {auction ? (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary">
              🧾 Auction Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">Auction ID: {id}</p>
          </div>

          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body space-y-3">
              <h3 className="text-xl font-semibold">🧾 Auction Info</h3>
              <p>
                <strong>Base Price:</strong>{" "}
                <span className="text-success">${auction.basePrice}</span>
              </p>
              <p>
                <strong>Expires At:</strong>{" "}
                {new Date(auction.expiresAt as Date).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    auction.status === AuctionStatusType.Active
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {auction.status}
                </span>
              </p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body space-y-3">
              <h3 className="text-xl font-semibold">🎟️ Ticket Info</h3>
              <p>
                <strong>Title:</strong> {auction.ticket.title}
              </p>
              <p>
                <strong>Description:</strong> {auction.ticket.description}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                <span className="text-success">${auction.ticket.price}</span>
              </p>
              <p>
                <strong>Status:</strong> {auction.ticket.status}
              </p>
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
                      className="bg-gray-50 p-4 rounded border"
                    >
                      <p>
                        <strong>Bidder:</strong> {bid.userId}
                      </p>
                      <p>
                        <strong>Amount:</strong>{" "}
                        <span className="text-success">${bid.price}</span>
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(bid.placedAt as Date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No bids placed yet.</p>
              )}

              {/* {auction.status === AuctionStatusType.Active && ( */}
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
              {/* )} */}
            </div>
          </div>

          {/* Highest Bidder */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">🏆 Highest Bidder</h3>
              <p>
                <strong>Bidder:</strong> {highestBidder?.userId}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                <span className="text-success">${highestBidder?.price}</span>
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(highestBidder?.placedAt as Date).toLocaleString()}
              </p>
            </div>
          </div>
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
