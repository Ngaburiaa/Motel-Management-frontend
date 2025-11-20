import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import { useImageUploader } from "../../hook/useImageUploader";
import type { CloudinaryUploadResponse, UploadContext } from "../../types/imageUploadTypes";

interface Props {
  context: UploadContext;
  onUploaded?: (urls: string[]) => void;
}

export const DropzoneUploader: React.FC<Props> = ({ context, onUploaded }) => {
  const { upload } = useImageUploader();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("No valid images selected.");
      return;
    }

    toast.loading("Uploading images...", { id: "upload" });

    try {
  const results = await Promise.all(
    acceptedFiles.map((file) => upload(file, context))
  );

  // Filter out undefined results and then map to URLs
  const urls = results
    .filter((res): res is CloudinaryUploadResponse => res !== undefined)
    .map((res) => res.secure_url);

  toast.success("Images uploaded successfully!", { id: "upload" });

  if (onUploaded && urls.length > 0) onUploaded(urls);
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Upload failed";
  toast.error(`Error: ${errorMessage}`, { id: "upload" });
}
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB limit per image
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <ImagePlus className="w-8 h-8 text-blue-500" />
        <p className="text-gray-600">
          {isDragActive ? "Drop files here..." : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-gray-400">(Max 5MB per image)</p>
      </div>
    </div>
  );
};
