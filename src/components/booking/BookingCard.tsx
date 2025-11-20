import {
  CalendarDays,
  Pencil,
  Trash2,
  DollarSign,
  BedDouble,
  Clock,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import type { TRoom } from "../../types/roomsTypes";

type Booking = {
  bookingId?: number;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  room: TRoom;
  onCancel?: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  userType: string;
};

export const BookingCard = ({
  bookingStatus,
  checkInDate,
  checkOutDate,
  totalAmount,
  room,
  onCancel,
  onDelete,
  onClick,
  // onEdit,
  userType,
}: Booking) => {
  const nights = differenceInCalendarDays(
    new Date(checkOutDate),
    new Date(checkInDate)
  );

  const formattedCheckIn = format(new Date(checkInDate), "dd MMM yyyy");
  const formattedCheckOut = format(new Date(checkOutDate), "dd MMM yyyy");

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((userType === "admin" || userType === "owner") && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      className={`group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full font-sans ${
        userType === "admin" || userType === "owner"
          ? "cursor-pointer hover:border-blue-300"
          : "cursor-default"
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative flex-shrink-0 sm:w-64 md:w-72">
          <img
            src={room?.thumbnail ?? ""}
            alt={room?.roomType?.name?.toString() ?? "StayCloud"}
            className="w-full h-48 sm:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-white/20">
            ${room?.pricePerNight} / night
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between min-h-[200px]">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {room?.roomType?.name?.toString() ?? "StayCloud"}
              </h2>
              <span
                className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${
                  bookingStatus === "Pending"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : bookingStatus === "Confirmed"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : bookingStatus === "Cancelled"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {bookingStatus}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg">
                  <BedDouble size={16} className="text-slate-600" />
                </div>
                <span className="font-medium">Capacity: {room.capacity}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg">
                  <Clock size={16} className="text-slate-600" />
                </div>
                <span className="font-medium">
                  {nights} night{nights > 1 && "s"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-600 md:col-span-2">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg">
                  <CalendarDays size={16} className="text-slate-600" />
                </div>
                <span className="font-medium">
                  {formattedCheckIn} → {formattedCheckOut}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <DollarSign size={16} className="text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-700">
                ${totalAmount}
              </span>
              <span className="text-sm text-slate-500 font-medium">total</span>
            </div>

            {(userType === "user" || userType === "admin") && (
              <div className="flex items-center gap-2">
                {bookingStatus !== "Cancelled" && (
                  <button
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-200 hover:shadow-sm"
                  >
                    <Pencil size={14} />
                    Cancel
                  </button>
                )}

                <button
                  onClick={onDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-200 hover:shadow-sm"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
