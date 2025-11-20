import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import type { ReviewResponse, ReviewsByRoomTypeResponse, ReviewsResponse, TReviewInsert, TReviewUpdateInput } from "../../types/reviewsTypes";



export const reviewApi = createApi({
  reducerPath: "reviewApi",
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
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    // Get all reviews
    getReviews: builder.query<ReviewsResponse, void>({
      query: () => "reviews",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({
                type: "Review" as const,
                id: reviewId,
              })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    // Get review by ID
    getReviewById: builder.query<ReviewResponse, number>({
      query: (id) => `reviews/${id}`,
      providesTags: (_, __, id) => [{ type: "Review", id }],
    }),

    // Create new review
    createReview: builder.mutation<ReviewResponse, TReviewInsert>({
      query: (body) => ({
        url: "reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    // Update review
    updateReview: builder.mutation<
      ReviewResponse,
      { id: number; updates: TReviewUpdateInput }
    >({
      query: ({ id, updates }) => ({
        url: `reviews/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Review", id }],
    }),

    // Delete review
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Review", id }],
    }),

    // Get reviews by room type
    getReviewsByRoomType: builder.query<ReviewsByRoomTypeResponse, number>({
      query: (roomTypeId) => `reviews/room-type/${roomTypeId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({
                type: "Review" as const,
                id: reviewId,
              })),
              { type: "Review", id: "ROOM_TYPE_LIST" },
            ]
          : [{ type: "Review", id: "ROOM_TYPE_LIST" }],
    }),

    // Get reviews by user (considering user association)
    getReviewsByUser: builder.query<ReviewsResponse, number>({
      query: (userId) => `reviews/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({
                type: "Review" as const,
                id: reviewId,
              })),
              { type: "Review", id: "USER_LIST" },
            ]
          : [{ type: "Review", id: "USER_LIST" }],
    }),

    // Get reviews by booking (considering booking association)
    getReviewsByBooking: builder.query<ReviewResponse | null, number>({
      query: (bookingId) => `reviews/booking/${bookingId}`,
      providesTags: (_, __, bookingId) => [
        { type: "Review", id: `BOOKING_${bookingId}` },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByRoomTypeQuery,
  useGetReviewsByUserQuery,
  useGetReviewsByBookingQuery,
} = reviewApi;
