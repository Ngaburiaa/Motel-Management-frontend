import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquareReply, SendHorizonal, Info } from "lucide-react";

import {
  replyTicketSchema,
  type TReplyTicketSchema,
} from "../../validation/ticketSchema";
import type { TTicket } from "../../types/ticketsTypes";
import { useUpdateTicketMutation } from "../../features/api";
import { LoadingSpinner } from "../ui/loadingSpinner";

interface Props {
  ticket: TTicket;
  onClose: () => void;
}

export const TicketReplyModal = ({ ticket, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TReplyTicketSchema>({
    resolver: zodResolver(replyTicketSchema),
    defaultValues: {
      reply: ticket.reply || "",
      status: ticket.status ?? "Open",
    },
  });

  const [updateTicket] = useUpdateTicketMutation();

  const onSubmit = async (data: TReplyTicketSchema) => {
    const submitData = {
      ticketId: ticket.ticketId,
      ticketData: {
        reply: data.reply,
        status: data.status,
      },
    };

    try {
      await updateTicket(submitData).unwrap();
      toast.success("✅ Ticket updated successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error("❌ Failed to update ticket.");
      console.error(err);
    }
  };

  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <dialog className="modal modal-open z-50 bg-black/30">
      <AnimatePresence>
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="modal-box max-w-2xl rounded-xl p-6 shadow-lg bg-white border border-[#e5e5e5]"
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold text-[#14213d] flex items-center gap-2">
              <MessageSquareReply size={20} />
              Reply to Ticket #{ticket.ticketId}
            </h2>
            <button
              onClick={onClose}
              className="text-[#6b7280] hover:text-[#fca311] transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-[#000000] font-medium">{ticket.subject}</p>
            <p className="text-sm text-[#14213d]">{ticket.description}</p>

            {ticket.reply && (
              <div className="mt-3 bg-[#fca311]/10 border border-[#fca311]/20 p-4 rounded-md">
                <div className="flex items-center gap-1 text-sm font-semibold text-[#fca311]">
                  <Info size={16} />
                  Previous Reply
                </div>
                <p className="text-sm text-[#03071e] mt-1 whitespace-pre-line">
                  {ticket.reply}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label text-[#14213d] font-medium">Reply</label>
              <textarea
                {...register("reply")}
                placeholder="Type your response..."
                rows={4}
                className="textarea textarea-bordered w-full bg-[#e5e5e5] text-[#000000] border-[#fca311] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#fca311]"
              />
              {errors.reply && (
                <p className="text-red-500 text-sm mt-1">{errors.reply.message}</p>
              )}
            </div>

            <div>
              <label className="label text-[#14213d] font-medium">Status</label>
              <select
                {...register("status")}
                className="select select-bordered w-full bg-[#e5e5e5] text-[#000000] border-[#fca311] focus:outline-none focus:ring-2 focus:ring-[#fca311]"
              >
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm bg-[#e5e5e5] text-[#03071e] hover:bg-[#dcdcdc] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-sm bg-[#fca311] text-white hover:bg-[#e29500] transition flex items-center gap-1"
              >
                <SendHorizonal size={16} />
                {isSubmitting ? <LoadingSpinner /> : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </dialog>
  );
};
