import { XCircle, Pencil, User, Mail, Phone, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../../app/store";
import type { TUser } from "../../types/usersTypes";
import { useUpdateUserMutation } from "../../features/api";
import {
  userFormSchema,
  type TUserForm,
} from "../../validation/userFormSchema";

interface Props {
  user: TUser;
  onClose: () => void;
  isOpen: boolean;
}

export const UserEditDrawer: React.FC<Props> = ({ user, onClose, isOpen }) => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactPhone: user.contactPhone,
      bio: user.bio || "",
       profileImage: user.profileImage || "",
    },
  });

  const onSubmit = async (data: TUserForm) => {
    try {
      await updateUser({ userId: id, ...data }).unwrap();
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="relative w-full sm:w-[90%] md:w-[70%] lg:w-[500px] h-full bg-white shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
            }}
          >
            {/* Header with subtle gradient */}
            <div className="relative bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/60 px-8 py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Edit Profile
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Update your personal information
                    </p>
                  </div>
                </div>
                <button
                  className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <XCircle className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-88px)]">
              <div className="px-8 py-8">
                {/* Avatar Section */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                      <img
                        src={user.profileImage || "/placeholder.jpg"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          {...register("firstName")}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                          placeholder="John"
                        />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          {...register("lastName")}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                          placeholder="Doe"
                        />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                        placeholder="johndoe@example.com"
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        {...register("contactPhone")}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                        placeholder="+254712345678"
                      />
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    {errors.contactPhone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        {errors.contactPhone.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Bio Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bio
                    </label>
                    <div className="relative">
                      <textarea
                        {...register("bio")}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <FileText className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};