
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Rooms from "./pages/Rooms";
import Suites from "./pages/Suites";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Admin/Auth";
import Dashboard from "./pages/Admin/Dashboard";
import AdminRooms from "./pages/Admin/Rooms";
import AdminBookings from "./pages/Admin/Bookings";
import AdminReviews from "./pages/Admin/Reviews";
import AdminGallery from "./pages/Admin/Gallery";
import AdminContent from "./pages/Admin/Content";
import ProtectedRoute from "@/components/Admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/suites" element={<Suites />} />
            <Route path="/booking" element={<Booking />} />
            
            {/* Admin Authentication */}
            <Route path="/admin/auth" element={<Auth />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/rooms" element={<AdminRooms />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/content" element={<AdminContent />} />
            </Route>
            
            {/* Admin Root Redirect */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Redirects for backward compatibility */}
            <Route path="/rooms-and-suites" element={<Navigate to="/rooms" replace />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
