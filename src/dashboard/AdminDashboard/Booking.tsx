import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BookingCard } from "../../components/booking/BookingCard";
import { BookingCardSkeleton } from "../../components/booking/BookingCardSkeleton";
import { BookingEditModal } from "../../components/booking/BookingEditModal";
import { BookingFilterSidebar } from "../../components/booking/BookingFilterSidebar";
import {
  useDeleteBookingMutation,
  useGetBookingsQuery,
} from "../../features/api";
import type { RootState } from "../../app/store";
import type { TSingleBooking } from "../../types/bookingsTypes";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Filter } from "lucide-react";

export const Booking = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRoomType, setSelectedRoomType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { userType } = useSelector((state: RootState) => state.auth);

  const {
    data: bookingsData,
    isLoading,
    isError,
  } = useGetBookingsQuery(
    { page: 1, limit: 10 },
    { skip: userType !== "admin" }
  );

  console.log(bookingsData);

  const allBookings = bookingsData?.data;
  const [deleteBooking] = useDeleteBookingMutation();

  const bookings: TSingleBooking[] = useMemo(() => {
    return Array.isArray(allBookings) ? allBookings : [];
  }, [allBookings]);

  const roomTypes = useMemo(() => {
    const types = new Set<string>();
    bookings.forEach((b) => {
      if (b?.room?.roomType) types.add(b.room.roomType.name);
    });
    return Array.from(types);
  }, [bookings]);

  // Update the filteredBookings function in Booking.tsx
  const filteredBookings = bookings.filter((booking) => {
    const matchStatus =
      filterStatus === "All" || booking.bookingStatus === filterStatus;
    const matchRoom =
      selectedRoomType === "All" ||
      booking.room?.roomType?.name === selectedRoomType;
    const matchSearch =
      searchQuery.trim() === "" ||
      booking.room?.roomType?.name
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      booking.bookingStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.checkInDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.checkOutDate.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchRoom && matchSearch;
  });

  const handleDelete = (bookingId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4ED8",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "swal2-confirm btn btn-error",
        cancelButton: "swal2-cancel btn btn-outline",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(bookingId)
          .unwrap()
          .then(() => {
            return navigate(-1);
          })
          .then(() => {
            toast.success("Booking deleted successfully.");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to delete booking", "error");
          });
      }
    });
  };

  return (
    <div className="relative">
      {/* 🟡 Drawer Toggle */}
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer">
        {/* Main Page Content */}
        <div className="drawer-content min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 sm:p-6 pb-24">
          {/* Header with Search */}
          <div className="max-w-6xl mx-auto px-4 pb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#000000] mb-1">
                  Your Bookings
                </h1>
                <p className="text-[#14213d] text-sm">
                  View, edit or manage hotel bookings
                </p>
              </div>
              <div className="w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search by room type, status, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-[#d1d5db] bg-white text-[#03071e] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#fca311] transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Booking Cards */}
          <div className="max-w-6xl mx-auto px-4">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BookingCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <p className="text-red-500">Error fetching bookings.</p>
            ) : filteredBookings.length > 0 ? (
              <div className="flex flex-col gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.bookingId}
                    bookingId={booking.bookingId}
                    bookingStatus={booking.bookingStatus}
                    checkInDate={booking.checkInDate}
                    checkOutDate={booking.checkOutDate}
                    totalAmount={booking.totalAmount}
                    room={booking.room}
                    onEdit={() => setShowEdit(true)}
                    onDelete={() => handleDelete(booking.bookingId!)}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!(e.target instanceof HTMLButtonElement)) {
                        navigate(`/admin/booking-details/${booking.bookingId}`);
                      }
                    }}
                    userType={userType || ""}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No bookings found.
              </p>
            )}
          </div>

          {/* 🟢 Floating Filter Button */}
          <label
            htmlFor="filter-drawer"
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg cursor-pointer transition"
          >
            <Filter className="w-5 h-5" />
          </label>

          {/* 🔵 Booking Edit Modal */}
          <BookingEditModal
            show={showEdit}
            onClose={() => setShowEdit(false)}
          />
        </div>

        {/* Drawer Sidebar Content */}
        <div className="drawer-side z-50">
          <label htmlFor="filter-drawer" className="drawer-overlay"></label>
          <div className="w-80 bg-white h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filter Bookings</h2>
              <label
                htmlFor="filter-drawer"
                className="btn btn-sm btn-circle btn-outline"
              >
                ✕
              </label>
            </div>
            <BookingFilterSidebar
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              availableRoomTypes={roomTypes}
              onClear={() => {
                setFilterStatus("All");
                setSelectedRoomType("All");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
