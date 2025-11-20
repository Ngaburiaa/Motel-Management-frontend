// pages/HotelsPage.tsx
import { useEffect } from "react";
import HotelCard from "../components/hotel/HotelCard";
import NavBar from "../components/common/NavBar";
import Sections from "../components/common/Sections";
import { useGetHotelsQuery } from "../features/api";
import type { THotel } from "../types/hotelsTypes";
import { Error } from "../components/common/Error";
import { Loading } from "../components/common/Loading";
import { parseRTKError } from "../utils/parseRTKError";
import { NoData } from "../components/common/NoData";
import { ImageCarousel } from "../components/hotel/ImageCarosel";
import { Footer } from "../components/common/Footer";

export const HotelsPage = () => {
  const {
    data: hotelsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetHotelsQuery();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  if (isLoading || isFetching) return <Loading />;

  if (error) {
    const errorMessage = parseRTKError(error, "Failed to fetch hotels.");
    return <Error message={errorMessage} />;
  }

  if (!hotelsData || hotelsData.length === 0) {
    return (
      <NoData
        title="No hotels found"
        subtitle="Please check back later or adjust your filters."
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen text-neutral-800 font-sans">
      <NavBar />
      <ImageCarousel />

      <Sections
        title="Featured Hotels"
        subtitle="Luxury is where your peace is at"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-8 py-12 max-w-7xl md:mx-auto">
          {hotelsData.map((hotel: THotel) => (
            <HotelCard key={hotel.hotelId} hotel={hotel} />
          ))}
        </div>
      </Sections>
      <Footer/>
    </div>
  );
};
