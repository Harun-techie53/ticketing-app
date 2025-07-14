"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TicketStatus } from "@hrrtickets/common";

export default function StatusFilterDropdown({
  statuses,
  onSelect,
}: {
  statuses: { label: string; value: string }[];
  onSelect: (status: { label: string; value: string }) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const handleSelect = (status: { label: string; value: string }) => {
    setSelectedStatus(status);
    onSelect(status);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 flex items-center gap-2"
      >
        {selectedStatus ? `Status: ${selectedStatus.label}` : "Select Status"}
        <ChevronDown size={16} />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-md"
      >
        {statuses.map((status) => (
          <li key={status.value}>
            <a onClick={() => handleSelect(status)}>{status.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
