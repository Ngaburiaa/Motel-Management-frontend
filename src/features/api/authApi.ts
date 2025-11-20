// src/redux/api/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth"],
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL,  credentials: 'include' }),
  endpoints: (builder) => ({
    // Login
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "login",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Register
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "forgot-password",
        method: "POST",
        body: emailData,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `password-reset/${token}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
