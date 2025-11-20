import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface UsersActionBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const UsersActionBar: React.FC<UsersActionBarProps> = ({
  onSearch,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-2xl shadow-sm",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center text-black  bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition">
          <Search className="w-4 h-4 text-muted mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
