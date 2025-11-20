import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { HotelsPage } from "./pages/HotelsPage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Rooms } from "./pages/Rooms";
import { About } from "./pages/About";
import { DashboardPage } from "./pages/DashboardPage";
import { Booking } from "./dashboard/AdminDashboard/Booking";
import { Hotels } from "./dashboard/AdminDashboard/Hotels";
import { Users } from "./dashboard/AdminDashboard/Users";
import { Ticket } from "./dashboard/AdminDashboard/AdminTicket";
import { Bookings } from "./dashboard/UserDashboard/Bookings";
import { UserTickets } from "./dashboard/UserDashboard/UserTickets";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";
import { RoomDetailsPage } from "./pages/RoomDetailsPage";
import { Toaster } from "react-hot-toast";
import { HotelDetails } from "./dashboard/AdminDashboard/HotelDetails";
import { RoomDetails } from "./dashboard/AdminDashboard/RoomDetails";
import { BookingDetails } from "./dashboard/AdminDashboard/BookingDetails";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Wishlist } from "./dashboard/UserDashboard/Wishlist";
import { UserPayment } from "./dashboard/UserDashboard/UserPayment";
import { Checkout } from "./dashboard/UserDashboard/Checkout";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { AdminPayment } from "./dashboard/AdminDashboard/AdminPayment";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import CreateRoomFormWrapper from "./components/room/CreateRoomFormWrapper";
import { PaymentFailedPage } from "./pages/PaymentFailedPage";
import { HotelRooms } from "./pages/HotelRooms";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { PaymentReceiptPage } from "./components/payment/PaymentReceiptPage";
import { Settings } from "./dashboard/Settings";
import { Analytics } from "./dashboard/Analytics";
import { RoomsDashboard } from "./dashboard/RoomsDashboard";
import { Profile } from "./dashboard/Profile";
import { RoomTypes } from "./dashboard/AdminDashboard/RoomTypes";
import { Amenities } from "./dashboard/AdminDashboard/Amenities";
import { AdminRouteGuard } from "./utils/AdminRouteGuard";
import { DashboardWrapper } from "./dashboard/UserDashboard/DashboardWrapper";
import { HotelFormContainer } from "./components/hotel/HotelFormContainer";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/hotels",
      element: <HotelsPage />,
    },
    {
      path: "/rooms",
      element: <Rooms />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/availability",
      element: <AvailabilityPage />,
    },

    {
      path: "/hotel/:id",
      element: <HotelDetailsPage />,
    },
    {
      path: "/room/:id",
      element: <RoomDetailsPage />,
    },
    {
      path: "hotel/:id/rooms",
      element: <HotelRooms />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordPage />,
    },
    {
      path: "/admin",
      element: <DashboardPage />,
      children: [
        {
          path: "/admin/analytics",
          element: <Analytics />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/booking-details",
          element: <Booking />,
        },
        {
          path: "/admin/booking-details/:id",
          element: <BookingDetails />,
        },
        {
          path: "/admin/hotels/:hotel/:id",
          element: <HotelDetails />,
        },
        {
          path: "/admin/room/:room/:id",
          element: <RoomDetails />,
        },
        {
          path: "/admin/payments",
          element: <AdminPayment />,
        },
        {
          path: "/admin/payment/receipt/:paymentId",
          element: <PaymentReceiptPage />,
        },
        {
          path: "/admin/create-room/:hotelId",
          element: <CreateRoomFormWrapper />,
        },
        {
          path: "/admin/ticket",
          element: <Ticket />,
        },
        {
          path: "/admin/hotels",
          element: <Hotels />,
        },
        {
          path: "/admin/hotels/create",
          element: <HotelFormContainer />,
        },
        {
          path: "/admin/hotels/edit/:hotelId",
          element: <HotelFormContainer />,
        },
        {
          path: "/admin/amenities",
          element: (
            <AdminRouteGuard>
              <Amenities />
            </AdminRouteGuard>
          ),
        },
        {
          path: "/admin/roomtypes",
          element: (
            <AdminRouteGuard>
              <RoomTypes />
            </AdminRouteGuard>
          ),
        },
        {
          path: "/admin/rooms",
          element: <RoomsDashboard />,
        },
        {
          path: "/admin/profile",
          element: <Profile />,
        },
        {
          path: "/admin/settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/user",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/user/analytics",
          element: <DashboardWrapper />,
        },
        {
          path: "/user/booking-details",
          element: <Bookings />,
        },
        {
          path: "/user/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/user/payment",
          element: <UserPayment />,
        },
        {
          path: "/user/checkout/:id",
          element: <Checkout />,
        },
        {
          path: "/user/payment/payment-success",
          element: <PaymentSuccessPage />,
        },
        {
          path: "/user/payment/payment-failed",
          element: <PaymentFailedPage />,
        },

        {
          path: "/user/tickets",
          element: <UserTickets />,
        },
        {
          path: "/user/payment/receipt/:paymentId",
          element: <PaymentReceiptPage />,
        },
        {
          path: "/user/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/owner",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/owner/analytics",
          element: <Analytics />,
        },
        {
          path: "/owner/payment",
          element: <UserPayment />,
        },
        {
          path: "/owner/tickets",
          element: <UserTickets />,
        },
        {
          path: "/owner/profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  );
}

export default App;
