import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import type { RootState } from "../../app/store";
import { useGetBookingsByUserIdQuery } from "../../features/api/bookingsApi";
import { useGetRoomsQuery } from "../../features/api/roomsApi";
import type { TBooking } from "../../types/bookingsTypes";
import type { TRoom } from "../../types/roomsTypes";
import { Button } from "../ui/Button";

import { parseRTKError } from "../../utils/parseRTKError";
import { LoadingSpinner } from "../ui/loadingSpinner";
import { NoData } from "../common/NoData";
import { Error } from "../common/Error";

export const BookingCard = () => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: bookingData,
    isLoading: bookingLoading,
    isError: bookingIsError,
    error: bookingError,
    refetch: refetchBookings,
  } = useGetBookingsByUserIdQuery(
    { userId: id, limit: 100, status: ["Pending", "Confirmed"] },
    { skip: !id }
  );

  const {
    data: rooms,
    isLoading: roomsLoading,
    isError: roomsIsError,
    error: roomsError,
    refetch: refetchRooms,
  } = useGetRoomsQuery(undefined, { skip: !id });

  // Refetch on mount
  useEffect(() => {
    if (id) {
      void refetchBookings();
      void refetchRooms();
    }
  }, [id, refetchBookings, refetchRooms]);

  const upcomingBooking: TBooking | null = useMemo(() => {
    if (!bookingData?.data?.length) return null;
    const upcoming = bookingData.data
      .filter((b) => new Date(b.checkInDate) > new Date())
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
    return upcoming[0] || null;
  }, [bookingData]);

  const randomRoom: TRoom | null = useMemo(() => {
    if (!rooms?.length) return null;
    const availableRooms = rooms.filter((room) => room.isAvailable);
    const randomIndex = Math.floor(Math.random() * availableRooms.length);
    return availableRooms[randomIndex] || null;
  }, [rooms]);

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Booking cancelled successfully.");
        // TODO: Trigger cancel mutation
      }
    });
  };

  if (bookingLoading || roomsLoading) return <LoadingSpinner />;

  if (bookingIsError || roomsIsError) {
    const message =
      parseRTKError(bookingError) || parseRTKError(roomsError) || "Failed to load data.";
    return <Error message={message} showRetry onRetry={() => {
      refetchBookings();
      refetchRooms();
    }} />;
  }

  if (!upcomingBooking && !randomRoom) {
    return <NoData title="Nothing to show" subtitle="No bookings or rooms available at the moment." />;
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 via-blue-100 to-blue-200 border border-blue-300/30 shadow-lg rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Image */}
        <div className="w-full sm:w-[260px] h-[180px] overflow-hidden rounded-xl shadow-md">
          <img
            src={
              upcomingBooking
                ? "https://source.unsplash.com/featured/?resort,hotel"
                : randomRoom?.thumbnail
            }
            alt="Room Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 text-blue-900">
          {/* Title + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-xl font-semibold">
              {upcomingBooking ? "Your Upcoming Stay" : "Discover a Top Luxury Room"}
            </h3>

            {upcomingBooking && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-500 hover:bg-blue-100">
                  <Pencil className="w-4 h-4 mr-1" />
                  Modify
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleCancel}
                  className="bg-blue-700 text-white hover:bg-blue-800"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Info Row */}
          {upcomingBooking ? (
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{new Date(upcomingBooking.checkInDate).toDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{upcomingBooking?.room?.roomType?.name?.toString() ?? "StayCloud"}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span className="font-medium">{randomRoom?.roomType?.name?.toString() ?? "StayCloud"}</span>
                <span className="font-semibold text-blue-900">
                  ${Number(randomRoom?.pricePerNight).toFixed(2)} / night
                </span>
              </div>
              <p className="text-xs text-blue-700 italic">
                Rooms are limited – don’t miss out.
              </p>
            </div>
          )}
        </div>
      </div>s
    </div>
  );
};
