import {
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import type { TRoomType } from "../../types/roomsTypes";

type Room = {
  roomId: number;
  roomType: TRoomType;
  pricePerNight: number;
  capacity: number;
  isAvailable: boolean;
  thumbnail: string;
};

export const DashboardRoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const navigate = useNavigate();

  const roomTypeName = room.roomType?.name || "StayCloud Room";
  const thumbnail = room.thumbnail || "";
  const price = parseFloat(room.pricePerNight?.toString() || "0").toFixed(2);
  const capacity = room.capacity || 1;

  return (
    <div
      onClick={() => navigate(`/admin/room/${roomTypeName}/${room.roomId}`)}
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in"
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={roomTypeName}
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-room-image.jpg";
          }}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
              room.isAvailable
                ? "bg-emerald-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {room.isAvailable ? (
              <CheckCircle size={12} />
            ) : (
              <XCircle size={12} />
            )}
            <span>{room.isAvailable ? "Available" : "Unavailable"}</span>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Room Name */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {roomTypeName}
          </h3>
        </div>

        {/* Details Grid */}
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <DollarSign size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium">Price per night</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${price}
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1.5 bg-indigo-50 rounded-lg">
                <Users size={16} className="text-indigo-600" />
              </div>
              <span className="text-sm font-medium">Guest capacity</span>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {capacity} {capacity === 1 ? "guest" : "guests"}
            </div>
          </div>
        </div>

        {/* Action Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
            <span className="font-medium">Click to manage room</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/0 group-hover:ring-blue-500/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
};