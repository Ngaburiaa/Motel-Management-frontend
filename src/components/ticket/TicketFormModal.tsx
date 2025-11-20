import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTicketSchema, type TCreateTicketSchema } from "../../validation/ticketSchema";
import { useCreateTicketMutation } from "../../features/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import toast from "react-hot-toast";
import { X, Send, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../ui/loadingSpinner";

interface Props {
  onClose: () => void;
  show: boolean;
}

export const TicketFormModal = ({ onClose, show }: Props) => {
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      userId: userId ?? undefined,
    },
  });

  const [createTicket] = useCreateTicketMutation();

  const onSubmit = async (data: TCreateTicketSchema) => {
    try {
      await createTicket(data).unwrap();
      toast.success("🎫 Ticket submitted successfully!");
      onClose();
      reset();
    } catch (err) {
      toast.error("❌ Failed to create ticket.");
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <dialog open className="modal modal-open z-50">
          <motion.div
            key="ticket-form"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="modal-box max-w-lg bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl border border-[#DDA15E]/30 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#BC6C25] flex items-center gap-2">
                <FileText size={20} /> New Support Ticket
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-[#BC6C25] transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-[#283618]">Subject <span className="text-red-500">*</span></label>
                <input
                  {...register("subject")}
                  placeholder="Briefly describe your issue"
                  className="input input-bordered w-full bg-white border border-[#DDA15E]/40 text-[#283618] placeholder:text-[#BC6C25] focus:ring-[#BC6C25] focus:border-[#BC6C25]"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-[#283618]">Description <span className="text-red-500">*</span></label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Please provide detailed information about your issue"
                  className="textarea textarea-bordered w-full bg-white border border-[#DDA15E]/40 text-[#283618] placeholder:text-[#BC6C25] focus:ring-[#BC6C25] focus:border-[#BC6C25]"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="btn btn-sm bg-slate-100 text-gray-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm bg-[#BC6C25] text-white hover:bg-[#A55B1E] flex items-center gap-2"
                >
                  {isSubmitting ? <LoadingSpinner size={16} /> : <><Send size={16} /> Submit Ticket</>}
                </button>
              </div>
            </form>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
};
