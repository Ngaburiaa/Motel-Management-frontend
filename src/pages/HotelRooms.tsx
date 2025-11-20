import { useState, useMemo } from "react";
import NavBar from "../components/common/NavBar";
import { useGetHotelByIdQuery, useGetRoomByHotelIdQuery } from "../features/api";
import type { TRoom } from "../types/roomsTypes";
import { RoomCard } from "../components/room/RoomCard";
import { SortAsc, SortDesc, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RoomFilterSidebar,
  type RoomFilterValues,
} from "../components/room/RoomFilterSidebar";
import { useParams } from "react-router";

export const HotelRooms = () => {
  const { id: hotelId } = useParams<{ id: string }>();
  const {
    data: rooms,
    isError: isRoomsError,
    isLoading: isRoomsLoading,
  } = useGetRoomByHotelIdQuery(Number(hotelId));

  const {
    data: hotel,
    isError: isHotelError,
    isLoading: isHotelLoading,
  } = useGetHotelByIdQuery(Number(hotelId));

  const [filters, setFilters] = useState<RoomFilterValues>({
    search: "",
    availableOnly: false,
    maxPrice: 1000,
    minGuests: 1,
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  const filteredRooms = useMemo(() => {
    return (rooms ?? [])
      .filter((room) => !filters.availableOnly || room.isAvailable)
      .filter((room) =>
        room.roomType.name.toLowerCase().includes(filters.search.toLowerCase())
      )
      .filter((room) => Number(room.pricePerNight) <= filters.maxPrice)
      .filter((room) => room.capacity >= filters.minGuests)
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.pricePerNight - b.pricePerNight
          : b.pricePerNight - a.pricePerNight
      );
  }, [rooms, filters, sortOrder]);

  if (isRoomsLoading || isHotelLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <motion.p
          className="text-xl text-[#14213d] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  if (isRoomsError || isHotelError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <motion.p
          className="text-lg text-red-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Failed to load data. Please try again.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 text-[#14213d] relative">
      <NavBar />

      {/* Hero */}
      <div
        className="h-64 w-full bg-cover bg-center relative mb-12"
        style={{
          backgroundImage: `url(${hotel?.thumbnail || '/default-hotel.jpg'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            className="text-white text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {hotel?.name || "Hotel Rooms"}
          </motion.h1>
          <motion.p
            className="text-white text-base max-w-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {hotel?.description || "Find the perfect room that suits your style, comfort, and budget."}
          </motion.p>
        </div>
      </div>

      {/* Responsive Filter Sidebar */}
      <AnimatePresence>
        {showFilterSidebar && (
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
                onClick={() => setShowFilterSidebar(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <RoomFilterSidebar
                onFilter={(data) => {
                  setFilters(data);
                  setShowFilterSidebar(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Button - Only Mobile */}
      <motion.button
        onClick={() => setShowFilterSidebar(true)}
        className="lg:hidden fixed bottom-5 right-5 z-30 btn btn-primary rounded-full shadow-lg w-14 h-14 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Filter className="w-6 h-6" />
      </motion.button>

      {/* Page Layout */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto px-4 pb-20">
        {/* Sidebar Filters - Only Desktop */}
        <div className="lg:w-[300px] hidden lg:block sticky top-24 self-start">
          <RoomFilterSidebar onFilter={setFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Sort Toggle */}
          <div className="flex justify-end mb-6">
            <motion.button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl font-medium shadow-md transition-all"
            >
              {sortOrder === "asc" ? (
                <>
                  <SortAsc className="w-4 h-4" />
                  <span>Price Low</span>
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4" />
                  <span>Price High</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Room Grid */}
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.07 },
                },
              }}
            >
              {filteredRooms.map((room: TRoom) => (
                <motion.div
                  key={room.roomId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <RoomCard
                    room={{
                      ...room,
                      pricePerNight: Number(room.pricePerNight),
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredRooms.length === 0 && (
            <motion.p
              className="text-center text-slate-500 mt-12 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No rooms match your criteria.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};