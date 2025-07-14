import React from "react";

const OrderSkeletonCard = () => {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300 animate-pulse">
      <div className="card-body space-y-3">
        {/* Order ID */}
        <div className="h-5 w-60 bg-base-200 rounded"></div>

        {/* Placed At */}
        <div className="h-4 w-40 bg-base-200 rounded"></div>

        {/* Status */}
        <div className="h-6 w-24 bg-base-300 rounded badge"></div>

        {/* Resaled At (optional) */}
        <div className="h-4 w-40 bg-base-200 rounded"></div>

        {/* Ticket section */}
        <div className="bg-gray-50 rounded-md p-3 border border-dashed border-gray-300 space-y-2">
          <div className="h-4 w-32 bg-base-300 rounded"></div>
          <div className="h-4 w-52 bg-base-200 rounded"></div>
          <div className="h-4 w-full bg-base-200 rounded"></div>
          <div className="h-4 w-24 bg-green-200 rounded"></div>

          {/* Auction button placeholder */}
          <div className="btn btn-neutral btn-sm mt-3 w-32 h-10 bg-base-200 border-none text-transparent">
            Loading
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeletonCard;
