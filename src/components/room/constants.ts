import {
  Wifi,
  Tv,
  AirVent,
  BedDouble,
  ParkingCircle,
  Home,
  Check,
  Star,
  Camera,
  ImageIcon,
} from "lucide-react";

export const allAmenities = [
  { label: "WiFi", value: "wifi", icon: Wifi },
  { label: "TV", value: "tv", icon: Tv },
  { label: "Air Conditioning", value: "ac", icon: AirVent },
  { label: "Double Bed", value: "double_bed", icon: BedDouble },
  { label: "Parking", value: "parking", icon: ParkingCircle },
];

export const steps = [
  {
    title: "Room Details",
    subtitle: "Basic info about the room",
    icon: Home,
  },
  {
    title: "Amenities",
    subtitle: "Select room features",
    icon: Star,
  },
  {
    title: "Thumbnail Upload",
    subtitle: "Main image for the room",
    icon: Camera,
  },
  {
    title: "Gallery Upload",
    subtitle: "Add more room photos",
    icon: ImageIcon,
  },
  {
    title: "Review & Submit",
    subtitle: "Final check before creating",
    icon: Check,
  },
];