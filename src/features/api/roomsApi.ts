import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  TRoom,
  TRoomType,
  TRoomWithAmenities,
} from "../../types/roomsTypes";
import type { RootState } from "../../app/store";

export const roomsApi = createApi({
  reducerPath: "roomsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ,
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

  tagTypes: ["Room", "RoomAmenity"],
  endpoints: (builder) => ({
    getRooms: builder.query<TRoom[], void>({
      query: () => "rooms",
      providesTags: ["Room"],
    }),
    getRoomById: builder.query<TRoom, number>({
      query: (id) => `room/${id}`,
      providesTags: (_, __, id) => [{ type: "Room", id }],
    }),
    getRoomByHotelId: builder.query<TRoom[], number>({
      query: (id) => `hotel/${id}/rooms`,
      providesTags: (_, __, id) => [{ type: "Room", id }],
    }),
    createRoom: builder.mutation<TRoom, Partial<TRoom>>({
      query: (newRoom) => ({
        url: "room",
        method: "POST",
        body: newRoom,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation<
      TRoomWithAmenities,
      {
        roomId: number;
        roomData: Partial<TRoom> & {
          amenities?: number[];
          roomType?: Partial<TRoomType>;
        };
      }
    >({
      query: ({ roomId, roomData }) => ({
        url: `room/${roomId}`,
        method: "PUT",
        body: {
          roomData: {
            ...roomData,
            pricePerNight: roomData.pricePerNight?.toString(),
            amenities: roomData.amenities || [],
          },
        },
      }),
      invalidatesTags: (_, __, { roomId }) => [
        { type: "Room", id: roomId },
        { type: "RoomAmenity", id: roomId },
      ],
    }),
    deleteRoom: builder.mutation<void, number>({
      query: (id) => ({
        url: `room/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Room"],
    }),
    getRoomWithAmenities: builder.query<TRoomWithAmenities, number>({
      query: (id) => ({
        url: `room/${id}/room-details`,
      }),
      providesTags: (_, __, id) => [{ type: "RoomAmenity", id }],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomByHotelIdQuery,
  useGetRoomWithAmenitiesQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
