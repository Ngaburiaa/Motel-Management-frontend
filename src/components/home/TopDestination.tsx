import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const TopDestinations = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container || isHovered) return;

      const scrollAmount = 240;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const cities = [
    {
      name: "Maldives",
      image:
        "https://images.unsplash.com/photo-1576669809488-efd1f951f6a4?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Santorini",
      image:
        "https://images.unsplash.com/photo-1506023914709-837ff59e39b5?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Swiss Alps",
      image:
        "https://images.unsplash.com/photo-1616699001726-98ff5c7311cf?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Dubai",
      image:
        "https://images.unsplash.com/photo-1619188746076-56d50795f993?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Bali",
      image:
        "https://images.unsplash.com/photo-1600334129128-00a8bb3e3d75?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Paris",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleNavigate = (cityName: string) => {
    const formatted = cityName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/destinations/${formatted}`);
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-20 px-4 md:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
          Discover <span className="text-yellow-600">Top Destinations</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-700 mb-12 max-w-2xl mx-auto">
          Find elegance, culture, and world-class experiences in these iconic getaways.
        </p>

        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex lg:grid overflow-x-auto lg:overflow-x-visible scroll-smooth snap-x snap-mandatory gap-6 px-2 lg:px-0 lg:grid-cols-6"
        >
          {cities.map((city, index) => (
            <motion.div
              key={index}
              onClick={() => handleNavigate(city.name)}
              className="relative group flex-shrink-0 snap-center min-w-[180px] sm:min-w-[200px] lg:min-w-0 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-32 sm:h-36 object-cover"
              />

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="text-white font-medium text-sm sm:text-base bg-yellow-600 px-4 py-1 rounded-full shadow-md hover:bg-yellow-700 transition">
                  Explore {city.name}
                </div>
              </motion.div>

              <div className="py-3 text-center text-slate-800 font-semibold text-sm sm:text-base z-10 relative">
                {city.name}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="block lg:hidden text-sm text-slate-600 mt-4">
          Swipe to explore more →
        </div>
      </motion.div>
    </section>
  );
};
