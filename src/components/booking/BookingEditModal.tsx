import React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  onClose: () => void;
}

type FormData = {
  checkInDate: string;
  checkOutDate: string;
  notes: string;
};

export const BookingEditModal: React.FC<Props> = ({ show, onClose }) => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Booking updated:", data);

    toast.success("Booking updated successfully!", {
      style: {
        background: "#14213d",
        color: "#ffffff",
        border: "1px solid #fca311",
      },
      iconTheme: {
        primary: "#fca311",
        secondary: "#14213d",
      },
    });

    onClose();
    reset();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-[#14213d] rounded-xl shadow-lg p-6 text-white border border-[#2c3e50] animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#fca311] hover:text-white transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-[#fca311] mb-4">
          Edit Booking
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              {...register("checkInDate")}
              className="w-full px-3 py-2 rounded-md bg-[#03071e] text-white border border-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#fca311]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              {...register("checkOutDate")}
              className="w-full px-3 py-2 rounded-md bg-[#03071e] text-white border border-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#fca311]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-1">
              Special Notes
            </label>
            <textarea
              {...register("notes")}
              placeholder="Add any notes..."
              className="w-full px-3 py-2 rounded-md bg-[#03071e] text-white border border-[#2c3e50] resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#fca311]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#e5e5e5] text-[#e5e5e5] hover:bg-[#2c3e50] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#fca311] text-black font-medium hover:brightness-90 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
