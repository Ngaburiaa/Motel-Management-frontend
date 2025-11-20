import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, Users, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import toast from "react-hot-toast"; // Or your preferred toast library
import { useNavigate } from "react-router";

const stepAnimations = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

export const Hero = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [step, setStep] = useState(1);
  const [dateError, setDateError] = useState(false);
  const [guests, setGuests] = useState({ total: 1 });
  const navigate = useNavigate();
  const image =
    "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg";

  useEffect(() => {
    if (fromDate && toDate) setDateError(false);
  }, [fromDate, toDate]);

  const validateStepOne = () => {
    if (!fromDate || !toDate) {
      setDateError(true);
      return false;
    }
    if (toDate <= fromDate) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStepOne()) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFindRooms = () => {
  if (!fromDate || !toDate) {
    toast.error("Both check-in and check-out dates are required.");
    return;
  }

  const checkInDate = fromDate.toISOString().split("T")[0]; // format as YYYY-MM-DD
  const checkOutDate = toDate.toISOString().split("T")[0];
  const guestsCount = guests.total;

  const query = new URLSearchParams({
    checkInDate,
    checkOutDate,
    ...(guestsCount ? { capacity: guestsCount.toString() } : {}),
  });

  navigate(`/availability?${query.toString()}`);
};

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16 bg-black/70 overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={image}
        alt="Luxury Hotel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-3xl text-center text-white space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold drop-shadow-xl"
        >
          Find Your Perfect Stay
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200"
        >
          Seamless booking, luxurious comfort, and unforgettable memories await.
        </motion.p>

        <motion.div
          className="text-sm tracking-wide text-gold-400 uppercase font-medium"
          initial="initial"
          animate="animate"
          variants={stepAnimations}
        >
          Step {step} of 3
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              className="flex flex-col md:flex-row items-center gap-4 justify-center"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepAnimations}
            >
              {/* Check-in */}
              <div className="relative">
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  selectsStart
                  startDate={fromDate}
                  endDate={toDate}
                  placeholderText="Check-in"
                  className="w-48 px-4 py-2 rounded-lg bg-white/90 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                  minDate={new Date()}
                />
                <CalendarIcon
                  className="absolute right-3 top-2.5 text-gray-500"
                  size={18}
                />
              </div>

              {/* Check-out */}
              <div className="relative">
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  selectsEnd
                  startDate={fromDate}
                  endDate={toDate}
                  placeholderText="Check-out"
                  className="w-48 px-4 py-2 rounded-lg bg-white/90 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                  minDate={fromDate ?? new Date()}
                />
                <CalendarIcon
                  className="absolute right-3 top-2.5 text-gray-500"
                  size={18}
                />
              </div>

              <Button
                onClick={handleNext}
                className="bg-gold-500 text-white hover:bg-gold-600"
              >
                Next
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              className="flex flex-col items-center gap-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepAnimations}
            >
              <div className="bg-white/90 text-gray-800 rounded-xl p-6 shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users size={20} /> Number of Guests
                </h3>

                <div className="flex justify-between items-center">
                  <span>Total People</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() =>
                        setGuests((g) => ({
                          ...g,
                          total: Math.max(1, g.total - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <span>{guests.total}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() =>
                        setGuests((g) => ({ ...g, total: g.total + 1 }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="text-white border-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gold-500 text-white hover:bg-gold-600"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="flex flex-col items-center gap-6"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepAnimations}
            >
              <CheckCircle size={40} className="text-gold-400" />
              <h3 className="text-xl font-semibold text-white">
                Confirm Your Booking
              </h3>
              <div className="bg-white/90 text-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full text-left space-y-2">
                <div>
                  <strong>Check-in:</strong>{" "}
                  {fromDate?.toLocaleDateString() ?? "Not selected"}
                </div>
                <div>
                  <strong>Check-out:</strong>{" "}
                  {toDate?.toLocaleDateString() ?? "Not selected"}
                </div>
                <div>
                  <strong>Guests:</strong>
                  {guests.total} Guest(s)
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="text-white border-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFindRooms}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Find Rooms
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {dateError && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-400 mt-3 text-sm"
            >
              Please select both check-in and check-out dates.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
