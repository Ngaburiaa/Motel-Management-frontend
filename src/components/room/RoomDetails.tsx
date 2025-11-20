import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Home, DollarSign, Users, Text } from "lucide-react";
import { type FormData } from "./types";

export type RoomDetailsProps = {
  roomTypes: {
    roomTypeId: number;
    name: string;
  }[];
};

export const RoomDetails = ({ roomTypes }: RoomDetailsProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  // Ensure all register calls are stable by memoizing them if needed
  const roomTypeRegistration = register("roomTypeId", {
    valueAsNumber: true,
  });
  const priceRegistration = register("pricePerNight");
  const capacityRegistration = register("capacity");
  const descriptionRegistration = register("description");
  const availabilityRegistration = register("isAvailable");

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Room Information</h2>
        <p className="text-gray-600 text-lg">Tell us about your room's basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Type */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Home className="w-4 h-4" />
            Room Type
          </label>
          <select
            {...roomTypeRegistration}
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          >
            <option value="">Select a room type</option>
            {roomTypes.map((type) => (
              <option key={type.roomTypeId} value={type.roomTypeId}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.roomTypeId && (
            <motion.p
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.roomTypeId.message}
            </motion.p>
          )}
        </motion.div>

        {/* Price */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            Price per Night ($)
          </label>
          <input
            type="number"
            {...priceRegistration}
            placeholder="100"
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          />
          {errors.pricePerNight && (
            <motion.p
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.pricePerNight.message}
            </motion.p>
          )}
        </motion.div>

        {/* Capacity */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4" />
            Maximum Capacity
          </label>
          <input
            type="number"
            {...capacityRegistration}
            placeholder="2"
            min="1"
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          />
          {errors.capacity && (
            <motion.p
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.capacity.message}
            </motion.p>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          className="space-y-2 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Text className="w-4 h-4" />
            Description
          </label>
          <textarea
            {...descriptionRegistration}
            placeholder="Describe the room features and amenities..."
            rows={4}
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          />
          {errors.description && (
            <motion.p
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.description.message}
            </motion.p>
          )}
        </motion.div>

        {/* Availability */}
        <motion.div
          className="space-y-2 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Availability Status
          </label>
          <motion.label
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200 border border-gray-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="checkbox"
              {...availabilityRegistration}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="font-medium text-gray-700">
              Room is available for booking
            </span>
          </motion.label>
        </motion.div>
      </div>
    </div>
  );
};