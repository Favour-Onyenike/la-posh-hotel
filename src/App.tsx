
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Facilities from "./pages/Facilities";
import Rooms from "./pages/Rooms";
import Suites from "./pages/Suites";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import AddReview from "./pages/AddReview";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Dashboard from "./pages/Admin/Dashboard";
import AdminBookings from "./pages/Admin/Bookings";
import AdminRooms from "./pages/Admin/Rooms";
import AdminSuites from "./pages/Admin/Suites";
import AdminGallery from "./pages/Admin/Gallery";
import AdminReviews from "./pages/Admin/Reviews";
import AdminEvents from "./pages/Admin/Events";
import RoomAvailability from "./pages/Admin/RoomAvailability";
import TeamManagement from "./pages/Admin/TeamManagement";
import ActivityLogs from "./pages/Admin/ActivityLogs";
import TestBookingSystem from "./pages/TestBookingSystem";
import UpdateUserRole from "./pages/UpdateUserRole";
import ContentManagement from "./pages/Admin/ContentManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/suites" element={<Suites />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/add-review" element={<AddReview />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/suites" element={<AdminSuites />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/room-availability" element={<RoomAvailability />} />
            <Route path="/admin/team-management" element={<TeamManagement />} />
            <Route path="/admin/activity-logs" element={<ActivityLogs />} />
            <Route path="/admin/content-management" element={<ContentManagement />} />
            <Route path="/test-booking" element={<TestBookingSystem />} />
            <Route path="/update-user-role" element={<UpdateUserRole />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
