import { useSelector } from "react-redux";
import {
  useDeleteFromWishlistMutation,
  useGetWishlistByUserIdQuery,
} from "../../features/api/wishlistApi";
import type { RootState } from "../../app/store";
import { WishlistCard } from "../../components/wishlist/WishlistCard";
import { LoadingSpinner } from "../../components/ui/loadingSpinner";
import { SearchBar } from "../../components/common/SearchBar";
import { useState } from "react";
import { Error } from "../../components/common/Error";
import toast from "react-hot-toast";
import type { TWishlistItem } from "../../types/wishlistTypes";

export const Wishlist = () => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: wishlistItems,
    isError,
    isLoading,
    refetch,
  } = useGetWishlistByUserIdQuery(id);

  console.log(wishlistItems)

  const [deleteWishlist, { isLoading: isDeleting }] = useDeleteFromWishlistMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleRemove = async (wishlistId: number) => {
    try {
      await deleteWishlist(wishlistId).unwrap();
      toast.success("Removed from wishlist");
      refetch();
    } catch {
      toast.error("Failed to remove from wishlist.");
    }
  };

  const filteredWishlist = wishlistItems?.filter((item) =>
    item.room.roomType?.name.toLowerCase().includes(searchTerm)
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Error />;

  return (
    <section className="w-full min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
            <p className="text-gray-600 text-sm">
              Browse rooms you've saved for later booking.
            </p>
          </div>
          <div className="w-full max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by room type..."
              isLoading={isLoading || isDeleting}
            />
          </div>
        </div>

        {/* Wishlist Grid */}
        {filteredWishlist && filteredWishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWishlist.map((item: TWishlistItem) => (
              <WishlistCard
                key={item.wishlistId}
                room={item.room}
                wishlistId={item.wishlistId}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl font-semibold">No wishlist room found.</p>
            <p className="text-sm mt-2">Add a room to your wishlist.</p>
          </div>
        )}
      </div>
    </section>
  );
};
