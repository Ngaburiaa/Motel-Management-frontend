import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { type FormData } from "./types";

interface AmenitiesSelectionProps {
  amenities: {
    amenityId: number;
    name: string;
    description: string | null;
    icon: string | null;
  }[];
}

export const AmenitiesSelection = ({ amenities }: AmenitiesSelectionProps) => {
  const { watch, setValue } = useFormContext<FormData>();
  const selected = watch("amenities");

  const toggleAmenity = (value: string) => {
    if (selected.includes(value)) {
      setValue("amenities", selected.filter((v) => v !== value));
    } else {
      setValue("amenities", [...selected, value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-[20px] font-semibold font-['Playfair_Display'] text-[#0a2540]">
          Select Amenities
        </h2>
        <p className="text-[14px] font-medium text-neutral-600">
          Choose the features available in this room
        </p>
      </div>

      {/* Amenity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map(({ name, icon }, index) => {
          const isSelected = selected.includes(name);

          return (
            <motion.button
              type="button"
              key={name}
              onClick={() => toggleAmenity(name)}
              className={`relative group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 border-2 text-left
                ${
                  isSelected
                    ? "bg-[#f5f8ff] border-[#2d3e50] shadow-xl"
                    : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md"
                }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Icon */}
              <div
                className={`min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center transition-all duration-300
                  ${
                    isSelected
                      ? "bg-[#2d3e50] text-white shadow-lg"
                      : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                  }`}
              >
                {icon ? (
                  <span className="text-[18px]">{icon}</span>
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </div>

              {/* Name */}
              <div className="flex-1">
                <h3 className="text-[14px] font-medium text-[#0a2540]">
                  {name}
                </h3>
              </div>

              {/* Selection Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2d3e50] text-white flex items-center justify-center shadow-md"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Summary */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f5f8ff] border border-[#cdd9ed] text-[#0a2540] rounded-xl px-6 py-4 mt-4"
        >
          <p className="text-[14px] font-medium text-center">
            ✓ Selected {selected.length} amenit{selected.length > 1 ? "ies" : "y"}:{" "}
            <span className="font-semibold">{selected.join(", ")}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
};
