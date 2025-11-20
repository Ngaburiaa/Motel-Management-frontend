import { Filter } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  selectedRoomType: string;
  setSelectedRoomType: (value: string) => void;
  availableRoomTypes: string[];
  onClear: () => void;
};

export const BookingFilterSidebar = ({
  filterStatus,
  setFilterStatus,
  selectedRoomType,
  setSelectedRoomType,
  availableRoomTypes,
  onClear,
}: Props) => {
  return (
    <aside className="w-full lg:w-72 bg-white shadow-md rounded-2xl p-6 space-y-6 lg:sticky top-6 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 text-blue-600">
        <Filter className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Booking Filters</h3>
      </div>

      {/* Booking Status Dropdown */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Booking Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full h-10 px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-shadow"
        >
          {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Room Type Dropdown */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Room Type
        </label>
        <select
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          className="w-full h-10 px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-shadow"
        >
          <option value="All">All</option>
          {availableRoomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <div className="pt-4">
        <Button
          onClick={onClear}
          variant="outline"
          className="w-full border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white transition rounded-xl"
        >
          Clear All Filters
        </Button>
      </div>
    </aside>
  );
};
