import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Loading } from "../components/common/Loading";
import { useGetHotelFullDetailsQuery } from "../features/api/hotelsApi";
import { useGetRoomByHotelIdQuery } from "../features/api/roomsApi";
import { RoomCard } from "../components/room/RoomCard";
import { ArrowRight, ImagePlus, MapPin, Star, X } from "lucide-react";
import { SimilarHotelsSidebar } from "../components/hotel/SimilarHotelsSidebar";
import { Footer } from "../components/common/Footer";
import Navbar from "../components/common/NavBar";
import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";

export const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hotelId = Number(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: hotelResponse,
    isLoading: isLoadingHotelDetails,
    isError: isErrorHotelDetails,
  } = useGetHotelFullDetailsQuery(hotelId);

  const {
    data: hotelRoomsData,
    isLoading: isLoadingHotelRoomsData,
    isError: isErrorHotelRoomsData,
  } = useGetRoomByHotelIdQuery(hotelId);

  if (isLoadingHotelDetails || isLoadingHotelRoomsData) return <Loading />;
  if (isErrorHotelDetails || isErrorHotelRoomsData)
    return (
      <div className="text-red-500 p-6 bg-white min-h-screen">
        Error loading data
      </div>
    );

  const hotelDetails = hotelResponse?.data;
  const hotel = hotelDetails?.hotel;
  const address = hotelDetails?.address;
  const amenities = hotelDetails?.amenities || [];
  const rooms = hotelRoomsData || [];

  if (!hotel)
    return (
      <div className="text-gray-600 p-6 bg-white min-h-screen">
        Hotel not found
      </div>
    );

  const displayedRooms = rooms.slice(0, 2);

  const openImageModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 font-inter">
        {/* Hero Section */}
        <div className="relative h-[26rem] w-full shadow-2xl overflow-hidden rounded-b-3xl">
          {hotel.thumbnail && (
            <img
              src={hotel.thumbnail}
              alt={hotel.name}
              className="absolute inset-0 w-full h-full object-cover blur-[1px] "
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
          <div className="relative z-10 h-full flex flex-col justify-end px-8 py-10 max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-2 animate-slide-up">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90 animate-slide-up-delay">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{hotel.rating}</span>
              </div>
              <span className="text-white/60">|</span>
              <span>{hotel.category}</span>
              <span className="text-white/60">|</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* About Section */}
            <section className="animate-fade-in-up">
              <h2 className="text-2xl font-semibold font-playfair text-blue-600 mb-3 border-b border-blue-100 pb-2">
                About this Hotel
              </h2>
              <p className="text-gray-700 text-sm leading-loose bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                {hotel.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="animate-fade-in-up-delay">
              <h2 className="text-2xl font-semibold font-playfair text-blue-600 mb-4 border-b border-blue-100 pb-2">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={amenity.amenityId}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur rounded-xl border border-blue-200 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in-scale"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-lg text-blue-600">
                      {getIconComponent(amenity.icon)}
                    </span>
                    <span className="text-sm text-gray-800 font-medium">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            {Array.isArray(hotel.gallery) && hotel.gallery.length > 0 && (
              <section className="animate-fade-in-up-delay-2">
                <h2 className="text-2xl font-semibold font-playfair text-blue-600 mb-4 border-b border-blue-100 pb-2">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {hotel.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-scale"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => openImageModal(image)}
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rooms */}
            {displayedRooms.length > 0 && (
              <section className="animate-fade-in-up-delay-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold font-playfair text-blue-600 border-b border-blue-100 pb-2">
                    Available Rooms
                  </h2>
                  {rooms.length > 3 && (
                    <button
                      onClick={() => navigate(`/hotel/${hotelId}/rooms`)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 px-4 py-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-300"
                    >
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-5">
                  {displayedRooms.map((room, index) => (
                    <div
                      key={room.roomId}
                      className="w-full md:w-[48%] lg:w-[32%] animate-fade-in-scale"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <aside className="lg:col-span-4 space-y-6 animate-fade-in-up-delay-4">
            {address && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold font-playfair text-blue-800">
                    Location
                  </h2>
                </div>
                <address className="text-sm text-gray-700 leading-relaxed not-italic">
                  <p className="font-medium text-gray-900">{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </address>
              </div>
            )}

            {/* Similar Hotels */}
            <div className="animate-fade-in-up-delay-5">
              <SimilarHotelsSidebar currentHotelId={hotelId} />
            </div>
          </aside>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
            onClick={closeImageModal}
          >
            <div className="relative max-w-4xl max-h-[90vh] mx-4 animate-scale-in">
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Gallery Image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.6s ease-out 0.4s both;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.6s ease-out 0.6s both;
        }
        
        .animate-fade-in-up-delay-4 {
          animation: fade-in-up 0.6s ease-out 0.8s both;
        }
        
        .animate-fade-in-up-delay-5 {
          animation: fade-in-up 0.6s ease-out 1s both;
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.5s ease-out both;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
      </div>
      <Footer />
    </>
  );
};
