import { useEffect, useState } from "react";
import { useGetTicketsQuery } from "../../features/api";
import { TicketCard } from "../../components/ticket/TicketCard";
import { TicketReplyModal } from "../../components/ticket/TicketReplyModal";
import { TicketFilters } from "../../components/ticket/TicketFilters";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Loader } from "lucide-react";
import type { TTicket } from "../../types/ticketsTypes";


export const Ticket = () => {
  const { data: tickets, isLoading, refetch } = useGetTicketsQuery();
  const [selectedTicket, setSelectedTicket] = useState<TTicket | null>(null);
  const { userType } = useSelector((state: RootState) => state.auth);
  const [filters, setFilters] = useState({ status: "", user: "" });

  useEffect(()=>{refetch()},[refetch, tickets])

  const filteredTickets = tickets?.filter((ticket: TTicket) => {
    const matchesStatus = filters.status
      ? ticket.status === filters.status
      : true;

    const matchesUser = filters.user
      ? `${ticket.user?.firstName ?? ""} ${ticket.user?.lastName ?? ""}`
          .toLowerCase()
          .includes(filters.user.toLowerCase())
      : true;

    return matchesStatus && matchesUser;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#e5e5e5] px-6 md:px-10 py-10 text-[#14213d]">
      {/* Header & Filters inline */}
      <div className="bg-white px-6 py-4 rounded-xl border border-[#e5e5e5] shadow-sm">
        <TicketFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Ticket List */}
      <section className="mt-8 grid gap-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-[#fca311]" size={32} />
          </div>
        ) : filteredTickets?.length ? (
          filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onClick={() => setSelectedTicket(ticket)}
            />
          ))
        ) : (
          <div className="text-center py-20 text-[#6b7280] text-lg">
            No tickets match the current filters.
          </div>
        )}
      </section>

      {/* Reply Modal (Admin only) */}
      {selectedTicket && userType === "admin" && (
        <TicketReplyModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
