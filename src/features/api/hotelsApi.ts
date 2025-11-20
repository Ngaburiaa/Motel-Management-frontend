import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  THotel,
  THotelAddress,
  THotelAmenityDetail,
  THotelEntityAmenity,
} from "../../types/hotelsTypes";
import type { RootState } from "../../app/store";

export const hotelsApi = createApi({
  reducerPath: "hotelsApi",
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

  tagTypes: ["Hotel", "HotelAddress", "HotelAmenity"],
  endpoints: (builder) => ({
    getHotels: builder.query<THotel[], void>({
      query: () => "hotels",
      providesTags: ["Hotel"],
    }),
    getHotelById: builder.query({
      query: (id) => `hotel/${id}`,
      providesTags: (_, __, id) => [{ type: "Hotel", id }],
    }),
    createHotel: builder.mutation({
      query: (newHotel) => ({
        url: "hotel",
        method: "POST",
        body: newHotel,
      }),
      invalidatesTags: ["Hotel"],
    }),
    updateHotel: builder.mutation<
      THotel,
      { hotelId: number } & Partial<THotel>
    >({
      query: ({ hotelId, ...patch }) => ({
        url: `hotel/${hotelId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { hotelId }) => [{ type: "Hotel", id: hotelId }],
    }),

    deleteHotel: builder.mutation<void, number>({
      query: (id) => ({
        url: `hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotel"],
    }),
    // Hotel Address endpoint
    getHotelAddress: builder.query({
      query: (hotelId) => `hotel/${hotelId}/address`,
      providesTags: (_, __, hotelId) => [{ type: "HotelAddress", id: hotelId }],
    }),

    // Hotel Entity Amenities endpoint
    getHotelEntityAmenities: builder.query({
      query: (hotelId) => `hotel/${hotelId}/entity-amenities`,
      providesTags: (_, __, hotelId) => [{ type: "HotelAmenity", id: hotelId }],
    }),

    // Hotel Amenity Details endpoint
    getHotelAmenityDetails: builder.query({
      query: (hotelId) => `hotel/${hotelId}/amenities`,
      providesTags: (_, __, hotelId) => [{ type: "HotelAmenity", id: hotelId }],
    }),

    // Combined Hotel Details endpoint(Used)
    getHotelFullDetails: builder.query<
      {
        success: boolean;
        data: {
          hotel: THotel;
          address: THotelAddress;
          amenities: THotelAmenityDetail[];
          entityAmenities: THotelEntityAmenity[];
        };
      },
      number
    >({
      query: (hotelId) => `hotel/${hotelId}/details`,
      providesTags: (_, __, hotelId) => [
        { type: "Hotel", id: hotelId },
        { type: "HotelAddress", id: hotelId },
        { type: "HotelAmenity", id: hotelId },
      ],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetHotelFullDetailsQuery,
} = hotelsApi;
