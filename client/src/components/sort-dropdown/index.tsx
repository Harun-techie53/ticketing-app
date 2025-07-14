"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SortDropdownProps {
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export default function SortDropdown({ onChange, options }: SortDropdownProps) {
  const [selected, setSelected] = useState(options[0]);

  const handleChange = (option: typeof selected) => {
    setSelected(option);
    onChange(option.value);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-outline m-1">
        Sort: {selected.label}
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52"
      >
        {options.map((option) => (
          <li key={option.value}>
            <button
              onClick={() => handleChange(option)}
              className={`${
                selected.value === option.value
                  ? "font-semibold text-primary"
                  : ""
              }`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
