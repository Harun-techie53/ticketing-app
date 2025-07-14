"use client";
import ExpirationCountdown from "@/components/expiration-countdown";
import SearchInput from "@/components/search-input";
import AuctionSkeletonCard from "@/components/skeletons/AuctionSkeletonCard";
import SortDropdown from "@/components/sort-dropdown";
import StatusFilterDropdown from "@/components/status-filter-dropdown";
import { apiGet } from "@/helpers/axios/config";
import { utils } from "@/helpers/utils";
import { Auction, AuctionStatusType } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const sortOptions = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
];

const Auctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [auctionsTotalCount, setAuctionsTotalCount] = useState<number | null>(
    null
  );
  const [isAuctionsLoading, setIsAuctionsLoading] = useState<boolean>(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const fetchAuctions = async () => {
    setIsAuctionsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (selectedSortOption) {
        queryParams.append("sort", selectedSortOption);
      }

      if (selectedStatus) {
        queryParams.append("status", selectedStatus);
      }
      const responseAuctions = await apiGet<{
        auctions: Auction[];
        totalDocumentsCount: number;
      }>({
        apiPath: `/api/tickets/auctions/all?${queryParams.toString()}`,
        withCredentials: true,
      });

      setAuctions(responseAuctions.auctions);
      setAuctionsTotalCount(responseAuctions.totalDocumentsCount);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsAuctionsLoading(false);
    }
  };

  const handleSelectStatus = (option: { label: string; value: string }) => {
    setSelectedStatus(option.value);
  };

  useEffect(() => {
    fetchAuctions();
  }, [selectedSortOption, selectedStatus]);
  return (
    <div className="container mx-auto px-10 py-5">
      {auctionsTotalCount && auctionsTotalCount > 0 && (
        <div className="flex items-center space-x-2 mb-5">
          {/* <SearchInput searchTerm={searchTerm} onSearch={} onChange={(e) => setSearchTerm(e.target.value)} onClear={} /> */}
          <SortDropdown
            options={sortOptions}
            onChange={(option) => setSelectedSortOption(option)}
          />
          {/* <StatusFilterDropdown
            statuses={Object.values(AuctionStatusType).map((status) => ({
              label: utils.capitalizeFirst(status),
              value: status,
            }))}
            onSelect={handleSelectStatus}
          /> */}
        </div>
      )}
      {isAuctionsLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <AuctionSkeletonCard key={index} />
          ))}
        </div>
      ) : auctions?.length > 0 ? (
        auctions.map((auction) => (
          <div
            key={auction.id}
            className="card border border-zinc-100 p-5 w-full shadow-sm mb-5"
          >
            {/* Title and Status */}
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

            {/* Raised By */}
            <span className="flex items-end gap-1">
              <p className="text-sm text-gray-600">Raised by</p>{" "}
              <p className="font-semibold">
                {auction.raisedBy?.firstName ?? ""}{" "}
                {auction.raisedBy?.lastName ?? ""}
              </p>
            </span>

            {/* Price and Expiry */}
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

            {/* View Button */}
            <Link href={`/tickets/auctions/${auction.id}`}>
              <button className="btn btn-info btn-outline btn-sm">
                View Details
              </button>
            </Link>
          </div>
        ))
      ) : (
        <h4 className="text-error card-title flex justify-center">
          No Auctions to Feature
        </h4>
      )}
    </div>
  );
};

export default Auctions;
