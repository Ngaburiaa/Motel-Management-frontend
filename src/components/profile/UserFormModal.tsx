import React, { useEffect, useState } from "react";
import { User, FileText, X, Save, Camera, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useImageUploader } from "../../hook/useImageUploader";
import toast from "react-hot-toast";
import type { TUserFormValues } from "../../types/usersTypes";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TUserFormValues) => void;
  defaultValues: TUserFormValues;
}

export const UserFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TUserFormValues>();

  const { upload, isLoading: isUploading } = useImageUploader();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const profileImage = watch("profileImage");

  useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues);
      setPreviewImage(defaultValues.profileImage || null);
    }
  }, [isOpen, defaultValues, reset]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      const result = await upload(file, "userProfile");
      if (!result) {
        toast.error("Upload failed. Please try again.");
        setPreviewImage(null);
        return;
      }
      setValue("profileImage", result?.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setPreviewImage(null);
    }
  };

  const handleFormSubmit = (data: TUserFormValues) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    setPreviewImage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                    <p className="text-indigo-100 text-sm">Update your personal information</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  disabled={isSubmitting || isUploading}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Profile Image Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 border-2 border-gray-300">
                        {previewImage || profileImage ? (
                          <img
                            src={previewImage || profileImage}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isUploading || isSubmitting}
                        />
                        <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
                          <Camera className="w-4 h-4 mr-2" />
                          {isUploading ? "Uploading..." : "Change Photo"}
                        </div>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      First Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register("firstName", { 
                        required: "First name is required",
                        minLength: { value: 2, message: "First name must be at least 2 characters" }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.firstName ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                      placeholder="Enter your first name"
                      disabled={isSubmitting || isUploading}
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm flex items-center">
                        <span className="w-4 h-4 mr-1">⚠</span>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Last Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register("lastName", { 
                        required: "Last name is required",
                        minLength: { value: 2, message: "Last name must be at least 2 characters" }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.lastName ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                      placeholder="Enter your last name"
                      disabled={isSubmitting || isUploading}
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm flex items-center">
                        <span className="w-4 h-4 mr-1">⚠</span>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    Bio
                  </label>
                  <textarea
                    {...register("bio", {
                      maxLength: { value: 500, message: "Bio must be less than 500 characters" }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                      errors.bio ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    rows={4}
                    placeholder="Tell us about yourself (optional)"
                    disabled={isSubmitting || isUploading}
                  />
                  {errors.bio && (
                    <p className="text-red-600 text-sm flex items-center">
                      <span className="w-4 h-4 mr-1">⚠</span>
                      {errors.bio.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {watch("bio")?.length || 0}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={isSubmitting || isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};