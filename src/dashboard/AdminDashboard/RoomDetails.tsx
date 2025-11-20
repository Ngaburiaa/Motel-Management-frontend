import {
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  ArrowLeft,
  DollarSign,
  Users,
  MapPin,
  ImagePlus,
  Star,
  Calendar,
  Eye,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteRoomMutation,
  useGetRoomWithAmenitiesQuery,
} from "../../features/api/roomsApi";
import { Loading } from "../../components/common/Loading";
import { Error } from "../../components/common/Error";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { parseRTKError } from "../../utils/parseRTKError";
import { EditRoomPage } from "../../components/room/EditRoomPage";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const MySwal = withReactContent(Swal);

export const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const {
    data: roomDetails,
    isLoading,
    isError,
    refetch,
  } = useGetRoomWithAmenitiesQuery(roomId, {
    skip: !roomId,
    refetchOnMountOrArgChange: true,
  });

  const [deleteRoom] = useDeleteRoomMutation();

  const handleDelete = async () => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        toast.loading("Deleting room...");
        await deleteRoom(roomId).unwrap();
        toast.dismiss();
        toast.success("Room deleted successfully!");
        navigate("/admin/rooms");
      }
    } catch (error) {
      const errorMessage = parseRTKError(
        error,
        "Action failed. Please try again."
      );
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !roomDetails) {
    toast.error("Failed to load room details.");
    return <Error />;
  }

  const { room, amenities } = roomDetails;

  const getIconComponent = (iconName: string | null | undefined): React.JSX.Element => {
  if (!iconName) {
    return <ImagePlus className="w-5 h-5 text-gray-400" />;
  }

  const formatted = iconName
    .replace(/_./g, (match) => match[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());

  const IconComponent = (
    LucideIcons as unknown as Record<string, LucideIcon>
  )[formatted];

  return IconComponent ? (
    <IconComponent className="w-5 h-5" />
  ) : (
    <ImagePlus className="w-5 h-5 text-gray-400" />
  );
};

  if (isEditing) {
    return (
      <EditRoomPage
        room={{
          ...room,
          amenities: amenities.map((a) => a.amenityId),
          roomTypeId: room.roomType.roomTypeId,
        }}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          refetch();
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
    >
      {/* Enhanced Header with Breadcrumb */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold text-sm sm:text-base">
                  Back to Rooms
                </span>
              </button>

              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Room Management</span>
                <span>/</span>
                <span className="text-blue-600 font-medium">
                  {room.roomType.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                <Pencil className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                Edit Room
              </button>
              <button
                onClick={handleDelete}
                className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Left Content */}
          <div className="xl:col-span-8 space-y-10">
            {/* Hero Image */}
            {room.gallery?.[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative group rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50"
              >
                <img
                  src={room.gallery[0]}
                  alt="Room Thumbnail"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={() => setModalImage(room.gallery[0])}
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View Full Image Button */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-sm font-medium shadow-lg hover:bg-white transition-colors">
                    <Eye className="w-4 h-4" />
                    View Full Size
                  </button>
                </div>
              </motion.div>
            )}

            {/* Room Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                    Premium Room Collection
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                  {room.roomType.name}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Available for booking</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg prose-gray max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {room.description}
                </p>
              </div>
            </motion.div>

            {/* Gallery Section */}
            {room.gallery?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Room Gallery
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {room.gallery.length} photos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {room.gallery.map((url, index) => (
                    <motion.div
                      layoutId={`image-${index}`}
                      key={index}
                      whileHover={{ y: -5 }}
                      className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                      onClick={() => setModalImage(url)}
                    >
                      <img
                        src={url}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 space-y-8">
            {/* Pricing Card */}
            {/* Pricing Card - now static */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-5xl font-bold text-gray-900 flex items-baseline">
                    <DollarSign className="w-8 h-8 text-gray-600 self-start" />
                    {room.pricePerNight}
                    <span className="text-xl font-normal text-gray-600 ml-2">
                      / night
                    </span>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    room.isAvailable
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.isAvailable ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Available Now
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Currently Unavailable
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      Guest Capacity
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Amenities Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Amenities</h3>
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                  {amenities.length} included
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {amenities.length > 0 ? (
                  amenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 transition-all duration-300 rounded-xl cursor-pointer border border-transparent hover:border-blue-200"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-white group-hover:bg-blue-100 rounded-xl shadow-sm transition-colors duration-300">
                        <div className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                          {getIconComponent(amenity.icon)}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {amenity.name}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No amenities listed
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-6xl max-h-[90vh] w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Full size preview"
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />

              {/* Close button */}
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
