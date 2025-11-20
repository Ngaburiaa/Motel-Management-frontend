import { useNavigate } from "react-router-dom";
import { BedDouble, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { TRoomType } from "../../types/roomsTypes";

export interface RoomData {
  roomId: number;
  roomType: TRoomType;
  capacity: number;
  pricePerNight: string;
  thumbnail: string;
  isAvailable: boolean;
}

interface WishlistCardProps {
  room: RoomData;
  wishlistId: number;
  onRemove: (wishlistId: number) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({ room, wishlistId, onRemove }) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md">
      {/* Thumbnail with trash icon */}
      <div className="relative">
        <img
          src={room.thumbnail}
          alt={room.roomType.name}
          className="w-full h-60 object-cover"
        />
        <button
          onClick={() => onRemove(wishlistId)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/100 p-2 rounded-full shadow-md transition"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">{room.roomType.name}</h2>
        <p className="text-gray-600 flex items-center gap-1">
          <BedDouble className="w-4 h-4" />
          Capacity: {room.capacity} guests
        </p>
        <p className="text-gray-800 font-semibold text-lg">
          ${room.pricePerNight} / night
        </p>
        <div className="flex justify-between pt-2 gap-2">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate(`/room/${room.roomId}`)}
            
          >
            View Details
          </Button>
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700"
            onClick={() => navigate(`/user/checkout/${room.roomId}`)}

          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
