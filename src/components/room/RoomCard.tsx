import {
  BedDouble,
  DollarSign,
  Users
} from "lucide-react";
import { useNavigate } from "react-router";
import type { TRoom } from "../../types/roomsTypes";

interface RoomCardProps {
  room: TRoom;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden border border-slate-200"
      onClick={() => navigate(`/room/${room.roomId}`)}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={room.thumbnail}
          alt={room.roomType?.name ?? "Room Image"}
          className="w-full h-48 object-cover"
        />

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold uppercase rounded-full backdrop-blur-md border ${
            room.isAvailable
              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
              : "bg-rose-100 text-rose-800 border-rose-200"
          }`}
        >
          {room.isAvailable ? "Available" : "Booked"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Room Type */}
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-wide uppercase">
          <BedDouble className="w-5 h-5 text-gold-600" />
          {room.roomType?.name ?? "Unknown Room Type"}
        </h3>

        {/* Capacity & Price */}
        <div className="flex items-center justify-between text-slate-600">
          <p className="flex items-center gap-1 text-sm">
            <Users className="w-4 h-4 text-gold-500" /> {room.capacity} Guests
          </p>
          <p className="flex items-center gap-1 text-sm font-semibold">
            <DollarSign className="w-4 h-4 text-gold-500" /> ${room.pricePerNight}
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="w-full py-2 text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white hover:from-[#1e293b] hover:to-[#0f172a] rounded-lg shadow-inner transition duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
