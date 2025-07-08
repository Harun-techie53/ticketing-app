"use client";
import ExpirationCountdown from "@/components/expiration-countdown";
import { apiGet } from "@/helpers/axios/config";
import { utils } from "@/helpers/utils";
import { Auction, AuctionStatusType } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Auctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const fetchAuctions = async () => {
    try {
      const responseAuctions = await apiGet<Auction[]>({
        apiPath: "/api/tickets/auctions/all",
      });
      console.log("Fetched Auctions:", responseAuctions);
      setAuctions(responseAuctions);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };
  useEffect(() => {
    fetchAuctions();
  }, []);
  return (
    <div className="container mx-auto px-10 py-5">
      <h2 className="pb-5">Auctions Listed Below</h2>
      {auctions?.map((auction) => (
        <div
          className="card border border-zinc-100 p-5 w-full shadow-sm mb-5"
          key={auction.id}
        >
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <h4 className="card-title">{auction.ticket.title}</h4>
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
            <p></p>
          </div>
          <span className="flex items-end gap-1">
            <p className="text-sm text-gray-600">Raised by</p>{" "}
            <p className="font-semibold">
              {auction.ticket.order.user.firstName}{" "}
              {auction.ticket.order.user.lastName}
            </p>
          </span>
          <div className="my-3">
            <div className="flex items-center justify-between">
              <span className="flex items-end gap-1">
                <p className="text-sm text-gray-600">Starting Price</p>{" "}
                <strong>${auction.basePrice}</strong>
              </span>
              {auction.status === AuctionStatusType.Active && (
                <ExpirationCountdown expiresAt={auction.expiresAt} />
              )}
            </div>
            {auction.status === AuctionStatusType.Inactive && (
              <span className="flex items-end gap-1 mt-2">
                <p className="text-xs text-gray-500 font-semibold">
                  Expired{" "}
                  {utils.getRelativeTime(
                    new Date(auction.expiresAt).toISOString()
                  )}
                </p>
              </span>
            )}
          </div>

          <Link href={`/tickets/auctions/${auction.id}`}>
            <button className="btn btn-info btn-outline btn-sm">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Auctions;
