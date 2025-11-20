import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { SearchBar } from "../../components/common/SearchBar";
import { BookingCard } from "../../components/booking/BookingCard";
import { BookingCardSkeleton } from "../../components/booking/BookingCardSkeleton";
import { BookingEditModal } from "../../components/booking/BookingEditModal";
import { BookingTabs } from "../../components/booking/BookingTabs";

import {
  useDeleteBookingMutation,
  useGetBookingsByUserIdQuery,
  useUpdateBookingMutation,
} from "../../features/api";

import type { RootState } from "../../app/store";
import type { TBooking, TBookingStatus } from "../../types/bookingsTypes";

type TabValue = "All" | TBookingStatus;

export const Bookings = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<TabValue>("All");
  const [allBookings, setAllBookings] = useState<TBooking[]>([]);

  const limit = 10;

  const { userId, userType } = useSelector((state: RootState) => state.auth);

  const id = Number(userId);

  const { data, isLoading, isFetching, isError } =
    useGetBookingsByUserIdQuery(
      {
        userId: id,
        page,
        limit,
        status: tab !== "All" ? tab : undefined,
      },
      { skip: !id }
    );

  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const fetchedBookings = useMemo(() => data?.data ?? [], [data]);
  const totalPages = data?.pagination?.totalPages ?? 1;

  useEffect(() => {
    if (fetchedBookings.length > 0) {
      setAllBookings((prev) => {
        if (tab !== "All" || page === 1) return [...fetchedBookings];
        const existingIds = new Set(prev.map((b) => b.bookingId));
        const newOnes = fetchedBookings.filter(
          (b) => !existingIds.has(b.bookingId)
        );
        return [...prev, ...newOnes];
      });
    }
  }, [fetchedBookings, tab, page]);

  const tabFiltered = useMemo(() => {
    if (tab === "All") return allBookings;
    return allBookings.filter((b) => b.bookingStatus === tab);
  }, [allBookings, tab]);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tabFiltered;
    return tabFiltered.filter((b) => {
      return (
        b.room?.roomType?.name.toLowerCase().includes(query) ||
        b.checkInDate?.toLowerCase().includes(query) ||
        b.checkOutDate?.toLowerCase().includes(query)
      );
    });
  }, [tabFiltered, searchQuery]);

  const handleDelete = (bookingId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(bookingId)
          .unwrap()
          .then(() => {
            toast.success("Booking deleted successfully.");
          })
          .catch(() =>
            toast.error("Failed to delete booking. Please try again.")
          );
      }
    });
  };

  const handleCancel = (bookingId: number) => {
    Swal.fire({
      title: "Cancel Booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateBooking({
          bookingId: bookingId,
          data: { bookingStatus: "Cancelled" },
        })
          .unwrap()
          .then(() => {
            toast.success("Booking cancelled successfully.");
          })
          .catch(() =>
            toast.error("Failed to cancel booking. Please try again.")
          );
      }
    });
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTabChange = (newTab: TabValue) => {
    setTab(newTab);
    setAllBookings([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Your Bookings
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage all your hotel reservations.
            </p>
          </div>
          <div className="w-full max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by room type or date..."
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-4">
        <BookingTabs current={tab} setCurrent={handleTabChange} />
      </div>

      <section className="max-w-6xl mx-auto px-4 mt-4">
        {isLoading && page === 1 ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 py-10">
            No bookings found.
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
            <motion.div
              layout
              className="flex flex-col gap-6"
            >
              {filteredBookings.map((booking) => (
                <motion.div
                  layout
                  key={booking.bookingId}
                  className=" flex-shrink-0"
                >
                  <BookingCard
                    bookingId={booking.bookingId}
                    bookingStatus={booking.bookingStatus}
                    checkInDate={booking.checkInDate}
                    checkOutDate={booking.checkOutDate}
                    totalAmount={booking.totalAmount}
                    room={booking.room}
                    onCancel={() => handleCancel(booking.bookingId)}
                    onDelete={() => handleDelete(booking.bookingId)}
                    userType={userType || ""}
                  />
                </motion.div>
              ))}
            </motion.div>

            {page < totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition disabled:opacity-50"
                >
                  {isFetching ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-slate-500 py-20">
            <p className="text-lg">No bookings found for this category.</p>
          </div>
        )}
      </section>

      <BookingEditModal show={showEdit} onClose={() => setShowEdit(false)} />
    </div>
  );
};
