import React, { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetRoomsQuery } from "../../features/api/roomsApi";

interface SuggestedRoomsProps {
  currentRoomId: number;
}

export const SuggestedRooms: React.FC<SuggestedRoomsProps> = ({
  currentRoomId,
}) => {
  const navigate = useNavigate();

  const {
    data: rooms,
    isLoading,
    isError,
  } = useGetRoomsQuery();

  const SkeletonCard = () => (
    <div className="rounded-lg bg-slate-100 animate-pulse overflow-hidden">
      <div className="h-32 bg-slate-200 w-full" />
      <div className="p-3">
        <div className="h-4 bg-slate-300 rounded w-3/4" />
      </div>
    </div>
  );

  const suggestedRooms = useMemo(() => {
    if (!rooms) return [];
    const filtered = rooms.filter((room) => room.roomId !== currentRoomId);
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 2);
  }, [rooms, currentRoomId]);

  if (isLoading) {
    return (
      <div className="p-0">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          You might also like
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !rooms) {
    return (
      <div className="flex items-center text-red-600 gap-2">
        <AlertTriangle size={20} />
        <span>Failed to load suggestions</span>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          You might also like
        </h3>
        <button
          onClick={() => navigate("/rooms")}
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {suggestedRooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => navigate(`/room/${room.roomId}`)}
            className="rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition cursor-pointer"
          >
            <img
              src={room.thumbnail}
              alt={room.roomType.name}
              className="h-32 w-full object-cover"
            />
            <div className="p-3">
              <h4 className="font-semibold text-gray-700 text-sm">
                {room.pricePerNight}
              </h4>
              <h4 className="font-semibold text-gray-700 text-sm">
                {room.roomType.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
