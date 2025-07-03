"use client";

import { apiGet } from "@/helpers/axios/config";
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
  const [auction, setAuction] = useState<AuctionWithBids | null>(null);

  const fetchAuction = async () => {
    try {
      const auction = await apiGet<Auction>({
        apiPath: `/api/tickets/auctions/${id}`,
      });

      const bidsWithUsers: AuctionBid[] = await Promise.all(
        auction.bids?.map(async (bid: BidDoc) => {
          const bidUser = await apiGet<User>({
            apiPath: `/api/users/${bid.userId}`,
          });
          return {
            ...bid,
            user: {
              ...bidUser,
              fullName: `${bidUser.firstName} ${bidUser.lastName}`,
            },
          };
        }) || []
      );

      const highestBidderUser = await apiGet<User>({
        apiPath: `/api/users/${auction.highestBidder.userId}`,
      });

      const highestBidder: AuctionBid = {
        ...auction.highestBidder,
        user: {
          ...highestBidderUser,
          fullName: `${highestBidderUser.firstName} ${highestBidderUser.lastName}`,
        },
      };

      const auctionModified: AuctionWithBids = {
        ...auction,
        bids: bidsWithUsers,
        highestBidder,
      };

      setAuction(auctionModified);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  return (
    <div className="container mx-auto px-6 py-10">
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

              {auction.bids?.length > 0 ? (
                <div className="space-y-4">
                  {auction.bids.map((bid) => (
                    <div key={bid.id} className="bg-gray-50 p-4 rounded border">
                      <p>
                        <strong>Bidder:</strong> {bid.user.fullName}
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

              {/* Place Bid Form */}
              {/* {auction.status === AuctionStatusType.Active && ( */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const price = parseFloat(formData.get("price") as string);
                    if (isNaN(price) || price <= 0) return;

                    // TODO: Add API call to submit the bid
                    console.log("Placing bid of: ", price);
                  }}
                  className="mt-6 space-y-4"
                >
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Your Bid Amount ($)
                      </span>
                    </label>
                    <input
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      placeholder="Enter amount"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <button className="btn btn-primary w-fit" type="submit">
                    Place Bid
                  </button>
                </form>
              {/* )} */}
            </div>
          </div>

          {/* Highest Bidder */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">🏆 Highest Bidder</h3>
              <p>
                <strong>Bidder:</strong> {auction.highestBidder.user.fullName}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                <span className="text-success">
                  ${auction.highestBidder.price}
                </span>
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(
                  auction.highestBidder.placedAt as Date
                ).toLocaleString()}
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
