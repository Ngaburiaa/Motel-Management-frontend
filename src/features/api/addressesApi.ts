import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TAddressEntity } from "../../types/entityTypes";
import type { TAddress } from "../../types/addressTypes";
import type { RootState } from "../../app/store";

export const addressesApi = createApi({
  reducerPath: "addressesApi",
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
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => "addresses",
      providesTags: ["Address"],
    }),
    getAddressById: builder.query({
      query: (id) => `address/${id}`,
      providesTags: (_, __, id) => [{ type: "Address", id }],
    }),
    createAddress: builder.mutation({
      query: (newAddress) => ({
        url: "address",
        method: "POST",
        body: newAddress,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, ...patch }) => ({
        url: `address/${addressId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { addressId }) => [
        { type: "Address", id: addressId },
      ],
    }),
    deleteAddress: builder.mutation<void, number>({
      query: (id) => ({
        url: `address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    getEntityAddress: builder.query<
      TAddress[],
      { entityId: number; entityType: TAddressEntity }
    >({
      query: ({ entityId, entityType }) => `address/${entityType}/${entityId}`,
      providesTags: (_, __, { entityId, entityType }) => [
        { type: "Address", entityId: entityId, entityType: entityType },
      ],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetEntityAddressQuery,
} = addressesApi;
