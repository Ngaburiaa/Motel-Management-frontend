import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TTicket } from "../../types/ticketsTypes";
import type {
  TCreateTicketSchema,
  TReplyTicketSchema,
} from "../../validation/ticketSchema";
import type { RootState } from "../../app/store";

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
          try {
            const token =
              (getState() as RootState).auth.token || localStorage.getItem("token");
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
          } catch (error) {
            console.error("Error preparing headers:", error);
            return headers;
          }
        }, }),

  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    getTickets: builder.query<TTicket[], void>({
      query: () => "tickets",
      providesTags: ["Ticket"],
    }),
    getTicketById: builder.query<TTicket, number>({
      query: (id) => `ticket/${id}`,
      providesTags: (_, __, id) => [{ type: "Ticket", id }],
    }),
    createTicket: builder.mutation<TTicket, TCreateTicketSchema>({
      query: (newTicket) => ({
        url: "ticket",
        method: "POST",
        body: newTicket,
      }),
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),
    updateTicket: builder.mutation<
      TTicket,
      { ticketId: number; ticketData: TReplyTicketSchema }
    >({
      query: ({ ticketId, ticketData }) => ({
        url: `ticket/${ticketId}`,
        method: "PUT",
        body: ticketData,
      }),
      invalidatesTags: (_, __, { ticketId }) => [
        { type: "Ticket", id: ticketId },
        { type: "Ticket", id: "LIST" },
      ],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `ticket/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ticket"],
    }),
    getUserTickets: builder.query<TTicket[], number>({
      query: (userId) => `/${userId}/tickets`,
      providesTags: (_, __, userId) => [{ type: "Ticket", id: userId }],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetUserTicketsQuery,
} = ticketsApi;
