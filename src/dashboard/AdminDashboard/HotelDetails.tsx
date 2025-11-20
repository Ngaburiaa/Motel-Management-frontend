// 🏨 HotelDetails.tsx
import { useNavigate, useParams } from "react-router";
import {
  useDeleteHotelMutation,
  useGetHotelByIdQuery,
  useGetRoomByHotelIdQuery,
} from "../../features/api";
import {
  MapPin,
  Phone,
  Landmark,
  Star,
  Trash2,
  Plus,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardRoomCard } from "../../components/room/DashboardRoomCard";
import { RoomFilterSidebar } from "../../components/room/RoomFilterSidebar";
import type { TRoom } from "../../types/roomsTypes";
import { Loading } from "../../components/common/Loading";

interface RoomFilters {
  search?: string;
  availableOnly?: boolean;
  maxPrice?: number;
  minGuests?: number;
}

export const HotelDetails = () => {
  const { id } = useParams();
  const hotelId = Number(id);
  const navigate = useNavigate();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<TRoom[]>([]);

  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError: isHotelError,
    refetch: hotelRefetch,
  } = useGetHotelByIdQuery(hotelId);

  const {
    data: rooms,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
    refetch: roomRefetch,
  } = useGetRoomByHotelIdQuery(hotelId);

  useEffect(() => {
    roomRefetch();
  }, [hotelId, roomRefetch]);

  const [deleteHotel] = useDeleteHotelMutation();

  const onFilter = (filters: RoomFilters) => {
    if (!rooms) return;
    const filtered = rooms.filter((room: TRoom) => {
      const matchSearch = filters.search
        ? room.roomType.name.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchAvailable = filters.availableOnly ? room.isAvailable : true;
      const matchPrice =
        filters.maxPrice !== undefined
          ? room.pricePerNight <= filters.maxPrice
          : true;
      const matchGuests =
        filters.minGuests !== undefined
          ? room.capacity >= filters.minGuests
          : true;

      return matchSearch && matchAvailable && matchPrice && matchGuests;
    });
    setFilteredRooms(filtered);
  };

  const handleDelete = () => {
  Swal.fire({
    title: "Delete Hotel?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteHotel(hotelId);
      navigate(-1);
      Swal.fire("Deleted!", "The hotel has been removed.", "success");
      hotelRefetch();
    }
  });
};

  const isLoading = isHotelLoading || isRoomsLoading;
  const isError = isHotelError || isRoomsError;

  const roomsToDisplay = filteredRooms.length > 0 ? filteredRooms : rooms || [];

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading hotel details.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative">
        <img
          src={hotel.thumbnail}
          alt={hotel.name}
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between">
          <div className="flex justify-end p-4 gap-2">
            <button onClick={handleDelete} className="btn btn-sm btn-error">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </button>
          </div>

          <div className="p-4 text-white">
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <div className="text-sm flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {hotel.location}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={14} /> {hotel.contactPhone}
              </span>
              <span className="flex items-center gap-1">
                <Landmark size={14} /> {hotel.category}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400" /> {hotel.rating}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {hotel.gallery?.length > 0 && (
        <div className="px-4 py-6 max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {hotel.gallery.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery Image ${idx + 1}`}
                className="rounded-xl object-cover w-full h-40"
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Rooms</h2>
          <button
            onClick={() => navigate(`/admin/create-room/${hotelId}`)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Room
          </button>
        </div>

        {/* Floating Filter Button (Always visible) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="btn btn-primary shadow-lg"
          >
            <Filter className="w-4 h-4 mr-2" /> Filter Rooms
          </button>
        </div>

        {/* Filter Modal */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center md:justify-end md:items-end md:py-5 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
              >
                <RoomFilterSidebar onFilter={onFilter} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {roomsToDisplay.map((room: TRoom) => (
            <DashboardRoomCard key={room.roomId} room={room} />
          ))}
        </div>
      </div>

    </div>
  );
};
