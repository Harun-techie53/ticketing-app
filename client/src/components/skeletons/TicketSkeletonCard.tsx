import React from "react";

const TicketSkeletonCard = () => {
  return (
    <div className="card bg-base-100 border border-zinc-100 p-5 w-full shadow-sm mb-5 animate-pulse transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2 w-full">
          <div className="h-5 w-32 bg-zinc-200 rounded"></div>
          <div className="h-5 w-20 bg-zinc-300 rounded badge badge-sm"></div>
        </div>
        <div className="h-4 w-24 bg-zinc-200 rounded hidden md:block" />
      </div>

      <div className="mt-3 h-4 w-48 bg-zinc-200 rounded" />
      <div className="mt-1 h-4 w-32 bg-zinc-200 rounded" />

      <div className="text-sm my-4 space-y-2">
        <div className="h-4 w-full bg-zinc-200 rounded" />
        <div className="h-4 w-[90%] bg-zinc-200 rounded" />
        <div className="h-4 w-[60%] bg-zinc-200 rounded" />

        <div className="h-6 w-24 bg-orange-200 rounded mt-2" />
      </div>

      <div className="flex gap-2">
        <div className="btn btn-info btn-sm w-32 h-10 bg-zinc-200 border-none text-transparent">
          Loading
        </div>
        <div className="btn btn-primary btn-sm w-28 h-10 bg-zinc-200 border-none text-transparent">
          Loading
        </div>
      </div>
    </div>
  );
};

export default TicketSkeletonCard;
