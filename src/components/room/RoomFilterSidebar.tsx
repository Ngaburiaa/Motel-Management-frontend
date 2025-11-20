import { LucideSearch, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

export interface RoomFilterValues {
  search: string;
  availableOnly: boolean;
  maxPrice: number;
  minGuests: number;
}

interface RoomFilterSidebarProps {
  onFilter: (filters: RoomFilterValues) => void;
}

export const RoomFilterSidebar: React.FC<RoomFilterSidebarProps> = ({ onFilter }) => {
  const { register, handleSubmit, reset, watch } = useForm<RoomFilterValues>({
    defaultValues: {
      search: "",
      availableOnly: false,
      maxPrice: 1000,
      minGuests: 1,
    },
  });

  const maxPrice = watch("maxPrice");
  const minGuests = watch("minGuests");

  const onSubmit = (data: RoomFilterValues) => onFilter(data);

  const onReset = () => {
    const defaultFilters = {
      search: "",
      availableOnly: false,
      maxPrice: 1000,
      minGuests: 1,
    };
    reset(defaultFilters);
    onFilter(defaultFilters);
  };

  return (
    <motion.aside
      className="sticky top-20 self-start w-full lg:w-72 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Image */}
      <div
        className="h-28 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://www.zinus.com.sg/cdn/shop/articles/5-bedroom-design-ideas-to-transform-it-into-a-luxury-hotel-suite.jpg?v=1669103710')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-lg font-semibold text-white">Room Filters</h2>
        </div>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 text-sm">
        {/* Search */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">Search Room</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Deluxe"
              {...register("search")}
              className="input input-bordered w-full pr-9 input-sm text-sm text-white placeholder-slate-400"
            />
            <LucideSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between">
          <label className="font-medium text-slate-700">Available Only</label>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary"
            {...register("availableOnly")}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="flex justify-between mb-1 font-medium text-slate-700">
            <span>Max Price</span>
            <span className="text-slate-600 font-semibold text-xs">${maxPrice}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={1}
            {...register("maxPrice", { valueAsNumber: true })}
            className="range range-sm range-primary"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>$0</span>
            <span>$1000</span>
          </div>
        </div>

        {/* Min Guests */}
        <div>
          <label className="flex justify-between mb-1 font-medium text-slate-700">
            <span>Min Guests</span>
            <span className="text-slate-600 font-semibold text-xs">{minGuests}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            {...register("minGuests", { valueAsNumber: true })}
            className="range range-sm range-primary"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="btn btn-sm btn-primary w-full font-medium"
          >
            Apply Filters
          </motion.button>

          <motion.button
            type="button"
            onClick={onReset}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="btn btn-sm btn-outline w-full font-medium text-slate-700 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>
      </form>
    </motion.aside>
  );
};
