
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import StatCard from '@/components/Admin/StatCard';
import BookingChart from '@/components/Admin/BookingChart';
import TodayActivity from '@/components/Admin/TodayActivity';
import RoomAvailabilityManager from '@/components/Admin/RoomAvailabilityManager';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { 
  Hotel, 
  DollarSign, 
  Star,
  MessageSquare,
  Images,
  Calendar,
  Users,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const {
    totalRooms,
    totalSuites,
    availableRooms,
    pendingBookings,
    confirmedBookings,
    totalReviews,
    totalGalleryImages,
    revenue,
    checkInsToday,
    checkOutsToday,
    bookingsByMonth,
    rooms,
    loading,
    setRooms,
    setAvailableRooms
  } = useDashboardData();

  const { toggleRoomAvailability } = useRoomAvailability(
    rooms,
    setRooms,
    setAvailableRooms
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Navigation Tabs - Like template */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
              Dashboard
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              Contact Messages
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              Log-in Report
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              Change Password
            </button>
          </div>
        </div>

        {/* Stats Cards - Colorful like template */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Room Types" 
            value={totalRooms + totalSuites}
            icon={<Hotel size={24} />}
            color="blue"
            actionText="Add New"
          />
          <StatCard 
            title="New Bookings" 
            value={pendingBookings}
            icon={<Calendar size={24} />}
            color="green"
            actionText="View Details"
          />
          <StatCard 
            title="Confirmed Bookings" 
            value={confirmedBookings}
            icon={<Users size={24} />}
            color="orange"
            actionText="View Details"
          />
          <StatCard 
            title="Special Offers" 
            value={0}
            icon={<Clock size={24} />}
            color="red"
            actionText="Special Offers"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Available Rooms" 
            value={availableRooms}
            description={`${Math.round(((totalRooms + totalSuites) > 0 ? (availableRooms / (totalRooms + totalSuites)) * 100 : 0) || 0)}% occupancy rate`}
            icon={<Hotel size={24} />}
            color="purple"
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${revenue.toLocaleString()}`}
            icon={<DollarSign size={24} />}
            color="green"
            trend={12}
          />
          <StatCard 
            title="Reviews" 
            value={totalReviews}
            icon={<MessageSquare size={24} />}
            color="blue"
          />
          <StatCard 
            title="Gallery Images" 
            value={totalGalleryImages}
            icon={<Images size={24} />}
            color="orange"
          />
        </div>

        {/* Latest Bookings Table - Like template */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-700">Latest Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3">Code</th>
                    <th className="pb-3">Room</th>
                    <th className="pb-3">Check In</th>
                    <th className="pb-3">Check Out</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">First Name</th>
                    <th className="pb-3">Last Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {/* Sample data rows - would be populated with real booking data */}
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">X8B0R267</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Peace Deluxe Room
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">06/28/2018</td>
                    <td className="py-3 text-gray-600">06/30/2018</td>
                    <td className="py-3 text-gray-600">$300.00</td>
                    <td className="py-3 text-gray-600">John</td>
                    <td className="py-3 text-gray-600">Smith</td>
                    <td className="py-3 text-gray-600">test@test.com</td>
                    <td className="py-3 text-gray-600">212-324-5422</td>
                    <td className="py-3 text-gray-600">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Chart and Activity Cards */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <BookingChart data={bookingsByMonth} />
          
          <TodayActivity
            checkInsToday={checkInsToday}
            checkOutsToday={checkOutsToday}
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
          />
        </div>

        {/* Room Availability Management */}
        <RoomAvailabilityManager
          rooms={rooms}
          loading={loading}
          onToggleAvailability={toggleRoomAvailability}
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
