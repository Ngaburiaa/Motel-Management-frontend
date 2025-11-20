export interface MonthlyBooking {
  month: string;
  bookings: number;
}

export interface RoomOccupancy {
  available: number;
  occupied: number;
}

export interface RecentBooking {
  id: number;
  guest: string;
  room: string;
  date: string;
}

export interface NewUser {
  name: string;
  email: string;
  joined: string;
}

export interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: string;
  totalHotels: number;
}

export interface MonthlyBookingsData {
  rows: MonthlyBooking[];
}

export interface Charts {
  monthlyBookings: MonthlyBookingsData;
  roomOccupancy: RoomOccupancy;
}

export interface RecentActivity {
  newUsers: NewUser[];
  recentBookings: RecentBooking[];
}

export interface SystemHealth {
  uptime: string;
  securityStatus: string;
  serverLoad: string;
}

export interface AdminAnalyticsSummary {
  success: boolean;
  data: Data;
}

export interface Data {
  stats: Stats;
  charts: Charts;
  recentActivity: RecentActivity;
  systemHealth?: SystemHealth;
}


// ====================== TYPE DEFINITIONS ======================
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface BaseAnalyticsResponse {
  success: boolean;
  message?: string;
}

export interface AdminDashboardStats {
  bookingTrends: any;
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Array<{
    bookingId: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    bookingStatus: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    room: {
      roomId: number;
      pricePerNight: number;
      hotel: {
        name: string;
      };
    };
  }>;
  pendingTickets: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  revenueTrends: Array<{
    date: string;
    amount: number;
  }>;
}

export interface OwnerDashboardStats {
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  recentBookings: Array<{
    bookingId: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    bookingStatus: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    room: {
      roomId: number;
      pricePerNight: number;
      hotel: {
        name: string;
      };
      roomType: {
        name: string;
      };
    };
  }>;
  upcomingCheckIns: Array<{
    bookingId: number;
    checkInDate: string;
    checkOutDate: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      contactPhone?: string;
    };
    room: {
      roomId: number;
      hotel: {
        name: string;
      };
      roomType: {
        name: string;
      };
    };
  }>;
  revenueByRoomType: Array<{
    roomType: string;
    revenue: number;
  }>;
  bookingTrends: Array<{
    date: string;
    count: number;
  }>;
}

export interface UserDashboardStats {
  totalBookings: number;
  upcomingBookings: Array<{
    bookingId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    bookingStatus: string;
    room: {
      roomId: number;
      pricePerNight: number;
      thumbnail?: string;
      hotel: {
        name: string;
        location?: string;
        thumbnail?: string;
      };
      roomType: {
        name: string;
      };
    };
    payments?: Array<{
      amount: number;
      paymentDate: string;
    }>;
  }>;
  pastBookings: Array<{
    bookingId: number;
    checkOutDate: string;
    room: {
      roomId: number;
      pricePerNight: number;
      thumbnail?: string;
      hotel: {
        name: string;
        location?: string;
      };
      roomType: {
        name: string;
      };
    };
    payments?: Array<{
      amount: number;
    }>;
    review?: {
      rating: number;
      comment?: string;
    };
  }>;
  totalSpent: number;
  wishlistCount: number;
  favoriteHotel?: {
    hotelId: number;
    name: string;
    bookingCount: number;
  };
  bookingTrends: Array<{
    date: string;
    count: number;
  }>;
}

export interface AdminAnalyticsResponse extends BaseAnalyticsResponse {
  data: AdminDashboardStats;
}

export interface OwnerAnalyticsResponse extends BaseAnalyticsResponse {
  data: OwnerDashboardStats;
}

// interface UserAnalyticsResponse extends BaseAnalyticsResponse {
//   data: UserAnalytics;
// }
