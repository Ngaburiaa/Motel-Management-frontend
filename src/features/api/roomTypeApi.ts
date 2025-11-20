import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import type { CreateRoomTypeRequest, RoomTypeResponse, RoomTypesResponse, UpdateRoomTypeRequest } from '../../types/roomTypesTypes';



export const roomTypeApi = createApi({
  reducerPath: 'roomTypeApi',
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
  tagTypes: ['RoomType'],
  endpoints: (builder) => ({
    // Get all room types
    getRoomTypes: builder.query<RoomTypesResponse, void>({
      query: () => 'room-types',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ roomTypeId }) => ({ 
                type: 'RoomType' as const, 
                id: roomTypeId 
              })),
              { type: 'RoomType', id: 'LIST' },
            ]
          : [{ type: 'RoomType', id: 'LIST' }],
    }),

    // Get single room type by ID
    getRoomTypeById: builder.query<RoomTypeResponse, number>({
      query: (id) => `room-types/${id}`,
      providesTags: (_, __, id) => [{ type: 'RoomType', id }],
    }),

    // Create new room type
    createRoomType: builder.mutation<RoomTypeResponse, CreateRoomTypeRequest>({
      query: (body) => ({
        url: 'room-type',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'RoomType', id: 'LIST' }],
    }),

    // Update room type
    updateRoomType: builder.mutation<
      RoomTypeResponse, 
      { id: number; updates: UpdateRoomTypeRequest }
    >({
      query: ({ id, updates }) => ({
        url: `room-types/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'RoomType', id }],
    }),

    // Delete room type
    deleteRoomType: builder.mutation<
      { success: boolean; id: number }, 
      number
    >({
      query: (id) => ({
        url: `room-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'RoomType', id },
        { type: 'RoomType', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetRoomTypesQuery,
  useGetRoomTypeByIdQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
} = roomTypeApi;

// Export types for use in components
export type {
  RoomTypeResponse,
  RoomTypesResponse,
  CreateRoomTypeRequest,
  UpdateRoomTypeRequest,
};