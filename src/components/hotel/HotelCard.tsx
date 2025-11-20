import { MapPin, Phone, Star } from "lucide-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { THotel } from "../../types/hotelsTypes";

interface HotelCardProps {
  hotel: THotel;
}

const HotelCard: FC<HotelCardProps> = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/hotel/${hotel.hotelId}`)}
      className="cursor-pointer group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative">
        <img
          src={hotel.thumbnail}
          alt={hotel.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-gray-700 rounded-full shadow">
          {hotel.category}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold text-neutral-800 truncate">{hotel.name}</h2>

        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-blue-500" />
            {hotel.location}
          </span>
          <span className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            {hotel.rating}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{hotel.description}</p>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Phone size={14} className="text-green-500" />
          <span>{hotel.contactPhone}</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
