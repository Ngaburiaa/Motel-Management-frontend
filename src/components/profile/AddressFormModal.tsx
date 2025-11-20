import { useEffect } from "react";
import {
  MapPin,
  SendHorizontal,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import type { TAddress } from "../../types/addressTypes";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: TAddress) => void;
  defaultValues?: Partial<TAddress>;
}

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: AddressFormModalProps) => {
  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<TAddress>({
  defaultValues: {
    addressId: defaultValues?.addressId ?? undefined,
    street: defaultValues?.street ?? "",
    city: defaultValues?.city ?? "",
    state: defaultValues?.state ?? "",
    postalCode: defaultValues?.postalCode ?? "",
    country: defaultValues?.country ?? "",
  },
});

useEffect(() => {
  if (defaultValues?.addressId) {
    reset(defaultValues); // Only reset on edit
  } else {
    reset({
      addressId: undefined,
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
  }
}, [defaultValues, reset]);

  const handleFormSubmit = (data: TAddress) => {
    try {
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-[#e5e5e5] text-black w-full max-w-xl rounded-2xl shadow-lg p-8 relative border border-[#FCA311]"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-[#03071E] tracking-wide flex items-center gap-2">
              <MapPin size={22} /> {defaultValues?.addressId ? "Edit" : "Add"} Address
            </h2>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
              {/* Street */}
              <div>
                <label className="label text-[#14213D] font-medium">Street</label>
                <input
                  {...register("street", { required: "Street is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311] placeholder-gray-500"
                  placeholder="e.g., 123 Main St"
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
              </div>

              {/* City */}
              <div>
                <label className="label text-[#14213D] font-medium">City</label>
                <input
                  {...register("city", { required: "City is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311]"
                  placeholder="e.g., Nairobi"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>

              {/* State */}
              <div>
                <label className="label text-[#14213D] font-medium">State</label>
                <input
                  {...register("state", { required: "State is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311]"
                  placeholder="e.g., Nairobi County"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              </div>

              {/* Postal Code */}
              <div>
                <label className="label text-[#14213D] font-medium">Postal Code</label>
                <input
                  {...register("postalCode", { required: "Postal code is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311]"
                  placeholder="e.g., 00100"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="label text-[#14213D] font-medium">Country</label>
                <input
                  {...register("country", { required: "Country is required" })}
                  className="input input-bordered w-full bg-white text-black border border-[#FCA311]"
                  placeholder="e.g., Kenya"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="btn bg-[#FCA311] text-black hover:bg-[#e59d08] border-none shadow-md flex items-center gap-2 px-6"
                >
                  <SendHorizontal size={18} /> Save Address
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
