import { useGetTicketsQuery } from "../../features/api";
import { UserRound, Filter, RotateCcw } from "lucide-react";

interface Props {
  filters: { user: string; status: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ user: string; status: string }>
  >;
}

export const TicketFilters = ({ filters, setFilters }: Props) => {
  const { data: tickets } = useGetTicketsQuery();

  const userNames = Array.from(
    new Set(
      tickets?.map(
        (ticket) => `${ticket.user?.firstName ?? ""} ${ticket.user?.lastName ?? ""}`
      ) || []
    )
  );

  const resetFilters = () =>
    setFilters({
      user: "",
      status: "",
    });

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Filter size={20} className="text-[#fca311]" />
        <h2 className="text-xl font-semibold text-[#14213d] tracking-tight">Manage Tickets</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        {/* User Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <label className="text-sm text-[#14213d] font-medium flex items-center gap-1">
            <UserRound size={16} className="text-[#fca311]" />
            User
          </label>
          <input
            type="text"
            placeholder="John Doe"
            list="userNames"
            value={filters.user}
            onChange={(e) =>
              setFilters((f) => ({ ...f, user: e.target.value }))
            }
            className="px-3 py-2 border border-[#e5e5e5] rounded-lg text-sm bg-white text-[#03071e] focus:outline-none focus:ring-2 focus:ring-[#fca311] w-48"
          />
          <datalist id="userNames">
            {userNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <label className="text-sm text-[#14213d] font-medium">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
            className="px-3 py-2 border border-[#e5e5e5] rounded-lg text-sm bg-white text-[#03071e] focus:outline-none focus:ring-2 focus:ring-[#fca311] w-40"
          >
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 border border-[#fca311] text-[#fca311] hover:bg-[#fca311] hover:text-white transition px-4 py-2 text-sm rounded-lg font-medium"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
};
