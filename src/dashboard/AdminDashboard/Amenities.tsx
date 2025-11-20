import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  amenitySchema,
  type AmenityFormValues,
  type TAmenitySelect,
} from "../../types/amenities.schema";
import {
  useCreateAmenityMutation,
  useDeleteAmenityMutation,
  useGetAmenitiesQuery,
  useUpdateAmenityMutation,
} from "../../features/api/amenitiesApi";
import * as LucideIcons from "lucide-react";
import {
  Trash2,
  PencilLine,
  Plus,
  X,
  XCircle,
  type LucideIcon,
  Building2,
  Search,
  Calendar,
  ImagePlus,
} from "lucide-react";
import { SearchBar } from "../../components/common/SearchBar";
import { parseRTKError } from "../../utils/parseRTKError";

const MySwal = withReactContent(Swal);

const getIconComponent = (
  iconName: string | null | undefined
): React.JSX.Element => {
  if (!iconName) {
    return <ImagePlus className="w-5 h-5 text-gray-400" />;
  }

  const formatted = iconName
    .replace(/_./g, (match) => match[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());

  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[
    formatted
  ];

  return IconComponent ? (
    <IconComponent className="w-5 h-5" />
  ) : (
    <ImagePlus className="w-5 h-5 text-gray-400" />
  );
};

export const Amenities = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<TAmenitySelect | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: amenities, isLoading, isError } = useGetAmenitiesQuery();
  const [createAmenity] = useCreateAmenityMutation();
  const [updateAmenity] = useUpdateAmenityMutation();
  const [deleteAmenity] = useDeleteAmenityMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  const iconName = watch("icon");

  const showDrawer = (amenity: TAmenitySelect | null = null) => {
    setEditingAmenity(amenity);
    reset({
      name: amenity?.name || "",
      description: amenity?.description || "",
      icon: amenity?.icon || "",
    });
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
    setEditingAmenity(null);
  };

  const onSubmit = async (values: AmenityFormValues) => {
    try {
      if (editingAmenity) {
        await updateAmenity({
          id: editingAmenity.amenityId,
          data: values,
        }).unwrap();
        toast.success("Amenity updated successfully");
      } else {
        await createAmenity(values).unwrap();
        toast.success("Amenity created successfully");
      }
      onClose();
    } catch (err) {
      const errorMessage = parseRTKError(
        err,
        "Something went wrong. Please try again."
      );
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAmenity(id).unwrap();
        toast.success("Amenity deleted successfully");
      } catch (err) {
        const errorMessage = parseRTKError(
          err,
          "Something went wrong. Please try again."
        );
        toast.error(errorMessage);
      }
    }
  };

  const filteredAmenities = amenities?.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (amenity.description ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Amenities Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your property amenities and features
                </p>
              </div>
            </div>
            <button
              onClick={() => showDrawer()}
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Amenity</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <SearchBar
              placeholder="Search amenities by name or description..."
              onSearch={setSearchQuery}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">
                Error loading amenities
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded-lg w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded-lg"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Amenities Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAmenities?.map((amenity) => (
              <div
                key={amenity.amenityId}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-300/25 transition-all duration-300 hover:border-indigo-200 hover:-translate-y-1"
              >
                {/* Icon and Title */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors duration-300">
                    {getIconComponent(amenity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {amenity.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-1 rounded-full font-mono">
                        {amenity.icon}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {amenity.description || (
                      <span className="italic text-gray-400">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(amenity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => showDrawer(amenity)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      title="Edit amenity"
                    >
                      <PencilLine className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(amenity.amenityId)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete amenity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAmenities?.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No matching amenities found" : "No amenities yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first amenity"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => showDrawer()}
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Amenity</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <div
        className={`fixed top-0 right-0 w-full max-w-lg h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10"
            onClick={onClose}
          />
        )}

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-600 px-6 py-5 text-white rounded-tr-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pr-12">
              <h3 className="text-xl font-semibold mb-1">
                {editingAmenity ? "Edit Amenity" : "Create New Amenity"}
              </h3>
              <p className="text-sm text-indigo-100">
                {editingAmenity
                  ? "Update amenity details"
                  : "Add a new amenity to your property"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Amenity Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="e.g., Swimming Pool, Gym, WiFi"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                  placeholder="Describe what this amenity offers..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    <span>{errors.description.message}</span>
                  </p>
                )}
              </div>

              {/* Icon Input Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Icon *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("icon")}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="e.g., Wifi, Dumbbell, Waves"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-md">
                    {getIconComponent(iconName)}
                  </div>
                </div>
                {errors.icon && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    <span>{errors.icon.message}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Use Lucide icon names (e.g., Wifi, Car, Coffee)
                </p>
              </div>

              {/* Icon Preview */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    {getIconComponent(iconName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Icon Preview
                    </p>
                    <p className="text-xs text-gray-500">
                      This is how your icon will appear
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-[1.02]"
                >
                  {editingAmenity ? "Update Amenity" : "Create Amenity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
