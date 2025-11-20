// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Users,
//   Hotel,
//   CalendarCheck,
//   DollarSign,
//   ArrowRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/dashboard/Card";
// import { useGetAdminAnalyticsSummaryQuery } from "../../features/api/analyticsApi";
// import { Skeleton } from "../../components/dashboard/skeleton/AdminSkeleton";
// import { Button } from "../../components/ui/Button";
// import { useNavigate } from "react-router";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import { useGetUserByIdQuery } from "../../features/api";

// export const Dashboard = () => {
//   const { data: response, isError, isLoading } = useGetAdminAnalyticsSummaryQuery();
//   const data = response?.data;
//   const navigate = useNavigate();

//   const {userId} = useSelector((state: RootState) => state.auth);
//   const {data: user} = useGetUserByIdQuery(Number(userId));

//   const newUsers = data?.recentActivity?.newUsers || [];
//   const recentBookings = data?.recentActivity?.recentBookings || [];

//   // Pagination
//   const USERS_PER_PAGE = 5;
//   const BOOKINGS_PER_PAGE = 10;

//   const [userPage, setUserPage] = useState(0);
//   const [bookingPage, setBookingPage] = useState(0);

//   const paginatedUsers = newUsers.slice(
//     userPage * USERS_PER_PAGE,
//     (userPage + 1) * USERS_PER_PAGE
//   );
//   const paginatedBookings = recentBookings.slice(
//     bookingPage * BOOKINGS_PER_PAGE,
//     (bookingPage + 1) * BOOKINGS_PER_PAGE
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-base-200 p-6 md:p-12 text-base-content">
//         <Skeleton className="h-12 w-64 mb-10" />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full" />
//           ))}
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <Skeleton className="lg:col-span-2 h-96" />
//           <Skeleton className="h-96" />
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen p-12">
//         <div className="alert alert-error">
//           Error loading dashboard data. Please try again later.
//         </div>
//       </div>
//     );
//   }

//   const stats = [
//     { title: "Total Users", value: data?.stats?.totalUsers || 0, icon: Users, color: "text-primary" },
//     { title: "Total Bookings", value: data?.stats?.totalBookings || 0, icon: CalendarCheck, color: "text-yellow-500" },
//     { title: "Total Hotels", value: data?.stats?.totalHotels || 0, icon: Hotel, color: "text-indigo-600" },
//     { title: "Revenue", value: `$${data?.stats?.totalRevenue || "0.00"}`, icon: DollarSign, color: "text-emerald-600" },
//   ];

//   const chartData =
//     data?.charts?.monthlyBookings?.rows?.map(row => ({
//       month: row.month,
//       bookings: Number(row.bookings),
//     })) || [];

//   const pieData = [
//     { name: "Available", value: data?.charts?.roomOccupancy?.available || 0 },
//     { name: "Occupied", value: data?.charts?.roomOccupancy?.occupied || 0 },
//   ];
//   const pieColors = ["#0ea5e9", "#facc15"];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white px-4 md:px-12 py-8 text-gray-900">
//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
//         <p className="uppercase text-sm tracking-wide text-primary mb-1">Welcome back, {user?.firstName} {user?.lastName}</p>
//         <h1 className="text-4xl font-bold">Dashboard Overview</h1>
//         <p className="text-sm text-gray-500 mt-1">Monitor key metrics and recent activity</p>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         {stats.map((stat, i) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <Card className="bg-white shadow hover:shadow-md transition">
//               <CardContent className="flex items-center gap-4 p-6">
//                 <stat.icon className={`w-10 h-10 ${stat.color}`} />
//                 <div>
//                   <p className="text-sm text-gray-500">{stat.title}</p>
//                   <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Bar Chart */}
//         <Card className="lg:col-span-2 bg-white shadow">
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle>Monthly Bookings</CardTitle>
//             <Button variant="ghost" onClick={() => navigate("/admin/booking-details")}>
//               View All <ArrowRight className="w-4 h-4 ml-1" />
//             </Button>
//           </CardHeader>
//           <CardContent className="p-6">
//             {chartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <p className="text-center text-gray-400">No booking data available.</p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Pie Chart */}
//         <Card className="bg-white shadow">
//           <CardHeader>
//             <CardTitle>Room Occupancy</CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
//                   {pieData.map((_, i) => (
//                     <Cell key={i} fill={pieColors[i % pieColors.length]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="flex justify-center mt-4 gap-4 text-sm text-gray-600">
//               {pieData.map((entry, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] }} />
//                   {entry.name}: {entry.value}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* New Users */}
//       <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="bg-white shadow">
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle>New Users</CardTitle>
//             <Button variant="ghost" onClick={() => navigate("/admin/users")}>
//               View All <ArrowRight className="w-4 h-4 ml-1" />
//             </Button>
//           </CardHeader>
//           <CardContent className="p-6">
//             {paginatedUsers.length > 0 ? (
//               <>
//                 <ul className="divide-y divide-gray-200">
//                   {paginatedUsers.map((user, index) => (
//                     <li key={index} className="py-3">
//                       <p className="font-medium">{user.name}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                       <p className="text-xs text-gray-400">
//                         Joined: {new Date(user.joined).toLocaleDateString()}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="flex justify-between mt-4">
//                   <Button
//                     variant="outline"
//                     disabled={userPage === 0}
//                     onClick={() => setUserPage(p => p - 1)}
//                   >
//                     Previous
//                   </Button>
//                   <Button
//                     variant="outline"
//                     disabled={(userPage + 1) * USERS_PER_PAGE >= newUsers.length}
//                     onClick={() => setUserPage(p => p + 1)}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <p className="text-center text-gray-400">No new users</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Bookings */}
//       <Card className="bg-white shadow mt-12">
//         <CardHeader className="flex justify-between items-center">
//           <CardTitle>Recent Bookings</CardTitle>
//           <Button variant="ghost" onClick={() => navigate("/admin/booking-details")}>
//               View All <ArrowRight className="w-4 h-4 ml-1" />
//             </Button>
//         </CardHeader>
//         <CardContent className="p-6 overflow-x-auto">
//           {paginatedBookings.length > 0 ? (
//             <>
//               <table className="table-auto w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 border-b">
//                     <th>ID</th>
//                     <th>Guest</th>
//                     <th>Room</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedBookings.map(booking => (
//                     <tr
//                       key={booking.id}
//                       className="hover:bg-gray-50 text-base-100 cursor-pointer border-b"
//                       onClick={() => navigate(`/admin/bookings/${booking.id}`)}
//                     >
//                       <td>{booking.id}</td>
//                       <td>{booking.guest}</td>
//                       <td>{booking.room}</td>
//                       <td>{new Date(booking.date).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-between mt-4">
//                 <Button
//                   variant="outline"
//                   disabled={bookingPage === 0}
//                   onClick={() => setBookingPage(p => p - 1)}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   disabled={(bookingPage + 1) * BOOKINGS_PER_PAGE >= recentBookings.length}
//                   onClick={() => setBookingPage(p => p + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-400 py-4">No recent bookings</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
