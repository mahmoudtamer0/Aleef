import React from "react";
import "./search.css";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput = ({
    value,
    onChange,
    placeholder = "Search..."
}: SearchInputProps) => {

    return (
        <div className="search-wrap">

            <svg
                className="search-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

        </div>
    );
};

export default SearchInput;