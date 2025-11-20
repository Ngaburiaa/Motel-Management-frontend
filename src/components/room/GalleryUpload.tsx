import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload, Plus, X, Loader2 } from "lucide-react";
import { type FormData } from "./types";

interface GalleryUploadProps {
  onUpload: (file: File, context: "gallery") => void;
  isUploading: boolean;
}

export const GalleryUpload = ({ onUpload, isUploading }: GalleryUploadProps) => {
  const { getValues, setValue } = useFormContext<FormData>();
  const gallery = getValues("gallery");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        onUpload(file, "gallery");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => onUpload(file, "gallery"));
    }
  };

  const removeImage = (index: number) => {
    if (isUploading) return;
    setValue(
      "gallery",
      gallery.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[20px] font-semibold font-playfair text-slate-800">
          Gallery Images
        </h2>
        <p className="text-[14px] font-medium text-slate-500">
          Add more photos to showcase your room
        </p>
      </div>

      <motion.div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 shadow-sm ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
        } ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => !isUploading && setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={!isUploading ? { scale: 1.01 } : {}}
      >
        {isUploading ? (
          <Loader2 className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-spin" />
        ) : (
          <Plus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        )}
        <h3 className="text-[16px] font-semibold text-slate-700 mb-1">
          {isUploading ? "Uploading images..." : "Add Gallery Images"}
        </h3>
        <p className="text-[12px] text-slate-500 mb-4">
          Multiple images allowed - drag & drop or browse
        </p>
        <label className={`inline-flex items-center gap-2 px-6 py-2 rounded-md text-[14px] font-semibold uppercase shadow ${
          isUploading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-navy text-white hover:bg-navy/90 cursor-pointer"
        }`}>
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Upload className="w-4 h-4 text-primary" />
          )}{" "}
           <span className="text-primary">Choose Files</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </motion.div>

      {gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h3 className="text-[16px] font-semibold text-slate-800 mb-1">
              Gallery Images ({gallery.length})
            </h3>
            <p className="text-[12px] text-slate-500">
              {isUploading ? "Upload in progress..." : "Click the × button to remove any image"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((url, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={!isUploading ? { scale: 1.03 } : {}}
              >
                <img
                  src={url}
                  alt={`Gallery Image ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                {!isUploading && (
                  <motion.button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};