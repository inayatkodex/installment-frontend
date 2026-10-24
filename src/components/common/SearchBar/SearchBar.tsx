"use client";

import { Search, X } from "lucide-react";
import "./searchbar.scss";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Naam ya mobile se dhoondein",
  label = "Search",
}: Props) => (
  <div className="search-bar">
    <Search size={20} aria-hidden="true" />
    <input
      type="search"
      aria-label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Search saaf karein"
      >
        <X size={18} />
      </button>
    )}
  </div>
);

export default SearchBar;
