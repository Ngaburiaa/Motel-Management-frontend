import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TRoom } from "../../types/roomsTypes";
import type { AvailabilityParams, AvailabilityResponse } from "../../types/availabilityTypes";
import type { RootState } from "../../app/store";

export const availabilityApi = createApi({
  reducerPath: "availabilityApi",
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
  tagTypes: ["Availability"],
  endpoints: (builder) => ({
    checkAvailability: builder.query<TRoom[], AvailabilityParams>({
      query: ({ checkInDate, checkOutDate, capacity }) => {
        const params: Record<string, string> = {
          checkInDate,
          checkOutDate,
        };

        if (capacity !== undefined) {
          params.capacity = String(capacity);
        }

        return {
          url: "rooms/availability",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: AvailabilityResponse) => response.data,
      providesTags: ["Availability"],
    }),
  }),
});

export const {
  useCheckAvailabilityQuery,
  useLazyCheckAvailabilityQuery,
} = availabilityApi;
