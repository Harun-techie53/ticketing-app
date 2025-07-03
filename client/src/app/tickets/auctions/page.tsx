"use client";
import { apiGet } from "@/helpers/axios/config";
import { Auction } from "@/types";
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
      <ul>
        {auctions?.map((auction) => (
          <li key={auction.id} className="border p-4 mb-2">
            <p>Starting Price: ${auction.basePrice}</p>
            <p>End Date: {new Date(auction.expiresAt).toLocaleDateString()}</p>
            <p>Status: {auction.status}</p>
            <Link href={`/tickets/auctions/${auction.id}`}>
              <button className="bg-blue-500 text-white px-4 py-2 mt-5 hover:cursor-pointer">
                View Details
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Auctions;
