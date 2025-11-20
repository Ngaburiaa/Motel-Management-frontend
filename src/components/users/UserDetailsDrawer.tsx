import {
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  X,
  Loader2,
  UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useGetEntityAddressQuery } from "../../features/api/addressesApi";
import type { TUser } from "../../types/usersTypes";
import type { TAddressEntity } from "../../types/entityTypes";

interface Props {
  user: TUser;
  onClose: () => void;
  isOpen: boolean;
}

export const UserDetailsDrawer: React.FC<Props> = ({ user, onClose, isOpen }) => {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useGetEntityAddressQuery(
    { entityId: user.userId, entityType: user.role as TAddressEntity },
    { skip: !isOpen }
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === "drawer-backdrop") {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="drawer-backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[480px] bg-white z-50 shadow-2xl overflow-y-auto border-l-4 border-primary"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-6 flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-full">
                    <UserRound className="w-5 h-5 text-white" />
                  </div>
                  User Details
                </h2>
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-circle text-red-500 hover:bg-red-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-white">
                    <img
                      src={user.profileImage || "/placeholder.jpg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-800">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="badge badge-primary mt-2 text-white text-sm font-medium">
                  {user.role}
                </div>
              </div>

              {/* Contact Info */}
              <section className="mb-6">
                <h4 className="text-lg font-semibold text-primary mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <ContactItem icon={<Mail />} text={user.email} />
                  <ContactItem icon={<Phone />} text={user.contactPhone} />
                  <ContactItem icon={<ShieldCheck className="text-green-600" />} text={user.role} />
                </div>
              </section>

              {/* Bio Section */}
              <section className="mb-6">
                <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <UserRound className="w-5 h-5" /> Bio
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {user.bio || (
                    <span className="italic text-gray-400">No bio provided.</span>
                  )}
                </p>
              </section>

              {/* Address Section */}
              <section className="mb-8">
                <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Address
                </h4>
                {isLoading ? (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-blue-50">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-primary">Loading address...</span>
                  </div>
                ) : isError ? (
                  <div className="text-red-500 text-sm">⚠️ Failed to load address</div>
                ) : addresses?.length ? (
                  <ul className="space-y-2">
                    {addresses.map((addr) => (
                      <li
                        key={addr.addressId}
                        className="p-3 border border-gray-200 rounded-md bg-white"
                      >
                        <p className="text-gray-700">
                          {addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.postalCode}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-400">No address available.</p>
                )}
              </section>

              {/* Footer */}
              <div className="mt-auto">
                <button
                  onClick={onClose}
                  className="btn btn-primary btn-block text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Subcomponent: Contact Info Block
const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200">
    <span className="p-2 bg-primary/10 rounded-full text-primary">{icon}</span>
    <span className="text-gray-700">{text}</span>
  </div>
);
