"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  onSearch: () => void;
  placeholder?: string;
  onClear: () => void;
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
  onSearch,
  placeholder = "Search by Title...",
  onClear,
  searchTerm,
  onChange,
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          className="input input-primary w-full pr-20 focus:z-10"
          placeholder={placeholder}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-error cursor-pointer"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-500 hover:text-primary"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
