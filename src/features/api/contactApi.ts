import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import type { ContactError, ContactFormData, ContactResponse } from "../../types/contactTypes";


// ---------------- API ----------------
export const contactApi = createApi({
  reducerPath: "contactApi",
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
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<ContactResponse, ContactFormData>({
      query: (formData) => ({
        url: "contact", // Final URL: `${VITE_API_BASE_URL}/contact`
        method: "POST",
        body: formData,
      }),
      transformErrorResponse: (response: ContactError) => {
        return {
          status: response.status,
          data: {
            error: response.data?.error || response.data?.message || "An error occurred while sending your message.",
          },
        };
      },
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
