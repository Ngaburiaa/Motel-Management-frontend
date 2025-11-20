import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Hotel,
  CalendarCheck,
  DollarSign,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, subQuarters } from "date-fns";
import {
  useGetRoleBasedAnalyticsQuery,
} from "../features/api/analyticsApi";
import { type TooltipProps } from "recharts";
import type { AdminDashboardStats } from "../types/analyticsTypes";


type TType = TooltipProps<number, string> & {
  selectedRangeOption?: "year" | "month" | "week" | "day";
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    payload: unknown;
    color: string;
    dataKey: string | number;
  }[];
  label?: string;
};


type StatCard = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

type DateRangeOption = {
  label: string;
  value: string;
  getRange: () => { startDate: Date; endDate: Date };
};

const CalendarWidget: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const day = format(now, "EEEE"); // e.g., Monday
  const date = format(now, "MMMM d, yyyy"); // e.g., July 28, 2025
  const time = format(now, "hh:mm:ss a"); // e.g., 03:30:21 PM

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-4 px-6 text-center">
      <p className="text-sm text-gray-500 font-medium">{day}</p>
      <p className="text-xl font-semibold text-gray-800">{date}</p>
      <p className="text-lg font-mono text-blue-600">{time}</p>
    </div>
  );
};

export const Analytics: React.FC = () => {
  const [selectedRangeOption, setSelectedRangeOption] = useState("year");
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: now,
    };
  });

  const dateRangeOptions = useMemo<DateRangeOption[]>(
    () => [
      {
        label: "Last 7 Days",
        value: "7days",
        getRange: () => ({
          startDate: subDays(new Date(), 7),
          endDate: new Date(),
        }),
      },
      {
        label: "Last 30 Days",
        value: "30days",
        getRange: () => ({
          startDate: subDays(new Date(), 30),
          endDate: new Date(),
        }),
      },
      {
        label: "Last Quarter",
        value: "quarter",
        getRange: () => ({
          startDate: subQuarters(new Date(), 1),
          endDate: new Date(),
        }),
      },
      {
        label: "Year to Date",
        value: "year",
        getRange: () => {
          const now = new Date();
          return {
            startDate: new Date(now.getFullYear(), 0, 1),
            endDate: now,
          };
        },
      },
    ],
    []
  );

  useEffect(() => {
    const selected = dateRangeOptions.find(
      (opt) => opt.value === selectedRangeOption
    );
    if (selected) setDateRange(selected.getRange());
  }, [selectedRangeOption, dateRangeOptions]);

  const { data, isLoading, isError, refetch } = useGetRoleBasedAnalyticsQuery({
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString(),
  });

  const analyticsData = data?.data as AdminDashboardStats | undefined;

  const stats: StatCard[] = analyticsData
    ? [
        {
          title: "Users",
          value: analyticsData.totalUsers ?? 0,
          icon: Users,
          color: "text-blue-600",
        },
        {
          title: "Hotels",
          value: analyticsData.totalHotels ?? 0,
          icon: Hotel,
          color: "text-purple-600",
        },
        {
          title: "Bookings",
          value: analyticsData.totalBookings ?? 0,
          icon: CalendarCheck,
          color: "text-yellow-600",
        },
        {
          title: "Revenue",
          value: `$${Number(analyticsData.totalRevenue || 0).toLocaleString()}`,
          icon: DollarSign,
          color: "text-emerald-600",
        },
        {
          title: "Pending Tickets",
          value: analyticsData.pendingTickets ?? 0,
          icon: Clock,
          color: "text-red-600",
        },
      ]
    : [];

  const chartData = useMemo(() => {
    if (!analyticsData?.revenueTrends?.length) return [];

    if (selectedRangeOption === "year") {
      const monthlyData: Record<string, { revenue: number; bookings: number }> =
        {};
      analyticsData.revenueTrends.forEach((item) => {
        const month = item.date.substring(0, 7);
        monthlyData[month] = {
          revenue:
            (monthlyData[month]?.revenue || 0) + Number(item.amount || 0),
          bookings: 0,
        };
      });
      analyticsData.bookingTrends?.forEach(
        (item: { date: string; count: number }) => {
          const month = item.date.substring(0, 7);
          if (monthlyData[month]) {
            monthlyData[month].bookings += item.count;
          } else {
            monthlyData[month] = {
              revenue: 0,
              bookings: item.count,
            };
          }
        }
      );
      return Object.entries(monthlyData)
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    return analyticsData.revenueTrends.map((item) => ({
      date: item.date,
      revenue: item.amount,
      bookings:
        analyticsData.bookingTrends?.find(
          (b: { date: string }) => b.date === item.date
        )?.count || 0,
    }));
  }, [analyticsData, selectedRangeOption]);

  const CustomTooltip = ({
    active,
    payload,
    label,
    selectedRangeOption,
  }: TType) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 shadow-xl rounded-xl border border-gray-200 text-sm">
        <p className="font-semibold">
          {selectedRangeOption === "year"
            ? format(new Date(label + "-01"), "MMMM yyyy")
            : format(new Date(label ?? ""), "MMM d, yyyy")}
        </p>
        <p className="text-indigo-600">
          Revenue: ${payload[0]?.value?.toLocaleString() ?? ""}
        </p>
        <p className="text-green-600">Bookings: {payload[1].value}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-12 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-heading text-gray-800">📈 Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of current platform performance
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <select
            className="select select-bordered bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={selectedRangeOption}
            onChange={(e) => setSelectedRangeOption(e.target.value)}
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <CalendarWidget />
        </div>
      </div>

      {/* Loading or Error */}
      {isLoading ? (
        <p className="text-gray-600 text-center animate-pulse">
          Loading analytics...
        </p>
      ) : isError ? (
        <div className="alert alert-error justify-between">
          <span>Failed to fetch analytics.</span>
          <button className="btn btn-sm btn-outline" onClick={refetch}>
            <RefreshCcw className="w-4 h-4 mr-1" />
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-body">
                      {stat.title}
                    </p>
                    <p
                      className={`text-xl font-heading font-semibold ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Revenue & Booking Trends
            </h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) =>
                      selectedRangeOption === "year"
                        ? format(new Date(d + "-01"), "MMM")
                        : format(new Date(d), "MMM d")
                    }
                  />
                  <YAxis />
                  <Tooltip
                    content={<CustomTooltip selectedRangeOption="year" />}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    name="Revenue"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    name="Bookings"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Recent Bookings
            </h2>
            <div className="overflow-x-auto rounded-xl">
              <table className="table text-sm">
                <thead className="bg-slate-100 text-gray-600 font-medium">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Hotel</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData?.recentBookings?.map((b) => (
                    <tr key={b.bookingId}>
                      <td>
                        {b.user?.firstName} {b.user?.lastName}
                      </td>
                      <td>{b.user?.email}</td>
                      <td>{b.room?.hotel?.name}</td>
                      <td>{format(new Date(b.checkInDate), "PPP")}</td>
                      <td>{format(new Date(b.checkOutDate), "PPP")}</td>
                      <td>${Number(b.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className="badge badge-outline capitalize">
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!analyticsData?.recentBookings?.length && (
                <p className="text-center text-gray-500 py-4">
                  No recent bookings found.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
