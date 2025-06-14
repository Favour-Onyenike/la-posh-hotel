
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingSystemTester from '@/components/BookingSystemTester';

const TestBookingSystem = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <div className="hotel-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="hotel-title mb-4">Booking System Test</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive testing suite for the hotel booking system
              </p>
            </div>
            
            <BookingSystemTester />
            
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Test Coverage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">Database Operations:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Room creation and validation</li>
                    <li>• Booking insertion with constraints</li>
                    <li>• Availability checking function</li>
                    <li>• Foreign key relationships</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Admin Features:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Dashboard statistics update</li>
                    <li>• Booking management interface</li>
                    <li>• Room availability controls</li>
                    <li>• Status update functionality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TestBookingSystem;
