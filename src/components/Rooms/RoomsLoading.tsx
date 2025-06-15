
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RoomsLoading = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomsLoading;
