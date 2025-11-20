import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { compressImage } from "../../utils/imageUploadUtils";
import type { CloudinaryUploadResponse, UploadImageArgs } from "../../types/imageUploadTypes";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation<CloudinaryUploadResponse, UploadImageArgs>({
      async queryFn({ file, context }) {
        try {
          const compressed = await compressImage(file);
          const formData = new FormData();
          formData.append("file", compressed);
          formData.append("upload_preset", UPLOAD_PRESET);
          formData.append("folder", context);

          const res = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");

          const data = (await res.json()) as CloudinaryUploadResponse;
          return { data };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;