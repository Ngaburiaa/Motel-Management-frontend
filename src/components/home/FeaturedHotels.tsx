import React, { useState } from "react";
import { MapPin, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useGetHotelsQuery } from "../../features/api";
import { useNavigate } from "react-router-dom";
import type { THotel } from "../../types/hotelsTypes";

export const FeaturedHotels: React.FC = () => {
  const [favoritehotels, setFavoritehotels] = useState<Set<number>>(new Set());
  const { data: hotels = [], isLoading, isError } = useGetHotelsQuery();
  const navigate = useNavigate();

  const toggleFavorite = (hotelId: number) => {
    const newFavorites = new Set(favoritehotels); // this is fine

    if (newFavorites.has(hotelId)) {
      newFavorites.delete(hotelId);
    } else {
      newFavorites.add(hotelId);
    }

    setFavoritehotels(newFavorites); // this is the actual effect
  };

  const skeletons = Array.from({ length: 6 });

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Featured <span className="text-blue-600">hotels</span>
          </h2>
          <p className="text-lg text-gray-600">
            Explore compact luxury options designed to impress.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading &&
            skeletons.map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="h-48 bg-gray-200 w-full" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}

          {!isLoading &&
            !isError &&
            hotels.map((hotel: THotel) => (
              <motion.div
                key={hotel.hotelId}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/hotel/${hotel.hotelId}`)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.thumbnail}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation on heart click
                      toggleFavorite(hotel.hotelId);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${
                      favoritehotels.has(hotel.hotelId)
                        ? "bg-red-600 text-white"
                        : "bg-white/30 text-white hover:bg-white/60"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favoritehotels.has(hotel.hotelId) ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  {/* Rating badge */}
                  {hotel.rating && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {Number(hotel.rating).toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hotel.location}
                  </div>

                  {hotel.category && (
                    <div className="inline-block text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                      {hotel.category}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

          {isError && (
            <div className="col-span-full text-center text-red-600 py-8">
              Failed to load hotels. Please try again later.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
