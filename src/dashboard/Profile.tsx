import { useSelector } from "react-redux";
import { useState } from "react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { 
  User, 
  Edit3, 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  Plus,
  X,
  Camera,
  Settings,
  Home,
  Edit2,
  Trash2
} from "lucide-react";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../features/api/usersApi";
import { useCreateAddressMutation, useDeleteAddressMutation, useGetEntityAddressQuery, useUpdateAddressMutation } from "../features/api/addressesApi";
import type { TAddress } from "../types/addressTypes";
import { Loading } from "../components/common/Loading";
import { UserFormModal } from "../components/profile/UserFormModal";
import { ProfileInfoDisplay } from "../components/profile/ProfileInfoDisplay";
import type { TUserFormValues } from "../types/usersTypes";
import type { RootState } from "../app/store";
import { AddressFormModal } from "../components/profile/AddressFormModal";

const MySwal = withReactContent(Swal);

export const Profile = () => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useGetUserByIdQuery(id, { skip: !id });
  
  const { data: addressData = [], refetch: refetchAddresses } =
    useGetEntityAddressQuery({
      entityId: id,
      entityType: "user",
    });

  const [updateUser] = useUpdateUserMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [createAddress] = useCreateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [editMode, setEditMode] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TAddress | undefined>();

  const onSubmit = async (data: TUserFormValues) => {
    console.log(data);
    try {
      await updateUser({ userId: id, ...data }).unwrap();
      refetch();
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleAddressSave = async (data: TAddress) => {
    try {
      if (data.addressId) {
        const { addressId, ...addressData } = data;
        await updateAddress({ addressId, ...addressData }).unwrap();
        toast.success("Address updated successfully");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { addressId: _, ...newAddress } = data;
        await createAddress({
          ...newAddress,
          entityId: id,
          entityType: "user",
        }).unwrap();
        toast.success("Address added successfully");
      }
      await refetchAddresses();
    } catch (err) {
      toast.error("Something went wrong while saving");
      console.error(err);
    } finally {
      setAddressModalOpen(false);
    }
  };

  const handleAddressDelete = async (addressId: number) => {
    const result = await MySwal.fire({
      title: "Delete Address?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'bg-white rounded-2xl shadow-2xl',
        title: 'text-gray-800 font-semibold',
        confirmButton: 'px-6 py-2 rounded-lg font-medium',
        cancelButton: 'px-6 py-2 rounded-lg font-medium'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAddress(addressId).unwrap();
      await refetchAddresses();
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
      console.error(err);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600">Unable to load your profile information. Please try again.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                editMode
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
              }`}
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Image Section */}
              <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-32">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                      {userData?.profileImage ? (
                        <img 
                          src={userData.profileImage} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm font-medium mb-3">
                  <Shield className="w-3 h-3 mr-1" />
                  {userData?.role || "User"}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {userData?.bio || "No bio available"}
                </p>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{userData?.email}</span>
                </div>
                {userData?.contactPhone && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{userData.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details & Addresses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Details Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                </div>
              </div>
              
              <div className="p-6">
                {editMode ? (
                  <UserFormModal
                    isOpen={true}
                    onClose={() => setEditMode(false)}
                    onSubmit={onSubmit}
                    defaultValues={{
                      firstName: userData?.firstName ?? "",
                      lastName: userData?.lastName ?? "",
                      bio: userData?.bio ?? "",
                    }}
                  />
                ) : (
                  <ProfileInfoDisplay
                    firstName={userData?.firstName ?? ""}
                    lastName={userData?.lastName ?? ""}
                    bio={userData?.bio}
                    contactPhone={userData?.contactPhone}
                    email={userData?.email ?? ""}
                    role={userData?.role}
                  />
                )}
              </div>
            </div>

            {/* Addresses Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Addresses</h3>
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {addressData.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(undefined);
                    setAddressModalOpen(true);
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Address
                </button>
              </div>
              
              <div className="p-6">
                {addressData.length > 0 ? (
                  <div className="grid gap-4">
                    {addressData.map((address) => (
                      <div
                        key={address.addressId}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start gap-4">
                          {/* Address Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {address.street}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {address.city}, {address.state} {address.postalCode}
                                  <br />
                                  {address.country}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <button
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                              onClick={() => {
                                setEditingAddress(address);
                                setAddressModalOpen(true);
                              }}
                              title="Edit Address"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              onClick={() => handleAddressDelete(address.addressId)}
                              title="Delete Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h4>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      Add your first address to get started with location-based services.
                    </p>
                    <button
                      onClick={() => {
                        setEditingAddress(undefined);
                        setAddressModalOpen(true);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressFormModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSubmit={handleAddressSave}
        defaultValues={editingAddress}
      />
    </div>
  );
};