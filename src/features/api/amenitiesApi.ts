import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TAmenityInsert, TAmenitySelect } from "../../types/roomsTypes";
import type { RootState } from "../../app/store";

export const amenitiesApi = createApi({
  reducerPath: "amenitiesApi",
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

  tagTypes: ["Amenity"],
  endpoints: (builder) => ({
    // Get all amenities
    getAmenities: builder.query<TAmenitySelect[], void>({
      query: () => "amenities",
      transformResponse: (response: { Amenities: TAmenitySelect[] }) =>
        response.Amenities, // Fix the response type
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ amenityId }) => ({
                type: "Amenity" as const,
                id: amenityId,
              })),
              { type: "Amenity", id: "LIST" },
            ]
          : [{ type: "Amenity", id: "LIST" }],
    }),

    // Get single amenity by ID
    getAmenityById: builder.query<TAmenitySelect, number>({
      query: (id) => `amenities/${id}`,
      transformResponse: (response: { Amenity: TAmenitySelect }) =>
        response.Amenity,
      providesTags: (_, __, id) => [{ type: "Amenity", id }],
    }),

    // Create new amenity
    createAmenity: builder.mutation<TAmenitySelect, TAmenityInsert>({
      query: (newAmenity) => ({
        url: "amenity",
        method: "POST",
        body: newAmenity,
      }),
      transformResponse: (response: { Amenity: TAmenitySelect }) =>
        response.Amenity,
      invalidatesTags: ["Amenity"],
    }),

    // Update existing amenity
    updateAmenity: builder.mutation<
      TAmenitySelect,
      { id: number; data: Partial<TAmenityInsert> }
    >({
      query: ({ id, data }) => ({
        url: `amenity/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { Amenity: TAmenitySelect }) =>
        response.Amenity,
      invalidatesTags: (_, __, { id }) => [{ type: "Amenity", id }],
    }),

    // Delete amenity
    deleteAmenity: builder.mutation<void, number>({
      query: (id) => ({
        url: `amenity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Amenity"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAmenitiesQuery,
  useGetAmenityByIdQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
} = amenitiesApi;
