import { CheckCircle, ArrowRight, CreditCard, CalendarCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const handleViewPayment = () => {
    navigate("/user/payment");
  };

  const handleViewBooking = () => {
    navigate("/user/booking-details");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          className="flex justify-center"
        >
          <CheckCircle className="text-green-500 w-20 h-20 animate-pulse drop-shadow-lg" strokeWidth={1.8} />
        </motion.div>

        <motion.h1
          className="text-3xl font-extrabold text-gray-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          className="text-gray-600 text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Thank you for your payment. Your booking has been confirmed and a receipt has been sent to your email.
        </motion.p>

        <motion.div
          className="grid gap-4 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleViewPayment}
            className="btn btn-success btn-outline flex items-center justify-center gap-2 transition-all duration-300"
          >
            <CreditCard className="w-5 h-5" />
            View Payment
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleViewBooking}
            className="btn btn-primary btn-outline flex items-center justify-center gap-2 transition-all duration-300"
          >
            <CalendarCheck2 className="w-5 h-5" />
            View Booking Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};
