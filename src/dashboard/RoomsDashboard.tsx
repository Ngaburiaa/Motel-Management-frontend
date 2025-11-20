// Redesigned RoomsDashboard.tsx with integrated floating filter button and search bar
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { DashboardRoomCard } from '../components/room/DashboardRoomCard';
import { Loading } from '../components/common/Loading';
import { Error } from '../components/common/Error';
import { useGetRoomByHotelIdQuery, useGetRoomsQuery } from '../features/api/roomsApi';
import { SearchBar } from '../components/common/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { RoomFilterSidebar, type RoomFilterValues } from '../components/room/RoomFilterSidebar';

export const RoomsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userType, userId } = useSelector((state: RootState) => state.auth);
  const { data: allRooms, isLoading: isLoadingAll, error: allRoomsError } = useGetRoomsQuery();
  const { data: ownerRooms, isLoading: isLoadingOwner, error: ownerRoomsError } = useGetRoomByHotelIdQuery(userId as number, {
    skip: userType !== 'owner',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RoomFilterValues | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userType === 'user') {
      navigate('/user/dashboard');
    }
  }, [userType, navigate]);

  const roomsToDisplay = useMemo(() => {
    const baseRooms = userType === 'admin' ? allRooms : ownerRooms;
    if (!baseRooms) return [];

    return baseRooms.filter((room) => {
      if (filters?.availableOnly && !room.isAvailable) return false;
      if (filters?.maxPrice && room.pricePerNight > filters.maxPrice) return false;
      if (filters?.minGuests && room.capacity < filters.minGuests) return false;
      if (filters?.search && !room.roomType.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (searchTerm && !room.roomType.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [allRooms, ownerRooms, userType, filters, searchTerm]);

  const isLoading = (userType === 'admin' && isLoadingAll) || (userType === 'owner' && isLoadingOwner);
  const isError = (userType === 'admin' && allRoomsError) || (userType === 'owner' && ownerRoomsError);

  if (userType === 'user') return null;
  if (isLoading) return <Loading />;
  if (isError) return <Error message="Failed to load rooms. Please try again later." />;

  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          {userType === 'admin' ? 'All Rooms' : 'Your Hotel Rooms'}
        </h1>
        <div className="w-full md:max-w-md">
          <SearchBar onSearch={setSearchTerm} placeholder="Search by room type..." />
        </div>
      </div>

      {roomsToDisplay.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No Rooms Found</h2>
          <p className="text-slate-600">
            {userType === 'admin' ? 'There are currently no rooms in the system.' : 'You have not added any rooms to your hotel yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roomsToDisplay.map((room) => (
            <DashboardRoomCard
              key={room.roomId}
              room={{
                roomId: room.roomId,
                roomType: room.roomType,
                pricePerNight: room.pricePerNight,
                capacity: room.capacity,
                isAvailable: room.isAvailable,
                thumbnail: room.thumbnail || '',
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Filter Button */}
      <motion.button
        onClick={() => setShowFilters(true)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="fixed z-50 bottom-6 right-6 md:right-10 bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl"
      >
        <Filter className="w-5 h-5" />
      </motion.button>

      {/* Overlay for filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 max-w-md w-full md:w-80"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <RoomFilterSidebar
              onFilter={(data) => {
                setFilters(data);
                setShowFilters(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
