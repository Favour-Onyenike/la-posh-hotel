
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
  Star
} from "lucide-react";

const Dashboard = () => {
  const {
    totalRooms,
    totalSuites,
    availableRooms,
    pendingBookings,
    confirmedBookings,
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
      <div className="space-y-6 mt-4 lg:mt-0">
        <div className="mt-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Admin overview of bookings and hotel statistics.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Rooms" 
            value={totalRooms}
            icon={<Hotel size={20} />}
          />
          <StatCard 
            title="Suites" 
            value={totalSuites}
            icon={<Star size={20} />}
          />
          <StatCard 
            title="Available Accommodations" 
            value={availableRooms}
            description={`${Math.round(((totalRooms + totalSuites) > 0 ? (availableRooms / (totalRooms + totalSuites)) * 100 : 0) || 0)}% occupancy rate`}
            icon={<Hotel size={20} />}
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${revenue.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            trend={12}
          />
        </div>
        
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
