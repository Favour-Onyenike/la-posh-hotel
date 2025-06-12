import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient } from 'react-query';

// Public Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Rooms from '@/pages/Rooms';
import Suites from '@/pages/Suites';
import Facilities from '@/pages/Facilities';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import Booking from '@/pages/Booking';
import AddReview from '@/pages/AddReview';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminRooms from '@/pages/Admin/Rooms';
import AdminSuites from '@/pages/Admin/Suites';
import AdminBookings from '@/pages/Admin/Bookings';
import AdminReviews from '@/pages/Admin/Reviews';
import AdminGallery from '@/pages/Admin/Gallery';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClient>
          <div className="w-full">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/suites" element={<Suites />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/add-review" element={<AddReview />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/rooms" element={
                <ProtectedRoute>
                  <AdminRooms />
                </ProtectedRoute>
              } />
              <Route path="/admin/suites" element={
                <ProtectedRoute>
                  <AdminSuites />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/reviews" element={
                <ProtectedRoute>
                  <AdminReviews />
                </ProtectedRoute>
              } />
              <Route path="/admin/gallery" element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </QueryClient>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
