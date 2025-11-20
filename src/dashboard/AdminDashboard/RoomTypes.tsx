import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetRoomTypesQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation
} from "../../features/api/roomTypeApi";
import { Plus, Edit, Trash2, X, Check, Search, Building2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { SearchBar } from "../../components/common/SearchBar";
import { roomTypeSchema, type TRoomTypeSelect } from "../../types/roomTypesTypes";

export const RoomTypes = () => {
  const { data: roomTypesData, isLoading, refetch } = useGetRoomTypesQuery();
  const [createRoomType] = useCreateRoomTypeMutation();
  const [updateRoomType] = useUpdateRoomTypeMutation();
  const [deleteRoomType] = useDeleteRoomTypeMutation();

  const roomTypes: RoomType[] = roomTypesData?.map((roomType) => ({
    ...roomType,
    description: roomType.description || "",
  })) || [];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const filteredRoomTypes = roomTypes.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomTypeFormData>({
    resolver: zodResolver(roomTypeSchema),
  });

  const closeDrawer = () => setIsDrawerOpen(false);

  const openCreateDrawer = () => {
    setEditingRoomType(null);
    reset({ name: "", description: "" });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (roomType: RoomType) => {
    setEditingRoomType(roomType.roomTypeId);
    reset({ name: roomType.name, description: roomType.description });
    setIsDrawerOpen(true);
  };

  const onSubmit = async (data: RoomTypeFormData) => {
    try {
      if (editingRoomType) {
        await updateRoomType({ id: editingRoomType, updates: data }).unwrap();
        toast.success("Room type updated successfully");
      } else {
        await createRoomType(data).unwrap();
        toast.success("Room type created successfully");
      }
      closeDrawer();
      refetch();
    } catch (error) {
      toast.error("Something went wrong. Try again.");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteRoomType(id).unwrap();
        toast.success("Room type deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete room type");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeDrawer();
      }
    };
    if (isDrawerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Room Types
                  </h1>
                  <p className="text-gray-600 mt-1">Manage your accommodation categories</p>
                </div>
              </div>
              <button
                onClick={openCreateDrawer}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                Add Room Type
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <SearchBar
                placeholder="Search room types..."
                onSearch={(query) => setSearchQuery(query)}
              />
            </div>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                      {["Name", "Description", "Created", "Actions"].map((header) => (
                        <th key={header} className="px-8 py-4 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse hover:bg-gray-50/50">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="h-4 bg-gray-200 rounded-lg w-48"></div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                            <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                      <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">Name</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">Description</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">Created</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRoomTypes.map((roomType) => (
                      <tr key={roomType.roomTypeId} className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
                              <Building2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-lg">{roomType.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-gray-600 max-w-xs">
                            {roomType.description || (
                              <span className="text-gray-400 italic">No description</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 inline-block">
                            {new Date(roomType.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openEditDrawer(roomType)} 
                              className="group/btn p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                            >
                              <Edit size={18} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                            </button>
                            <button 
                              onClick={() => handleDelete(roomType.roomTypeId)} 
                              className="group/btn p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                            >
                              <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isLoading && filteredRoomTypes.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No room types found</h3>
              <p className="text-gray-600">Try adjusting your search or create a new room type.</p>
            </div>
          )}

          {/* Drawer Overlay */}
          {isDrawerOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
          )}

          {/* Right-side Drawer */}
          <div
            ref={drawerRef}
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingRoomType ? "Edit Room Type" : "Create Room Type"}
                  </h2>
                  <p className="text-indigo-100 mt-1">
                    {editingRoomType ? "Update room type details" : "Add a new room type to your system"}
                  </p>
                </div>
                <button 
                  onClick={closeDrawer} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="e.g., Deluxe Suite, Standard Room"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                        <X size={12} />
                      </div>
                      {errors.name.message}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    className="w-full px-4 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                    placeholder="Describe the room type features and amenities..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Check size={18} />
                    {editingRoomType ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type RoomType = TRoomTypeSelect & {
  description: string;
};

type RoomTypeFormData = z.infer<typeof roomTypeSchema>;