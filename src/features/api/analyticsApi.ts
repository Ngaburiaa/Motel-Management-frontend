import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import type { UserAnalyticsResponse } from "../../types/userAnalyticsTypes";
import type { AdminAnalyticsResponse, DateRange, OwnerAnalyticsResponse } from "../../types/analyticsTypes";


// ====================== API DEFINITION ======================
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      try {
        const token = (getState() as RootState).auth.token || localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      } catch (error) {
        console.error('Error preparing headers:', error);
        return headers;
      }
    },
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, DateRange | void>({
      query: (dateRange) => ({
        url: "analytics/admin",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),

    getOwnerAnalytics: builder.query<OwnerAnalyticsResponse, DateRange | void>({
      query: (dateRange) => ({
        url: "analytics/owner",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),

    getUserAnalytics: builder.query<UserAnalyticsResponse, number>({
      query: (userId) => ({
        url: `analytics/user/${userId}`,
        method: 'GET'
      }),
      providesTags: ['Analytics']
    }),

    getRoleBasedAnalytics: builder.query<
      AdminAnalyticsResponse | OwnerAnalyticsResponse | UserAnalyticsResponse, 
      DateRange | void
    >({
      query: (dateRange) => ({
        url: "analytics",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

// ====================== EXPORT HOOKS ======================
export const {
  useGetAdminAnalyticsQuery,
  useGetOwnerAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useGetRoleBasedAnalyticsQuery,
} = analyticsApi;