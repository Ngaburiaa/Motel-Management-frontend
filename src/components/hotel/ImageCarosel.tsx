import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const images = [
  "https://media.istockphoto.com/id/1418701619/photo/hotel-sign-on-building-facade-in-city-business-travel-and-tourism.jpg?s=612x612&w=0&k=20&c=W9UcZTYo3f8fTaiU_4xqfVSBOQRna-Pm-Prw3k54kyM=",
  "https://media.istockphoto.com/id/487042276/photo/hotel-sign.jpg?s=612x612&w=0&k=20&c=DjEVAoFnjB2cWwX28cxSKWkxsbze7o9jgkYrhyfmq9E=",
  "https://media.istockphoto.com/id/1023168228/photo/luxury-hotel-reception.jpg?s=612x612&w=0&k=20&c=xi_nHf2yKPoTnbD0Tzy2AmLTLRSa6-S8VGMqC8ypUBo="
];

export const ImageCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="relative h-[75vh] w-full overflow-hidden rounded-b-3xl shadow-xl bg-black">
      {/* Carousel Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={images[index]}
            alt="Luxury Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white max-w-4xl space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-wide">
            Escape Into&nbsp;
            <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
              Luxury
            </span>
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl font-light leading-relaxed">
            Experience unforgettable stays in top-rated hotels that combine elegance, comfort, and world-class hospitality.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
              <Star size={16} className="fill-current" />
              5-Star Quality Guaranteed
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-amber-400 ring-2 ring-amber-500 scale-110 shadow-md"
                : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
