import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Home,
  Star,
  Camera,
  ImageIcon,
  Check,
  Edit,
} from "lucide-react";
import { type FormData } from "./types";

interface ReviewSubmitProps {
  roomTypes: { roomTypeId: number; name: string }[];
  amenities: { amenityId: number; name: string }[];
  onEditStep: (step: number) => void;
}

export const ReviewSubmit = ({ roomTypes, amenities, onEditStep }: ReviewSubmitProps) => {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  const getRoomTypeName = (id: number) =>
    roomTypes.find((type) => type.roomTypeId === id)?.name || id.toString();

  const getAmenityName = (name: string) =>
    amenities.find((a) => a.name === name)?.name || name;

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-playfair text-[20px] font-semibold text-slate-900">
          Review Your Room
        </h2>
        <p className="text-[14px] text-slate-600 font-inter">
          Double-check everything looks perfect before submitting
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Details */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5 relative"
        >
          <button
            onClick={() => onEditStep(0)}
            className="absolute top-4 right-4 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
          >
            <Edit className="w-3 h-3" /> Edit
          </button>
          
          <div className="flex items-center gap-2 text-[16px] text-slate-800 font-semibold font-playfair">
            <Home className="w-5 h-5 text-indigo-600" />
            Room Details
          </div>

          {[
            {
              label: "Room Type",
              value: getRoomTypeName(values.roomTypeId),
            },
            {
              label: "Price Per Night",
              value: `$${values.pricePerNight}`,
              className: "text-green-700 font-bold",
            },
            {
              label: "Capacity",
              value: `${values.capacity} guests`,
            },
            {
              label: "Description",
              value: values.description || "No description provided",
            },
            {
              label: "Available",
              value: values.isAvailable ? "✓ Yes" : "✗ No",
              className: values.isAvailable
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white rounded-xl px-4 py-3 shadow-sm"
            >
              <span className="text-[13px] text-slate-700 font-medium font-inter">
                {item.label}
              </span>
              <span
                className={`text-[13px] font-inter ${
                  item.className ?? "text-slate-900 font-semibold"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4 relative"
        >
          <button
            onClick={() => onEditStep(1)}
            className="absolute top-4 right-4 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
          >
            <Edit className="w-3 h-3" /> Edit
          </button>

          <div className="flex items-center gap-2 text-[16px] text-slate-800 font-semibold font-playfair">
            <Star className="w-5 h-5 text-yellow-500" />
            Selected Amenities ({values.amenities.length})
          </div>

          <div className="grid grid-cols-1 gap-2">
            {values.amenities.length ? (
              values.amenities.map((amenityName, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
                >
                  <Star className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-slate-900 font-medium font-inter">
                    {getAmenityName(amenityName)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-sm bg-white rounded-xl px-4 py-3 shadow-sm">
                No amenities selected
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Thumbnail */}
        <div className="space-y-3 relative">
          <button
            onClick={() => onEditStep(2)}
            className="absolute top-0 right-0 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
          >
            <Edit className="w-3 h-3" /> Edit
          </button>
          <div className="flex items-center gap-2 text-[16px] text-slate-800 font-semibold font-playfair">
            <Camera className="w-5 h-5 text-indigo-600" />
            Thumbnail Image
          </div>
          <div className="relative max-w-md mx-auto">
            <img
              src={values.thumbnail}
              alt="Thumbnail"
              className="w-full h-60 object-cover rounded-2xl shadow-lg border border-slate-200"
            />
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Main Image
            </span>
          </div>
        </div>

        {/* Gallery */}
        {values.gallery.length > 0 && (
          <div className="space-y-3 relative">
            <button
              onClick={() => onEditStep(3)}
              className="absolute top-0 right-0 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
            <div className="flex items-center gap-2 text-[16px] text-slate-800 font-semibold font-playfair">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              Gallery Images ({values.gallery.length})
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.gallery.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-xl shadow-md"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-lg text-center"
      >
        <div className="flex justify-center items-center gap-2 text-indigo-700 text-[16px] font-semibold font-inter mb-1">
          <Check className="w-5 h-5 text-indigo-600" />
          Ready to Create Room
        </div>
        <p className="text-sm text-blue-800 font-inter">
          All information has been reviewed and is ready for submission.
        </p>
      </motion.div>
    </div>
  );
};