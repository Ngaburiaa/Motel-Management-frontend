import { useUploadImageMutation } from "../features/api/imageUploadApi";
import type { UploadContext } from "../types/imageUploadTypes";

export const useImageUploader = () => {
  const [uploadImage, { isLoading, isError, isSuccess, error, data }] =
    useUploadImageMutation();

  const upload = async (file: File, context: UploadContext) => {
    if (!file) return;
    return await uploadImage({ file, context }).unwrap();
  };

  return {
    upload,
    isLoading,
    isError,
    isSuccess,
    error,
    data,
  };
};
