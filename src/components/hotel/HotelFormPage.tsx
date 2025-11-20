import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  hotelFormSchema,
  type HotelFormData,
} from "../../validation/hotelFormSchema";
import {
  Hotel,
  MapPin,
  UploadCloud,
  X,
  Star,
  Phone,
  Text,
  Wifi,
  ParkingCircle,
  Dumbbell,
  Utensils,
  Snowflake,
  Tv,
  Waves,
  Droplets,
  Coffee,
} from "lucide-react";
import Cropper from "react-easy-crop";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { dataURLtoFile } from "../../utils/imageUploadUtils";
import { useImageUploader } from "../../hook/useImageUploader";
import { useGetAmenitiesQuery } from "../../features/api/amenitiesApi";

type Area = { width: number; height: number; x: number; y: number };
type HotelFormPageProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<HotelFormData>;
  onSubmit: (data: HotelFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

function getCroppedImg(imageSrc: string, crop: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = () => reject("Image load failed");
  });
}

export const HotelFormPage = ({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: HotelFormPageProps) => {
  const { upload } = useImageUploader();
  const { data: amenities, isLoading: amenitiesLoading, error: amenitiesError } = useGetAmenitiesQuery();

  const fallbackUrl =
    "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [previewUrl, setPreviewUrl] = useState<string>(
    defaultValues?.thumbnail || fallbackUrl
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    defaultValues?.gallery || []
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<
    "thumbnail" | "gallery"
  >("thumbnail");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      contactPhone: "",
      category: "",
      thumbnail: "",
      amenities: [],
      gallery: [],
      ...defaultValues,
    },
  });

  const selectedAmenities = watch("amenities") || [];

  const toggleAmenity = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setValue(
        "amenities",
        selectedAmenities.filter((id) => id !== amenityId)
      );
    } else {
      setValue("amenities", [...selectedAmenities, amenityId]);
    }
  };

  const onCropComplete = useCallback((_: unknown, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageDrop = (
    acceptedFiles: File[],
    type: "thumbnail" | "gallery"
  ) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setCurrentUploadType(type);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempImage(reader.result);
        setIsCropping(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const finishCropping = async () => {
    if (tempImage && croppedAreaPixels) {
      try {
        const cropped = await getCroppedImg(tempImage, croppedAreaPixels);
        const croppedFile = dataURLtoFile(cropped, "hotel-image.jpeg");

        toast.loading("Uploading image...", { id: "upload-toast" });

        const uploaded = await upload(croppedFile, "hotel");

        if (!uploaded?.secure_url) {
          toast.error("Upload failed", { id: "upload-toast" });
          return;
        }

        toast.success("Image uploaded!", { id: "upload-toast" });

        if (currentUploadType === "thumbnail") {
          setValue("thumbnail", uploaded.secure_url);
          setPreviewUrl(uploaded.secure_url);
        } else {
          const newGallery = [...(watch("gallery") || []), uploaded.secure_url];
          setValue("gallery", newGallery);
          setGalleryPreviews(newGallery);
        }

        setIsCropping(false);
      } catch (error) {
        console.error("Cropping/upload error:", error);
        toast.error("Image upload failed", { id: "upload-toast" });
      }
    }
  };

  const removeImage = (type: "thumbnail" | "gallery", index?: number) => {
    if (type === "thumbnail") {
      setPreviewUrl(fallbackUrl);
      setValue("thumbnail", "");
    } else if (index !== undefined) {
      const updatedGallery = [...galleryPreviews];
      updatedGallery.splice(index, 1);
      setGalleryPreviews(updatedGallery);
      setValue("gallery", updatedGallery);
    }
  };

  const renderAmenityIcon = (icon: string | null) => {
    if (!icon) return null;

    const iconMap: Record<string, React.JSX.Element> = {
      wifi: <Wifi className="w-4 h-4 mr-1" />,
      parking: <ParkingCircle className="w-4 h-4 mr-1" />,
      gym: <Dumbbell className="w-4 h-4 mr-1" />,
      restaurant: <Utensils className="w-4 h-4 mr-1" />,
      ac: <Snowflake className="w-4 h-4 mr-1" />,
      tv: <Tv className="w-4 h-4 mr-1" />,
      pool: <Waves className="w-4 h-4 mr-1" />,
      shower: <Droplets className="w-4 h-4 mr-1" />,
      breakfast: <Coffee className="w-4 h-4 mr-1" />,
    };

    return iconMap[icon] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {mode === "create" ? "Add New Hotel" : "Edit Hotel"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Thumbnail Image */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Thumbnail Image</h2>
            <div className="relative border border-dashed border-gray-300 rounded-lg p-4">
              {isCropping && tempImage && currentUploadType === "thumbnail" ? (
                <div className="relative h-64 bg-black rounded-xl overflow-hidden">
                  <Cropper
                    image={tempImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 2}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div className="absolute bottom-2 right-2 z-10 flex gap-2">
                    <button
                      type="button"
                      onClick={finishCropping}
                      className="btn btn-primary btn-sm"
                    >
                      Crop & Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCropping(false)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Dropzone
                  onDrop={(files) => handleImageDrop(files, "thumbnail")}
                  accept={{ "image/*": [] }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="cursor-pointer text-gray-500 hover:text-blue-600"
                    >
                      <input {...getInputProps()} />
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover object-center rounded mb-2"
                      />
                      <div className="flex justify-center items-center gap-2 text-sm">
                        <UploadCloud className="w-4 h-4" />
                        <span>Drag and drop or click to upload thumbnail</span>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
              {previewUrl !== fallbackUrl && (
                <button
                  type="button"
                  onClick={() => removeImage("thumbnail")}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Hotel Gallery */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Hotel Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryPreviews.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("gallery", index)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <Dropzone
                  onDrop={(files) => handleImageDrop(files, "gallery")}
                  accept={{ "image/*": [] }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="cursor-pointer text-gray-500 hover:text-blue-600 text-center"
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">Add Image</span>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hotel className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
                  <input
                    {...register("name")}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    placeholder="Enter hotel name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
                  <input
                    {...register("location")}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    placeholder="Enter location"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
                  <input
                    {...register("contactPhone")}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
                  <select
                    {...register("category")}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 appearance-none"
                  >
                    <option value="">Select category</option>
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Boutique">Boutique</option>
                    <option value="Resort">Resort</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <div className="relative">
                <Text className="absolute left-3 top-3.5 text-blue-600 w-5 h-5" />
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  placeholder="Enter hotel description"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Amenities</h2>
            {amenitiesLoading ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : amenitiesError ? (
              <div className="text-red-500 text-center">
                Error loading amenities
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {amenities?.map((amenity: { amenityId: number; icon: string | null; name: string ; }) => (
                  <div key={amenity.amenityId} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.amenityId}`}
                      checked={selectedAmenities.includes(amenity.amenityId)}
                      onChange={() => toggleAmenity(amenity.amenityId)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`amenity-${amenity.amenityId}`}
                      className="ml-2 text-gray-700 flex items-center"
                    >
                      {renderAmenityIcon(amenity.icon)}
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline btn-error"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-white"
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Hotel"
                : "Update Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};