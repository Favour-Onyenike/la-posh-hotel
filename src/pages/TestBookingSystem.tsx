
import React from 'react';
import BookingSystemTester from '@/components/BookingSystemTester';
import AvailabilityTestSuite from '@/components/AvailabilityTestSuite';

const TestBookingSystem = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking System Test Suite</h1>
          <p className="text-lg text-gray-600">
            Comprehensive testing tools for the hotel booking system
          </p>
        </div>

        <div className="space-y-8">
          {/* Booking System Test */}
          <BookingSystemTester />
          
          {/* Availability Management Test */}
          <AvailabilityTestSuite />
        </div>
      </div>
    </div>
  );
};

export default TestBookingSystem;
