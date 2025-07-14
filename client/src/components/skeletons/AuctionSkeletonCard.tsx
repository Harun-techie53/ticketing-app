import React from "react";

const AuctionSkeletonCard = () => {
  return (
    <div className="card border border-zinc-100 p-5 w-full shadow-sm mb-5 animate-pulse">
      {/* Title and Status */}
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div className="h-5 w-40 bg-base-200 rounded" />
          <div className="indicator">
            <span className="indicator-item bg-gray-300 status status-neutral"></span>
            <div className="h-4 w-16 bg-base-300 rounded badge badge-sm"></div>
          </div>
        </div>
        <div className="h-4 w-10 bg-transparent" />
      </div>

      {/* Raised By */}
      <div className="flex items-end gap-1 mt-2">
        <div className="h-4 w-20 bg-base-200 rounded" />
        <div className="h-4 w-24 bg-base-300 rounded" />
      </div>

      {/* Price + Expiration */}
      <div className="my-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <div className="h-4 w-24 bg-base-200 rounded" />
            <div className="h-4 w-16 bg-base-300 rounded" />
          </div>
          <div className="h-4 w-24 bg-base-200 rounded" />
        </div>
        <div className="h-4 w-40 bg-base-200 rounded" />
      </div>

      {/* Button */}
      <div className="btn btn-info btn-outline btn-sm w-32 h-10 bg-base-200 border-none text-transparent">
        Loading
      </div>
    </div>
  );
};

export default AuctionSkeletonCard;
