import React from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import {
  Users,
  Heart,
  Loader2,
  Star,
  MapPin,
  Bath,
  BedDouble,
  ImagePlus,
} from "lucide-react";

import Navbar from "../components/common/NavBar";
import { Loading } from "../components/common/Loading";
import { Error } from "../components/common/Error";
import { SuggestedRooms } from "../components/room/SuggestedRooms";
import { useGetRoomWithAmenitiesQuery } from "../features/api";
import { useAddToWishlistMutation } from "../features/api/wishlistApi";
import { parseRTKError } from "../utils/parseRTKError";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/ui/Button";

import type { RootState } from "../app/store";
import type { TRoomWithAmenities } from "../types/roomsTypes";

export const RoomDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    data: roomDetails,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomWithAmenitiesQuery(roomId, {
    skip: isNaN(roomId),
    refetchOnMountOrArgChange: true,
  });

  const [addToWishlist, { isLoading: isWishLoading }] = useAddToWishlistMutation();

  const handleBooking = () => navigate(`/user/checkout/${roomId}`);

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast.error("You need to log in to add to wishlist");
      return;
    }
    try {
      await addToWishlist({ userId: Number(userId), roomId }).unwrap();
      toast.success("Room added to wishlist!");
    } catch (error) {
      const message = parseRTKError(error, "Failed to add to wishlist");
      toast.error(message);
    }
  };

  const getIconComponent = (iconName: string | null | undefined): React.JSX.Element => {
  if (!iconName) {
    return <ImagePlus className="w-5 h-5 text-gray-400" />;
  }
  
  const formatted = iconName
    .replace(/_./g, (match) => match[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
  
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[formatted];
  
  return IconComponent ? (
    <IconComponent className="w-5 h-5" />
  ) : (
    <ImagePlus className="w-5 h-5 text-gray-400" />
  );
};

  if (isRoomLoading) return <Loading />;
  if (isRoomError || !roomDetails) return <Error />;

  const { room, amenities }: TRoomWithAmenities = roomDetails;

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-slate-100 to-slate-200 text-gray-800 font-[Inter]">
        <section className="relative">
          <div className="w-full h-[60vh] sm:h-[70vh] overflow-hidden">
            <img src={room.thumbnail} alt={room.roomType.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-end">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-xl max-w-lg">
              <h1 className="font-[Playfair Display] text-xl sm:text-2xl font-semibold text-slate-900">{room.roomType.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <MapPin size={16} />
                <span>Blue Origin Farms</span>
              </div>
            </div>
            <div className={`mt-4 sm:mt-0 px-4 py-2 rounded-full text-sm font-semibold ${room.isAvailable ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}> 
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${room.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {room.isAvailable ? 'Available Now' : 'Unavailable'}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-semibold text-xl sm:text-2xl text-slate-900">Room Overview</h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      <span>{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble size={18} />
                      <span>{room.roomType.name.includes("King") ? "King Bed" : "Bed"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={18} />
                      <span>Private Bath</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-navy-700">${room.pricePerNight}</div>
                  <div className="text-sm text-slate-500">per night</div>
                </div>
              </div>
              <p className="text-slate-700 text-[14px] leading-relaxed">{room.description}</p>
            </section>

            <section className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-200">
              <h2 className="font-semibold text-xl sm:text-2xl text-slate-900 mb-6">Room Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity.amenityId} className="group flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-gold-50 hover:border-gold-200 transition">
                    <div className="text-navy-600 group-hover:text-gold-600">
                      {getIconComponent(amenity.icon)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{amenity.name}</div>
                      <div className="text-xs text-slate-500">{amenity.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-200">
              <h2 className="font-semibold text-xl sm:text-2xl text-slate-900 mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {room.gallery.slice(0, 6).map((img, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg bg-slate-100 aspect-[4/3] group">
                    <img src={img} alt={`Room Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-900">${room.pricePerNight}</div>
                <div className="text-sm text-slate-500">per night</div>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-slate-600 ml-2">(4.9)</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button onClick={handleBooking} disabled={!room.isAvailable} className="w-full bg-navy-700 hover:bg-navy-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg text-sm uppercase transition">
                  {room.isAvailable ? 'Book Now' : 'Currently Unavailable'}
                </Button>
                <Button onClick={handleAddToWishlist} disabled={isWishLoading} className="w-full border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                  {isWishLoading ? (<><Loader2 className="animate-spin" size={18} />Adding...</>) : (<><Heart size={18} />Save to Wishlist</>)}
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
                Free cancellation up to 24 hours before check-in
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Similar Rooms</h3>
              <SuggestedRooms currentRoomId={roomId} />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};
