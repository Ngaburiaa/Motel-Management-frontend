import { useGetUserAnalyticsQuery } from '../../features/api/analyticsApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';
import type { UserAnalytics } from '../../types/userAnalyticsTypes';
import { CalendarIcon } from 'lucide-react';
import { UserDashboardCard } from './UserDashboardCard';

const Dashboard = ({ userId }: { userId: number }) => {
  const { data: response, error, isLoading } = useGetUserAnalyticsQuery(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <div className="flex flex-col items-center space-y-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-gray-500">Fetching analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white">
        <div className="alert alert-error shadow-md border border-red-200 bg-white text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error Loading Data</h3>
            <div className="text-xs">Unable to load analytics data. Please try again later.</div>
          </div>
        </div>
      </div>
    );
  }

  const analyticsData: UserAnalytics = response?.data || {
    userId: 0,
    openTicketsCount: 0,
    totalAmountPaid: 0,
    pendingAmount: 0,
    recentBookings: [],
    suggestedRoom: null,
  };

  const {
    openTicketsCount,
    totalAmountPaid,
    pendingAmount,
    recentBookings,
    suggestedRoom,
  } = analyticsData;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-6 border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Analytics Dashboard</h1>
            <p className="text-gray-500">Comprehensive overview of your account activity</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Open Tickets */}
          <UserDashboardCard
            title="Open Support Tickets"
            value={openTicketsCount}
            badge={openTicketsCount > 0 ? 'Requires attention' : 'All resolved'}
            badgeColor={openTicketsCount > 0 ? 'bg-yellow-400' : 'bg-green-400'}
            icon="x-circle"
            iconColor="text-red-500"
          />

          {/* Total Paid */}
          <UserDashboardCard
            title="Total Amount Paid"
            value={formatCurrency(totalAmountPaid)}
            badge="Lifetime payments"
            badgeColor="bg-green-400"
            icon="dollar-sign"
            iconColor="text-green-500"
          />

          {/* Pending Amount */}
          <UserDashboardCard
            title="Pending Amount"
            value={formatCurrency(pendingAmount)}
            badge={pendingAmount > 0 ? 'Payment required' : 'All settled'}
            badgeColor={pendingAmount > 0 ? 'bg-yellow-400' : 'bg-green-400'}
            icon="alert-circle"
            iconColor="text-yellow-500"
          />
        </div>

        {/* Recent Bookings */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Recent Bookings</h3>
            </div>
            <div className="badge badge-outline text-sm text-gray-600">{recentBookings.length} bookings</div>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="font-medium">No recent bookings available</p>
              <p className="text-sm mt-1">Your booking history will appear here once you make a reservation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.bookingId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        booking.room?.hotel?.thumbnail ??
                        booking.room?.thumbnail ??
                        'https://via.placeholder.com/80'
                      }
                      alt="Room"
                      className="w-24 h-20 rounded-md border object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">#{booking.bookingId}</span>
                        <span className={`badge badge-sm ${
                          booking.bookingStatus.toLowerCase().includes('confirmed') ? 'badge-success' :
                          booking.bookingStatus.toLowerCase().includes('pending') ? 'badge-warning' :
                          booking.bookingStatus.toLowerCase().includes('cancelled') ? 'badge-error' :
                          'badge-neutral'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {booking.room?.hotel?.name ?? 'Hotel'} — {format(new Date(booking.checkInDate), 'MMM dd')} to {format(new Date(booking.checkOutDate), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Suggested Room */}
        {suggestedRoom && (
          <section className="border border-gray-200 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Recommended Room</h3>
              <span className="badge badge-accent badge-outline">Personalized</span>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 space-y-3">
                <p className="text-lg font-medium">{suggestedRoom.hotel?.name}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(Number(suggestedRoom.pricePerNight))} <span className="text-sm text-gray-500">/ night</span></p>
                <button className="btn btn-outline btn-primary mt-2">View Details</button>
              </div>
              <div className="w-full max-w-xs">
                <img
                  src={suggestedRoom?.thumbnail ?? 'https://via.placeholder.com/300'}
                  alt="Room"
                  className="rounded-xl border object-cover h-48 w-full"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
