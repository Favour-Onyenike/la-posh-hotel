
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Rooms from '@/pages/Rooms';
import Suites from '@/pages/Suites';
import Booking from '@/pages/Booking';
import Gallery from '@/pages/Gallery';
import Facilities from '@/pages/Facilities';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import AddReview from '@/pages/AddReview';
import AdminLogin from '@/pages/AdminLogin';
import AdminRegister from '@/pages/AdminRegister';
import Dashboard from '@/pages/Admin/Dashboard';
import AdminBookings from '@/pages/Admin/Bookings';
import AdminRooms from '@/pages/Admin/Rooms';
import AdminSuites from '@/pages/Admin/Suites';
import AdminReviews from '@/pages/Admin/Reviews';
import AdminGallery from '@/pages/Admin/Gallery';
import AdminEvents from '@/pages/Admin/Events';
import TeamManagement from '@/pages/Admin/TeamManagement';
import ActivityLogs from '@/pages/Admin/ActivityLogs';
import RoomAvailability from '@/pages/Admin/RoomAvailability';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import TestBookingSystem from '@/pages/TestBookingSystem';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/suites" element={<Suites />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-review" element={<AddReview />} />
          <Route path="/test-booking" element={<TestBookingSystem />} />
          
          {/* Admin Login and Registration Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          {/* Admin Routes - Now properly protected */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute>
                <AdminBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/rooms" 
            element={
              <ProtectedRoute>
                <AdminRooms />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/suites" 
            element={
              <ProtectedRoute>
                <AdminSuites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <ProtectedRoute>
                <AdminReviews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/team" 
            element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/activity-logs" 
            element={
              <ProtectedRoute>
                <ActivityLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/room-availability" 
            element={
              <ProtectedRoute>
                <RoomAvailability />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
