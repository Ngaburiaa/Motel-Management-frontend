import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

interface NewsletterPayload {
  email: string;
}

interface NewsletterResponse {
  message: string;
}

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
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
  tagTypes: ["Newsletter"],
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation<
      NewsletterResponse,
      NewsletterPayload
    >({
      query: (payload) => ({
        url: "subscribe",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Newsletter"],
    }),
    unsubscribeFromNewsletter: builder.mutation<
      NewsletterResponse,
      NewsletterPayload
    >({
      query: (payload) => ({
        url: "unsubscribe",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation,
} = newsletterApi;
