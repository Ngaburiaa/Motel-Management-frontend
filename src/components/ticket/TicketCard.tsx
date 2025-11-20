import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Reply,
  UserRound,
  ChevronDown,
  Mail,
  Trash2,
  Info,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDeleteTicketMutation } from "../../features/api";
import { cn } from "../../lib/utils";
import type { TTicket } from "../../types/ticketsTypes";

const MySwal = withReactContent(Swal);

interface Props {
  ticket: TTicket;
  onClick: () => void;
}

export const TicketCard = ({ ticket, onClick }: Props) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [deleteTicket] = useDeleteTicketMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fca311",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const toastId = toast.loading("Deleting...");
      try {
        await deleteTicket(ticket.ticketId).unwrap();
        toast.success("Deleted successfully", {
          id: toastId,
          icon: <CheckCircle2 className="text-green-600" />,
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        toast.error("Failed to delete ticket", {
          id: toastId,
          icon: <XCircle className="text-red-600" />,
        });
      }
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-[#ffffff] border border-[#e5e5e5] shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] cursor-pointer"
      >
        {/* Top Bar */}
        <div className="bg-[#14213d] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-[#fca311]" />
            <span className="font-semibold text-sm">#{ticket.ticketId}</span>
          </div>
          <span className="text-xs opacity-70">{format(new Date(ticket.createdAt), "PPp")}</span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-2">
          <h3 className="text-lg font-bold text-[#03071e]">{ticket.subject}</h3>
          <p className="text-sm text-[#14213d]/80 line-clamp-2">{ticket.description}</p>

          {ticket.user && (
            <div className="text-xs text-[#14213d]/60 flex items-center gap-2 mt-1">
              <UserRound size={14} className="text-[#14213d]/40" />
              {ticket.user.firstName} {ticket.user.lastName}
              <Mail size={12} className="ml-2 text-[#14213d]/40" />
              <span className="ml-1 truncate">{ticket.user.email}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#e5e5e5] px-5 py-3 flex items-center justify-between">
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {ticket.status === "Open" ? (
              <AlertCircle className="text-[#fca311]" size={16} />
            ) : (
              <CheckCircle2 className="text-green-600" size={16} />
            )}
            <span className={cn("font-medium", ticket.status === "Open" ? "text-[#fca311]" : "text-green-700")}>{ticket.status}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {ticket.reply && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReplyModalOpen(true);
                }}
                className="text-xs text-[#03071e] bg-[#fca311]/20 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#fca311]/30 transition"
              >
                <Reply size={14} />
                View Reply
                <ChevronDown size={14} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-xs text-red-600 flex items-center gap-1 hover:underline"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && ticket.reply && (
        <dialog className="modal modal-open z-50 bg-black/30 backdrop-blur-sm" onClick={() => setIsReplyModalOpen(false)}>
  <div
    className="modal-box max-w-2xl rounded-xl p-6 shadow-2xl border border-[#e5e5e5] bg-[#ffffff]"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <div className="flex justify-between items-center border-b pb-3 mb-5">
      <div className="flex items-center gap-2 text-[#14213d]">
        <Info className="text-[#fca311]" size={22} />
        <h3 className="text-lg font-bold">Admin Reply</h3>
      </div>
      <button
        onClick={() => setIsReplyModalOpen(false)}
        className="text-[#03071e] hover:text-[#fca311] transition"
        title="Close"
      >
        ✕
      </button>
    </div>

    {/* Reply Content */}
    <div className="bg-[#fca311]/10 text-[#14213d] p-5 rounded-lg shadow-inner whitespace-pre-line leading-relaxed text-sm">
      {ticket.reply}
    </div>
    <p className="mt-3 text-right text-xs text-[#fca311] italic">— Admin</p>

    {/* Actions */}
    <form method="dialog" className="mt-6">
      <button
        onClick={() => setIsReplyModalOpen(false)}
        className="w-full py-2 px-4 rounded-md bg-[#14213d] text-white hover:bg-[#000000] transition font-semibold text-sm tracking-wide"
      >
        Close
      </button>
    </form>
  </div>
</dialog>

      )}
    </>
  );
};
