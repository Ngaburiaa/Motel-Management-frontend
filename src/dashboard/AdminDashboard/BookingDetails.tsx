import { useParams, useNavigate } from "react-router";
import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "../../features/api";
import { AlertCircle, ArrowLeft, Calendar, User, Home, Receipt, X, Download } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { parseRTKError } from "../../utils/parseRTKError";

export const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const navigate = useNavigate();

  const {
    data: booking,
    isLoading,
    isError,
  } = useGetBookingByIdQuery(bookingId);
  const [updateBooking] = useUpdateBookingMutation();

  // Generate PDF Receipt
  const generatePDF = () => {
    if (!booking) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Booking Receipt - #${booking.bookingId}`, 20, 20);

    doc.setFontSize(12);
    doc.text(
      `Guest: ${booking.user.firstName} ${booking.user.lastName}`,
      20,
      40
    );
    doc.text(`Email: ${booking.user.email}`, 20, 48);
    doc.text(`Phone: ${booking.user.contactPhone}`, 20, 56);

    doc.text(`Room Type: ${booking.room.roomType}`, 20, 72);
    doc.text(`Capacity: ${booking.room.capacity} guests`, 20, 80);
    doc.text(`Price/Night: $${booking.room.pricePerNight}`, 20, 88);

    doc.text(
      `Check-in: ${new Date(booking.checkInDate).toDateString()}`,
      20,
      104
    );
    doc.text(
      `Check-out: ${new Date(booking.checkOutDate).toDateString()}`,
      20,
      112
    );
    doc.text(`Total Amount: $${booking.totalAmount}`, 20, 120);

    doc.text(`Booking Status: ${booking.bookingStatus}`, 20, 136);
    doc.text(
      `Date Booked: ${new Date(booking.createdAt).toDateString()}`,
      20,
      144
    );

    doc.save(`booking_${booking.bookingId}_receipt.pdf`);
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will cancel your booking!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        await updateBooking({
          bookingId: bookingId,
          data: { bookingStatus: "Cancelled" },
        }).unwrap();
        toast.success("Booking cancelled successfully");
        navigate(-1);
      } catch (err) {
        const errorMessage = parseRTKError(
          err,
          "Failed to cancel booking."
        );
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#14213D] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading booking details...</p>
        </motion.div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <motion.div 
          className="flex flex-col items-center text-center max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Booking Not Found
          </h3>
          <p className="text-slate-600 mb-6">
            We couldn't find the requested booking details. Please check the booking ID and try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#14213D] text-white rounded-lg hover:bg-[#1f2a44] transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const {
    // bookingId: idNum,
    checkInDate,
    checkOutDate,
    bookingStatus,
    totalAmount,
    user,
    room,
    createdAt,
  } = booking;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Navigation */}
      <div className=" border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-[#14213D] font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Bookings
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#14213D] to-[#1f2a44] text-white p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
                {/* <p className="text-slate-300 text-lg">Confirmation #{idNum}</p> */}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(bookingStatus)}`}>
                  {bookingStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Room Image */}
          {room?.thumbnail && (
            <div className="relative overflow-hidden">
              <img
                src={room.thumbnail}
                alt={room.roomType.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#14213D] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Guest Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium">Full Name</p>
                  <p className="text-slate-800 font-semibold">{user.firstName} {user.lastName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium">Email Address</p>
                  <p className="text-slate-800">{user.email}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm text-slate-500 font-medium">Phone Number</p>
                  <p className="text-slate-800">{user.contactPhone}</p>
                </div>
              </div>
            </motion.div>

            {/* Room Information */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FCA311] rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Room Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium">Room Type</p>
                  <p className="text-slate-800 font-semibold">{room?.roomType?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium">Capacity</p>
                  <p className="text-slate-800">{room.capacity} guests</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm text-slate-500 font-medium">Price per Night</p>
                  <p className="text-slate-800 font-semibold text-lg">${room.pricePerNight}</p>
                </div>
              </div>
            </motion.div>

            {/* Stay Details */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Stay Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium">Check-in Date</p>
                  <p className="text-slate-800 font-semibold">{new Date(checkInDate).toDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium">Check-out Date</p>
                  <p className="text-slate-800 font-semibold">{new Date(checkOutDate).toDateString()}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm text-slate-500 font-medium">Booking Date</p>
                  <p className="text-slate-800">{new Date(createdAt).toDateString()}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Booking Summary</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Room Rate</span>
                  <span className="font-semibold">${room.pricePerNight}/night</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-semibold">
                    {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24))} nights
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-slate-50 px-4 rounded-lg">
                  <span className="text-lg font-semibold text-slate-800">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">${totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generatePDF}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#14213D] text-white rounded-lg hover:bg-[#1f2a44] transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </motion.button>

                {bookingStatus.toLowerCase() !== 'cancelled' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelBooking}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel Booking
                  </motion.button>
                )}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Cancellation policies may apply. Please review your booking terms for details.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};