import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TPayment, TPaymentResponse } from "../../types/paymentsTypes";
import type { RootState } from "../../app/store";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
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
    },
  }),

  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayments: builder.query<TPaymentResponse, void>({
      query: () => "payments",
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query<TPayment, number>({
      query: (id) => `payment/${id}`,
      providesTags: (_, __, id) => [{ type: "Payment", id }],
    }),
    getPaymentByBookingId: builder.query<TPayment | null, number>({
      query: (bookingId) => `payment/${bookingId}`,
    }),
    getPaymentsByUserId: builder.query<TPaymentResponse, number>({
      query: (userId) => `/payment/user/${userId}`,
    }),
    createPayment: builder.mutation<TPayment, Partial<TPayment>>({
      query: (newPayment) => ({
        url: "payment",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payment"],
    }),
    updatePayment: builder.mutation<
      TPayment,
      Partial<TPayment> & { paymentId: number }
    >({
      query: ({ paymentId, ...patch }) => ({
        url: `payment/${paymentId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { paymentId }) => [
        { type: "Payment", id: paymentId },
      ],
    }),
    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentsByUserIdQuery,
} = paymentsApi;
