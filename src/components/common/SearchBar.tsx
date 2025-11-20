// components/common/SearchBar.tsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebouncedValue } from "../../hook/useDebouncedValue";
import { LoadingSpinner } from "../ui/loadingSpinner";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  isLoading = false,
}: SearchBarProps) => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebouncedValue(input, 300);

  // Trigger search on debounce
  useEffect(() => {
    onSearch(debouncedInput.trim());
  }, [debouncedInput, onSearch]);

  // Trigger search on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(input.trim());
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search"
        className="pl-10 pr-10 w-full px-4 py-2 rounded-md border border-[#d1d5db] bg-white text-[#03071e] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#fca311] transition duration-200"
      />

      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingSpinner className="w-4 h-4 text-gray-500 animate-spin" />
        </div>
      )}
    </div>
  );
};
