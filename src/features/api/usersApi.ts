// src/api/users/usersApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TUser } from "../../types/usersTypes";
import type { RootState } from "../../app/store";

export const usersApi = createApi({
  reducerPath: "usersApi",
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

  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<TUser[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<TUser, number>({
      query: (id) => `user/${id}`,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<TUser, Partial<TUser>>({
      query: (newUser) => ({
        url: "user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<TUser, Partial<TUser> & { userId: number }>({
      query: ({ userId, ...patch }) => ({
        url: `user/${userId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: "User", id: userId }],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
