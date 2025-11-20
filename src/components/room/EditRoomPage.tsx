// EditRoomPage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2,
  X,
  Upload,
  Image,
  CheckCircle2,
  AlertCircle,
  Camera,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

import { useImageUploader } from "../../hook/useImageUploader";
import { useGetRoomTypesQuery } from "../../features/api/roomTypeApi";
import { useGetAmenitiesQuery } from "../../features/api/amenitiesApi";
import { useUpdateRoomMutation } from "../../features/api/roomsApi";
import type {
  TAmenitySelect,
  TEditRoomForm,
  TRoomTypeSelect,
} from "../../types/roomsTypes";
import { parseRTKError } from "../../utils/parseRTKError";

interface EditRoomPageProps {
  room: TEditRoomForm;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditRoomPage = ({
  room,
  onCancel,
  onSuccess,
}: EditRoomPageProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TEditRoomForm>({
    defaultValues: room,
    mode: "onBlur",
  });

  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useGetRoomTypesQuery();

  const {
    data: amenities,
    isLoading: isAmenitiesLoading,
    isError: isAmenitiesError,
  } = useGetAmenitiesQuery();

  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const { upload, isLoading: isImageLoading } = useImageUploader();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    room.thumbnail
  );
  const [gallery, setGallery] = useState<string[]>(room.gallery || []);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    room.amenities || []
  );

  useEffect(() => {
    if (isRoomTypesError) toast.error("Failed to load room types");
    if (isAmenitiesError) toast.error("Failed to load amenities");
  }, [isRoomTypesError, isAmenitiesError]);

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await upload(file, "room");
      if (result?.secure_url) {
        setValue("thumbnail", result.secure_url);
        toast.success("Thumbnail uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length + gallery.length > 10) {
      toast.error("Maximum 10 gallery images allowed");
      return;
    }

    try {
      for (const file of files) {
        const result = await upload(file, "room-gallery");
        if (result?.secure_url) {
          setGallery((prev) => [...prev, result.secure_url]);
        }
      }
    } catch {
      toast.error("Some images failed to upload");
    }
  };

  const removeGalleryImage = (url: string) => {
    setGallery((prev) => prev.filter((img) => img !== url));
  };

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    reset(room);
    setGallery(room.gallery || []);
    setSelectedAmenities(room.amenities || []);
    setThumbnailPreview(room.thumbnail || null);
  }, [room, reset]);

  const onSubmit = async (data: TEditRoomForm) => {
    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one amenity");
      return;
    }

    try {
      const requestData = {
        roomId: room.roomId,
        roomData: {
          ...data,
          gallery,
          amenities: selectedAmenities,
          pricePerNight: data.pricePerNight, // Ensure this is a number
        },
      };

      await updateRoom(requestData).unwrap();
      toast.success("Room updated successfully");
      onSuccess();
    } catch (error) {
      const errorMessage = parseRTKError(error, "Failed to update room");
      toast.error(errorMessage);
    }
  };

  const isLoading =
    isRoomTypesLoading || isAmenitiesLoading || isUpdating || isImageLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Edit Room
              </h1>
              <p className="text-slate-600 mt-1">
                Update room details and configuration
              </p>
            </div>
            <button
              onClick={onCancel}
              className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-all duration-200 font-medium border border-slate-200/60"
            >
              Cancel
            </button>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Room Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room Type */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("roomTypeId", {
                      required: "Room type is required",
                    })}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none ${
                      errors.roomTypeId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200"
                    }`}
                    disabled={isRoomTypesLoading}
                  >
                    <option value="">Select room type</option>
                    {roomTypes?.map((type: TRoomTypeSelect) => (
                      <option key={type.roomTypeId} value={type.roomTypeId}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.roomTypeId && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.roomTypeId.message}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("capacity", {
                    required: "Capacity is required",
                    min: { value: 1, message: "Minimum capacity is 1" },
                  })}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.capacity
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200"
                  }`}
                  placeholder="Number of guests"
                />
                {errors.capacity && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.capacity.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price Per Night (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    {...register("pricePerNight", {
                      required: "Price is required",
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                    })}
                    className={`w-full pl-8 pr-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                      errors.pricePerNight
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.pricePerNight && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.pricePerNight.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={4}
                  placeholder="Describe the room features, amenities, and unique selling points..."
                />
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Room Images
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Main Thumbnail <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={isImageLoading}
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        isImageLoading
                          ? "border-slate-300 bg-slate-50 cursor-not-allowed"
                          : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                      }`}
                    >
                      {isImageLoading ? (
                        <div className="flex items-center gap-3 text-slate-500">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600 font-medium">
                            Click to upload thumbnail
                          </p>
                          <p className="text-slate-400 text-sm mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>

                  {thumbnailPreview && (
                    <div className="relative inline-block">
                      <div className="relative h-48 w-72 rounded-xl overflow-hidden border-2 border-slate-200">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailPreview(null);
                          setValue("thumbnail", "");
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Gallery Images
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                      id="gallery-upload"
                      disabled={isImageLoading}
                    />
                    <label
                      htmlFor="gallery-upload"
                      className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        isImageLoading
                          ? "border-slate-300 bg-slate-50 cursor-not-allowed"
                          : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="text-center">
                        <Image className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600 font-medium text-sm">
                          Add gallery images
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          Max 10 images • Recommended: 1200x800px
                        </p>
                      </div>
                    </label>
                  </div>

                  {gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.map((url, index) => (
                        <div key={url} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200">
                            <img
                              src={url}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              alt={`Gallery ${index + 1}`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(url)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Amenities
              </h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Select Amenities <span className="text-red-500">*</span>
              </label>

              {isAmenitiesLoading ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <Loader2 className="animate-spin w-6 h-6 mr-3" />
                  <span className="font-medium">Loading amenities...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenities?.map((amenity: TAmenitySelect) => (
                    <button
                      key={amenity.amenityId}
                      type="button"
                      onClick={() => toggleAmenity(amenity.amenityId)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                        selectedAmenities.includes(amenity.amenityId)
                          ? "bg-purple-100 border-purple-300 text-purple-800 shadow-md"
                          : "bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{amenity.name}</span>
                        {selectedAmenities.includes(amenity.amenityId) && (
                          <CheckCircle2 className="w-4 h-4 text-purple-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedAmenities.length === 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Please select at least one amenity
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Availability & Actions Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="p-6">
              {/* Availability Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("isAvailable")}
                      className="sr-only"
                    />
                    <div className="w-12 h-6 bg-slate-300 rounded-full transition-colors duration-200 group-hover:bg-slate-400">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 translate-x-0.5 translate-y-0.5"></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700">
                      Available for booking
                    </span>
                    <p className="text-xs text-slate-500">
                      Toggle room availability for guests
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>
                        {isImageLoading ? "Uploading..." : "Saving..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
