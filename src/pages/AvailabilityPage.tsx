import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCheckAvailabilityQuery } from "../features/api/availabilityApi";
import { RoomCard } from "../components/room/RoomCard";
import { RoomCardSkeleton } from "../components/room/skeleton/RoomCardSkeleton";
import { parseRTKError } from "../utils/parseRTKError";
import { Error } from "../components/common/Error";
import { BedDouble, Filter, X } from "lucide-react";
import { RoomFilterSidebar, type RoomFilterValues } from "../components/room/RoomFilterSidebar";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/common/NavBar";
import { Footer } from "../components/common/Footer";

export const AvailabilityPage = () => {
  const [params] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RoomFilterValues>({
    search: "",
    availableOnly: false,
    maxPrice: 1000,
    minGuests: 1,
  });

  const checkInDate = params.get("checkInDate") || "";
  const checkOutDate = params.get("checkOutDate") || "";
  const capacity = params.get("capacity");

  const { data: rooms, isLoading, error } = useCheckAvailabilityQuery(
    {
      checkInDate,
      checkOutDate,
      ...(capacity ? { capacity: parseInt(capacity, 10) } : {}),
    },
    {
      skip: !checkInDate || !checkOutDate,
    }
  );

  console.log(rooms)

  const filteredRooms = useMemo(() => {
  if (!rooms) return [];

  return rooms.filter((room) => {
    const roomTypeName = room?.roomType?.name || "";
    const matchesSearch = roomTypeName
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesPrice = Number(room.pricePerNight) <= filters.maxPrice;
    const matchesGuests = room.capacity >= filters.minGuests;
    const matchesAvailability = filters.availableOnly ? room.isAvailable : true;

    return matchesSearch && matchesPrice && matchesGuests && matchesAvailability;
  });
}, [rooms, filters]);

  const hasRooms = filteredRooms.length > 0;

  return (
    <div>
        <Navbar/>
    <section className="min-h-screen bg-white pb-8 md:px-4 ">
      {/* Header */}
      <div className="relative md:mb-10 md:rounded-2xl overflow-hidden shadow-md">
        <img
          src="https://media.istockphoto.com/id/1412577897/photo/living-room-with-cabinet-for-tv-on-dark-green-color-wall-background.jpg?s=612x612&w=0&k=20&c=snmlGHKrwnglSiqKmsRkYHKdCgUzttEYvGlOB16zAWs="
          alt="Available Rooms"
          className="w-full h-[200px] object-cover brightness-75"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg flex items-center gap-3">
            <BedDouble className="w-8 h-8" /> Available Rooms
          </h1>
        </div>
      </div>

      {/* Filter Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <button
          className="btn btn-outline btn-sm lg:hidden flex items-center gap-2"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block">
          <RoomFilterSidebar onFilter={setFilters} />
        </div>

        {/* Room Cards or States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        ) : error || !hasRooms ? (
          <Error message={parseRTKError(error, "No available rooms found.")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.roomId} room={room} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-800/70 flex justify-center items-start pt-20 px-4 lg:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <button
                className="absolute top-4 right-4 text-slate-600 hover:text-red-500 z-50"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <RoomFilterSidebar
                onFilter={(data) => {
                  setFilters(data);
                  setIsFilterOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Filter Button */}
      <motion.button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-30 btn btn-primary rounded-full shadow-lg w-14 h-14 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Filter className="w-6 h-6" />
      </motion.button>
    </section>
    <Footer/>
    </div>
  );
};
