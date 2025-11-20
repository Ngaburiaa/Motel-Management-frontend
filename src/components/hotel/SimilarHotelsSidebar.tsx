import React from "react";
import { useGetHotelsQuery } from "../../features/api";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface SimilarHotelsSidebarProps {
  currentHotelId: number;
}

export const SimilarHotelsSidebar: React.FC<SimilarHotelsSidebarProps> = ({
  currentHotelId,
}) => {
  const {
    data: allHotels,
    isLoading,
    isError,
  } = useGetHotelsQuery();

  const navigate = useNavigate();

  const getRandomizedHotels = () => {
    if (!allHotels) return [];
    const filtered = allHotels.filter(
      (hotel: { hotelId: number }) => hotel.hotelId !== currentHotelId
    );
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  const otherHotels = getRandomizedHotels();

  if (isLoading) {
    return (
      <aside className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </aside>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-2 text-red-600 h-48">
        <AlertTriangle className="w-5 h-5" />
        <span className="text-sm font-medium">Failed to load similar hotels.</span>
      </div>
    );
  }

  return (
    <aside className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-blue-700 mb-4 tracking-tight">
        Similar Hotels
      </h2>

      <ul className="space-y-4">
        {otherHotels.map(
          (hotel: {
            hotelId: number;
            name: string;
            thumbnail?: string;
          }) => (
            <li
              key={hotel.hotelId}
              onClick={() => navigate(`/hotel/${hotel.hotelId}`)}
              className={clsx(
                "flex items-center gap-4 p-2 rounded-lg transition",
                "hover:bg-blue-50 hover:shadow-sm cursor-pointer"
              )}
            >
              <img
                src={hotel.thumbnail || "/default-hotel.jpg"}
                alt={hotel.name}
                className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              />
              <span className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                {hotel.name}
              </span>
            </li>
          )
        )}
      </ul>
    </aside>
  );
};
