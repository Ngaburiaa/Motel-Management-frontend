import { useParams, useNavigate } from "react-router-dom";
import { useGetBookingByIdQuery } from "../../features/api/bookingsApi";
import { useGetPaymentByIdQuery } from "../../features/api/paymentsApi";
import { ArrowLeft, Download } from "lucide-react";

export const PaymentReceiptPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const { data: payment } = useGetPaymentByIdQuery(Number(paymentId));
  const bookingId = payment?.bookingId;

  const { data: booking } = useGetBookingByIdQuery(bookingId ?? -1);

  if (!payment || !booking) {
    return <div className="text-center p-10">Loading receipt...</div>;
  }

  const { room, user } = booking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 sm:px-8 py-8 text-base-content font-sans">
      {/* Back Button */}
      <div className="mb-">
        <button
  onClick={() => navigate(-1)}
  className="btn btn-sm btn-outline gap-1"
>
  <ArrowLeft className="w-4 h-4 text-blue-500" />
  Back
</button>

      </div>

      {/* Receipt */}
      <div
        className="max-w-md mx-auto bg-white shadow-2xl"
        style={{ fontFamily: "Monaco, Courier, monospace" }}
      >
        {/* Receipt Header */}
        <div className="text-center py-6 px-6 border-b-2 border-dashed border-gray-300">
          <div className="text-2xl font-bold mb-2 text-blue-900">
            🏨 HOTEL RECEIPT
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Official Payment Receipt
          </div>
        </div>

        {/* Receipt Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Transaction Details */}
          <div className="space-y-2">
            <div className="text-center text-xs text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1">
              Transaction Details
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Transaction ID:</span>
              <span className="font-mono text-gray-950">{payment.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Payment Date:</span>
              <span className="text-gray-950">{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Method:</span>
              <span className="uppercase text-gray-950">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Status:</span>
              <span
                className={`uppercase font-semibold ${
                  payment.paymentStatus === "Completed"
                    ? "text-amber-600"
                    : "text-yellow-600"
                }`}
              >
                {payment.paymentStatus}
              </span>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-2">
            <div className="text-center text-xs text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1">
              Guest Information
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-700">
                Name: {user.firstName} {user.lastName}
              </div>
              <div className="text-slate-600">Email: {user.email}</div>
              <div className="text-slate-600">Phone Number: {user.contactPhone}</div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-2">
            <div className="text-center text-xs text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1">
              Booking Details
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Booking ID:</span>
              <span className="font-mono text-gray-950">#{booking.bookingId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Status:</span>
              <span
                className={`uppercase font-semibold ${
                  booking.bookingStatus === "Confirmed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {booking.bookingStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Check-In:</span>
              <span className="text-gray-950">{booking.checkInDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Check-Out:</span>
              <span className="text-gray-950">{booking.checkOutDate}</span>
            </div>
          </div>

          {/* Room Information */}
          <div className="space-y-2">
            <div className="text-center text-xs text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1">
              Room Information
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Room Type:</span>
              <span className="capitalize text-gray-950">{room.roomType.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Capacity:</span>
              <span className="text-gray-950">{room.capacity} guests</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Rate/Night:</span>
              <span className="text-gray-950">${room.pricePerNight}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">Hotel ID:</span>
              <span className="font-mono text-gray-950">#{room.hotelId}</span>
            </div>
            {room.thumbnail && (
              <div className="mt-3">
                <img
                  src={room.thumbnail}
                  alt="Room"
                  className="w-full h-24 object-cover rounded border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">Booking Total:</span>
                <span className="text-gray-950">${booking.totalAmount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span className="text-gray-800">Amount Paid:</span>
                <span className="text-gray-950">${payment.amount}</span>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-center space-y-2 border-t-2 border-dashed border-gray-300 pt-4">
            <div className="text-xs text-gray-500">
              Receipt generated on {new Date().toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-500">
              at {new Date().toLocaleTimeString()}
            </div>
            <div className="text-xs text-gray-400 mt-3">
              ★ Thank you for choosing our hotel! ★
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="px-6 pb-6">
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Receipt Bottom Edge */}
        <div className="h-6 bg-white relative">
          <div className="absolute inset-0 flex justify-center">
            <div className="w-full border-b-2 border-dashed border-gray-300"></div>
          </div>
          <div className="absolute inset-0 flex justify-around items-center">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-slate-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
