import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useImageUploader } from "../../hook/useImageUploader";
import { useCreateRoomMutation } from "../../features/api/roomsApi";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCreateAmenityMutation } from "../../features/api/amenitiesApi";
import { useCreateEntityAmenityMutation } from "../../features/api/entityAmenitiesApi";
import { useNavigate } from "react-router";
import { parseRTKError } from "../../utils/parseRTKError";
import { steps } from "../../components/room/constants";
import { formSchema } from "../../components/room/types";
import { ThumbnailUpload } from "../../components/room/ThumbnailUpload";
import { AmenitiesSelection } from "../../components/room/AmenitiesSelection";
import { GalleryUpload } from "../../components/room/GalleryUpload";
import { ReviewSubmit } from "../../components/room/ReviewSubmit";
import { useGetAmenitiesQuery } from "../../features/api/amenitiesApi";
import { useGetRoomTypesQuery } from "../../features/api/roomTypeApi";
import { RoomDetails } from "../../components/room/RoomDetails";

const CreateRoomForm = ({ hotelId }: { hotelId: number }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { upload } = useImageUploader();
  const [createRoom] = useCreateRoomMutation();
  const navigate = useNavigate();
  const [createAmenity] = useCreateAmenityMutation();
  const [createEntityAmenity] = useCreateEntityAmenityMutation();
  const { data: roomTypesData, isLoading: isRoomTypesLoading } = useGetRoomTypesQuery();
  const { data: amenitiesData, isLoading: isAmenitiesLoading } = useGetAmenitiesQuery();

  const transformedRoomTypes = useMemo(() =>
    roomTypesData?.map((roomType) => ({
      roomTypeId: roomType.roomTypeId,
      name: roomType.name,
    })) || [], [roomTypesData]
  );

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomTypeId: 0,
      pricePerNight: 0,
      capacity: 1,
      description: "",
      isAvailable: true,
      thumbnail: "",
      gallery: [],
      amenities: [],
    },
  });

  if (isRoomTypesLoading || isAmenitiesLoading) {
    return <div>Loading...</div>;
  }

  const stepFields: (keyof typeof formSchema.shape)[][] = [
    ["roomTypeId", "pricePerNight", "capacity", "description", "isAvailable"],
    ["amenities"],
    ["thumbnail"],
    ["gallery"],
    [],
  ];

  const handleNext = async () => {
    const valid = await methods.trigger(stepFields[step]);
    if (valid) setStep((prev) => prev + 1);
  };

  const handleBack = () => step > 0 && setStep((prev) => prev - 1);

  const handleEditStep = (stepToEdit: number) => {
    setStep(stepToEdit);
  };

  const handleImageUpload = async (
    file: File,
    context: "thumbnail" | "gallery"
  ) => {
    setIsUploading(true);
    try {
      const response = await upload(file, context);
      const url = response?.secure_url;

      if (!url) return toast.error("Image upload failed: No URL returned.");

      if (context === "thumbnail") {
        methods.setValue("thumbnail", url);
      } else {
        const currentGallery = methods.getValues("gallery");
        methods.setValue("gallery", [...currentGallery, url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = methods.handleSubmit(async (formData) => {
    setIsSubmitting(true);
    try {
      const roomPayload = {
        hotelId,
        roomTypeId: Number(formData.roomTypeId),
        pricePerNight: Number(formData.pricePerNight),
        capacity: formData.capacity,
        description: formData.description,
        isAvailable: formData.isAvailable,
        thumbnail: formData.thumbnail,
        gallery: formData.gallery,
      };

      const roomResponse = await createRoom(roomPayload).unwrap();
      const roomId = roomResponse.roomId;

      if (formData.amenities && formData.amenities.length > 0) {
        for (const amenityValue of formData.amenities) {
          try {
            const existingAmenity = amenitiesData?.find(
              (a) => a.name === amenityValue
            );
            let amenityId;

            if (existingAmenity?.amenityId) {
              amenityId = existingAmenity.amenityId;
            } else {
              const amenityResponse = await createAmenity({
                name: amenityValue,
              }).unwrap();

              if (!amenityResponse?.amenityId) {
                throw new Error(`Amenity creation failed for ${amenityValue}`);
              }

              amenityId = amenityResponse.amenityId;
            }

            await createEntityAmenity({
              amenityId,
              entityId: roomId,
              entityType: "room",
            }).unwrap();
          } catch (error) {
            console.error(`Error processing amenity ${amenityValue}:`, error);
            continue;
          }
        }
      }

      toast.success("Room created successfully!");
      methods.reset();
      setStep(0);
      navigate(-1);
    } catch (error) {
      const errorMessage = parseRTKError(
        error,
        "Failed to create room. Please try again."
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  const progress = (step / (steps.length - 1)) * 100;
  const isProcessing = isSubmitting || isUploading;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-[#f9f9fa] py-8 px-4 font-inter">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-[20px] font-semibold text-[#1E2A38] font-playfair mb-2 text-center">Create New Room</h1>
            <p className="text-[14px] text-gray-600 max-w-2xl mx-auto text-center">
              Add a beautiful room to your hotel collection with our step-by-step guide.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-[12px] text-gray-700">
              <span className="font-medium">Step {step + 1} of {steps.length}</span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#1E2A38] to-[#D4AF37] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-5 gap-4 text-center text-[12px]">
            {steps.map((stepInfo, idx) => {
              const Icon = stepInfo.icon;
              const isActive = idx === step;
              const isCompleted = idx < step;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 text-white shadow-sm ${
                      isCompleted
                        ? 'bg-green-600'
                        : isActive
                        ? 'bg-[#1E2A38]'
                        : 'bg-gray-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`font-semibold ${isActive ? 'text-[#1E2A38]' : 'text-gray-500'}`}>{stepInfo.title}</span>
                </div>
              );
            })}
          </div>

          {/* Form */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  {step === 0 && <RoomDetails roomTypes={transformedRoomTypes} />}
                  {step === 1 && <AmenitiesSelection amenities={amenitiesData || []} />}
                  {step === 2 && <ThumbnailUpload onUpload={handleImageUpload} isUploading={isUploading} />}
                  {step === 3 && <GalleryUpload onUpload={handleImageUpload} isUploading={isUploading} />}
                  {step === 4 && (
                    <ReviewSubmit 
                      roomTypes={roomTypesData || []} 
                      amenities={amenitiesData || []}
                      onEditStep={handleEditStep}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isProcessing}
                    className={`text-[14px] font-semibold px-6 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                  </button>
                ) : <div />}

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isProcessing}
                    className={`text-[14px] font-semibold px-6 py-2 rounded-lg bg-[#1E2A38] text-white hover:bg-[#2A3C4F] ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Next <ChevronRight className="inline w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`text-[14px] font-semibold px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Create Room
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CreateRoomForm;