import { useState } from "react";
import { Mail, Phone, Pencil } from "lucide-react";
import type { TUser } from "../../types/usersTypes";
import { UserDetailsDrawer } from "./UserDetailsDrawer";
import { UserEditDrawer } from "./UserEditDrawer";
import { motion } from "framer-motion";

interface Props {
  user: TUser;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editUser, setEditUser] = useState(false);

  const handleCardClick = () => setShowDrawer(true);

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditUser(true);
  };

  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCardClick}
        className="bg-white border-base-300 text-black rounded-2xl p-5 flex flex-col items-center cursor-pointer transition-shadow hover:shadow-xl"
      >
        <img
          src={user.profileImage || "/placeholder.jpg"}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-20 h-20 rounded-full object-cover border-1 border-primary mb-4"
        />

        <h3 className="text-lg font-bold text-center">
          {user.firstName} {user.lastName}
        </h3>

        <p className="text-sm text-muted italic text-center mb-3">
          {user.bio || "No bio available."}
        </p>

        <div className="w-full space-y-2 text-sm text-left">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>{user.contactPhone}</span>
          </div>
        </div>

        <div className="flex-grow" />

        <button
          onClick={handleEditClick}
          className="mt-4 w-full bg-primary text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition"
        >
          <Pencil className="w-4 h-4" />
          <span className="text-sm font-medium">Edit</span>
        </button>
      </motion.div>

      <UserDetailsDrawer
        user={user}
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
      />

      <UserEditDrawer
  user={user}
  isOpen={editUser}
  onClose={() => setEditUser(false)}
/>
    </>
  );
};
