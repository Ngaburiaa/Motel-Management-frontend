import { MapPin, Phone, Star, Edit } from "lucide-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { THotel } from "../../types/hotelsTypes";

interface DashboardHotelCardProps {
  hotel: THotel;
  onEdit?: () => void;
}

export const DashboardHotelCard: FC<DashboardHotelCardProps> = ({ hotel, onEdit }) => {
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if edit button was clicked
    if ((e.target as HTMLElement).closest('.edit-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/admin/hotels/${encodeURIComponent(hotel.name)}/${hotel.hotelId}`);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* Edit button (only shown if onEdit prop is provided) */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="edit-button absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-blue-600 p-2 rounded-full shadow-sm transition-all"
          aria-label="Edit hotel"
        >
          <Edit size={16} />
        </button>
      )}

      {/* Hotel thumbnail */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={hotel.thumbnail || fallbackImage}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Hotel info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800">{hotel.name}</h2>
          {hotel.category && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {hotel.category}
            </span>
          )}
        </div>

        {/* Location and rating */}
        <div className="flex items-center justify-between mt-3 text-sm">
          {hotel.location && (
            <span className="flex items-center gap-1 text-gray-600">
              <MapPin size={14} className="text-blue-500" /> 
              <span className="truncate max-w-[120px]">{hotel.location}</span>
            </span>
          )}
          {hotel.rating && (
            <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
              <Star size={14} className="text-yellow-500" /> 
              <span>{hotel.rating}</span>
            </span>
          )}
        </div>

        {/* Contact phone */}
        {hotel.contactPhone && (
          <p className="mt-3 text-gray-600 text-sm flex items-center gap-2">
            <Phone size={14} className="text-blue-500" /> 
            <span>{hotel.contactPhone}</span>
          </p>
        )}
      </div>
    </div>
  );
};