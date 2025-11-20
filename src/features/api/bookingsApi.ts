import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  TBooking,
  TBookingForm,
  PaginatedResponse,
  TBookingStatus,
} from "../../types/bookingsTypes";
import type { RootState } from "../../app/store";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL ,
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
      },}),

  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    // Get all bookings with pagination and status filter
    getBookings: builder.query<
      PaginatedResponse<TBooking[]>,
      {
        page?: number;
        limit?: number;
        status?: TBookingStatus | TBookingStatus[];
      }
    >({
      query: (params) => {
        const { page = 1, limit = 10, status } = params;
        const queryParams = new URLSearchParams();

        queryParams.set("page", page.toString());
        queryParams.set("limit", limit.toString());

        if (status) {
          if (Array.isArray(status)) {
            status.forEach((s) => queryParams.append("status", s));
          } else {
            queryParams.set("status", status);
          }
        }

        return `bookings?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ bookingId }) => ({
                type: "Booking" as const,
                id: bookingId,
              })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    // Get booking by ID
    getBookingById: builder.query<TBooking, number>({
      query: (bookingId) => `booking/${bookingId}`,
      providesTags: (_, __, bookingId) => [
        { type: "Booking", id: bookingId },
      ],
    }),

    // Get bookings by user ID with pagination
    getBookingsByUserId: builder.query<
      PaginatedResponse<TBooking[]>,
      {
        userId: number;
        page?: number;
        limit?: number;
        status?: TBookingStatus | TBookingStatus[];
      }
    >({
      query: ({ userId, page = 1, limit = 10, status }) => {
        const queryParams = new URLSearchParams();

        queryParams.set("page", page.toString());
        queryParams.set("limit", limit.toString());

        if (status) {
          if (Array.isArray(status)) {
            status.forEach((s) => queryParams.append("status", s));
          } else {
            queryParams.set("status", status);
          }
        }

        return `bookings/user/${userId}?${queryParams.toString()}`;
      },
      providesTags: (result, _, { userId }) =>
        result?.data
          ? [
              ...result.data.map(({ bookingId }) => ({
                type: "Booking" as const,
                id: bookingId,
              })),
              { type: "Booking", id: `USER-${userId}` },
            ]
          : [{ type: "Booking", id: `USER-${userId}` }],
    }),

    // Create booking
    createBooking: builder.mutation<TBooking, TBookingForm>({
      query: (newBooking) => ({
        url: "booking",
        method: "POST",
        body: newBooking,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),

    // Update booking
    updateBooking: builder.mutation<
      TBooking,
      {
        bookingId: number;
        data: Partial<TBookingForm>;
      }
    >({
      query: ({ bookingId, data }) => ({
        url: `booking/${bookingId}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_, __, { bookingId }) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: "LIST" },
      ],
    }),

    // Delete booking
    deleteBooking: builder.mutation<void, number>({
      query: (bookingId) => ({
        url: `booking/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, bookingId) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingsByUserIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useLazyGetBookingsQuery,
  useLazyGetBookingByIdQuery,
  useLazyGetBookingsByUserIdQuery,
} = bookingsApi;
