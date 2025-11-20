import { Link, useParams } from "react-router";
import {
  useCreateBookingMutation,
  useGetRoomByIdQuery,
} from "../../features/api";
import { Loader2, Users, Calendar, MapPin, Wifi, Car, Coffee, Star } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { TRoom } from "../../types/roomsTypes";
import Swal from "sweetalert2";
import { useStripePayment } from "../../hook/useStripePayment";
import type { TBookingForm } from "../../types/bookingsTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { parseRTKError } from "../../utils/parseRTKError";

export const Checkout = () => {
  const { id } = useParams();
  const roomId = Number(id);
  const { initiatePayment, isLoading: isPaymentLoading } = useStripePayment();
  const [createBooking] = useCreateBookingMutation();
  const { userId } = useSelector((state: RootState) => state.auth);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: room,
    isLoading,
    isError,
  } = useGetRoomByIdQuery(roomId) as {
    data: TRoom | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const nights = useMemo(() => {
    if (checkInDate && checkOutDate) {
      const diff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [checkInDate, checkOutDate]);

  const totalPrice = useMemo(() => {
    return nights * (room?.pricePerNight ?? 0);
  }, [nights, room]);

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    if (!room) {
      toast.error("Room data unavailable. Please refresh.");
      return;
    }

    const bookingPayload: TBookingForm = {
      roomId,
      userId: Number(userId),
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      totalAmount: totalPrice.toFixed(2),
      bookingStatus: "Pending",
      gallery: [],
    };

    const toastId = toast.loading("Booking your stay...");

    try {
      const bookingResponse = await createBooking(bookingPayload).unwrap();
      console.log("Booking Response:", bookingResponse);
      const bookingId = Number(bookingResponse?.bookingId);

      if (!bookingId || isNaN(bookingId)) {
        throw new Error("Invalid booking ID received");
      }

      toast.loading("Redirecting to payment...", { id: toastId });

      const { url, error } = await initiatePayment(bookingId, totalPrice);

      if (error) {
        throw new Error(error);
      }

      if (!url) {
        throw new Error("Payment URL not received");
      }

      window.location.href = url;
    } catch (err) {
      toast.dismiss(toastId);

      // Improved error logging
      console.error("Booking Error:", err);
      console.error("Booking Error (JSON):", JSON.stringify(err, null, 2));

      const errorMsg = parseRTKError(err, "Failed to create booking.");

      if (
        errorMsg.toLowerCase().includes("already booked") ||
        errorMsg.toLowerCase().includes("date conflict") ||
        errorMsg.toLowerCase().includes("unavailable")
      ) {
        Swal.fire({
          icon: "warning",
          title: "Room Already Booked",
          text: "The room is already booked for the selected dates. Please try different dates.",
        });
      } else {
        toast.error(errorMsg);
      }
    }
  };

  // ✅ Return early if room ID is invalid
  if (!id || isNaN(roomId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Room Selected
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please choose a room before proceeding to checkout.
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Browse Rooms
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 mx-auto">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading room details...</p>
        </motion.div>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-red-600 text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Load Room
          </h2>
          <p className="text-gray-600">
            Failed to load room details. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  const allImages = [room.thumbnail, ...room.gallery];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">Secure your perfect stay with us</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left: Room Details - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={room.roomType.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-1 text-white">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="p-6">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img: string, idx: number) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`gallery-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {room.roomType.name}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Premium Location</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    ${room.pricePerNight}
                  </div>
                  <div className="text-gray-500 text-sm">per night</div>
                </div>
              </div>

              {/* Room Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">{room.capacity}</div>
                    <div className="text-xs text-gray-600">Guests</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Free</div>
                    <div className="text-xs text-gray-600">WiFi</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                  <Car className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Free</div>
                    <div className="text-xs text-gray-600">Parking</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-semibold text-gray-800">24/7</div>
                    <div className="text-xs text-gray-600">Service</div>
                  </div>
                </div>
              </div>

              {/* Room Description */}
              <div className="p-6 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-800 mb-2">Room Features</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience luxury and comfort in our carefully designed {room.roomType.name}. 
                  Perfect for up to {room.capacity} guests with modern amenities and stunning views.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Booking Form - 1/3 width */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 sticky top-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Book Your Stay
              </h3>

              {/* Date Selection */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Check-In Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      selectsStart
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={new Date()}
                      placeholderText="Select check-in"
                      className="w-full px-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Calendar className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Check-Out Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={checkInDate || new Date()}
                      placeholderText="Select check-out"
                      className="w-full px-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Calendar className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <h4 className="font-semibold text-gray-800 mb-4">Booking Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Number of Nights:</span>
                    <span className="font-semibold text-gray-800">{nights}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rate per Night:</span>
                    <span className="font-semibold text-gray-800">${room.pricePerNight}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="font-bold text-2xl text-green-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={isPaymentLoading || !checkInDate || !checkOutDate}
                className={`w-full mt-6 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  isPaymentLoading || !checkInDate || !checkOutDate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/25"
                }`}
              >
                {isPaymentLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Processing Payment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔒 Secure Payment
                  </span>
                )}
              </motion.button>

              {/* Security Badge */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  🛡️ SSL Secured • Your payment is protected
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};