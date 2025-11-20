import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload, Check, Loader2 } from "lucide-react";
import { type FormData } from "./types";

interface ThumbnailUploadProps {
  onUpload: (file: File, context: "thumbnail") => void;
  isUploading: boolean;
}

export const ThumbnailUpload = ({ onUpload, isUploading }: ThumbnailUploadProps) => {
  const { getValues } = useFormContext<FormData>();
  const [isDragging, setIsDragging] = useState(false);
  const thumbnail = getValues("thumbnail");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file, "thumbnail");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, "thumbnail");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[20px] font-semibold font-playfair text-slate-800">
          Upload Thumbnail
        </h2>
        <p className="text-[14px] font-medium text-slate-500">
          Choose a stunning main image for your room
        </p>
      </div>

      {!thumbnail ? (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 shadow-sm ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
          } ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => !isUploading && setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={!isUploading ? { scale: 1.01 } : {}}
        >
          {isUploading ? (
            <Loader2 className="w-14 h-14 text-slate-400 mx-auto mb-4 animate-spin" />
          ) : (
            <Upload className="w-14 h-14 text-slate-400 mx-auto mb-4" />
          )}
          <h3 className="text-[16px] font-semibold text-slate-700 mb-2">
            {isUploading ? "Uploading image..." : "Drop your image here, or browse"}
          </h3>
          <p className="text-[12px] text-slate-500 mb-6">
            Supports: JPG, PNG, WebP (Max 10MB)
          </p>
          <label className={`inline-flex items-center  gap-2 px-6 py-2 rounded-md text-[14px] font-semibold uppercase shadow ${
            isUploading 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-navy text-white hover:bg-navy/90 cursor-pointer"
          }`}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Upload className="w-4 h-4 text-primary" />
            )}{" "}
            <span className="text-primary">Choose File</span>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="relative group">
            <img
              src={thumbnail}
              alt="Thumbnail Preview"
              className="w-full h-64 object-cover rounded-xl shadow-md"
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                <label className="flex items-center gap-2 px-6 py-2 bg-white text-slate-700 rounded-md text-[14px] font-medium cursor-pointer hover:bg-slate-100 shadow">
                  <Upload className="w-4 h-4" /> Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-green-600 font-medium text-[14px] flex items-center justify-center gap-1">
              <Check className="w-4 h-4" /> Thumbnail uploaded successfully
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};