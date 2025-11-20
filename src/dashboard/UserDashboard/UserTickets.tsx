import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserTicketsQuery } from "../../features/api";
import { TicketCard } from "../../components/ticket/TicketCard";
import { TicketFormModal } from "../../components/ticket/TicketFormModal";
import { TicketReplyModal } from "../../components/ticket/TicketReplyModal";
import { Plus} from "lucide-react";
import type { RootState } from "../../app/store";
import type { TTicket } from "../../types/ticketsTypes";
import { TicketCardSkeleton } from "../../components/ticket/skeleton/TicketCardSkeleton";

export const UserTickets = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TTicket | null>(null);
  const { userId, userType } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);
  const { data: tickets, isLoading, refetch: refetchTickets} = useGetUserTicketsQuery(id);

  useEffect(()=>{refetchTickets()},[refetchTickets, showModal])

  return (
    <div className="bg-gradient-to-br from-[#FEFAE0] to-white min-h-screen p-6 md:p-10 text-[#283618]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#BC6C25]">
          Support Tickets
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-white/30 backdrop-blur-lg border border-[#DDA15E]/40 text-[#283618] px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#DDA15E] hover:text-white"
        >
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      {/* Ticket Grid */}
      <section className="grid gap-6">
        {isLoading ? (
  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <TicketCardSkeleton key={i} />
    ))}
  </div>
) : tickets?.length ? (
  tickets.map((ticket: TTicket) => (
    <TicketCard
      key={ticket.ticketId}
      ticket={ticket}
      onClick={() => setSelectedTicket(ticket)}
    />
  ))
) : (
  <div className="text-center text-[#6B7280] text-lg py-20">
    You haven’t submitted any tickets yet.
    <br />
    Click “Create Ticket” to reach our support.
  </div>
)}

      </section>

      {/* Modals */}
      <TicketFormModal show={showModal} onClose={() => setShowModal(false)} />
      {selectedTicket && userType === "admin" && (
        <TicketReplyModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
