
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import StatCard from '@/components/Admin/StatCard';
import BookingChart from '@/components/Admin/BookingChart';
import TodayActivity from '@/components/Admin/TodayActivity';
import RoomAvailabilityManager from '@/components/Admin/RoomAvailabilityManager';
import SecurityMonitoringPanel from '@/components/Admin/SecurityMonitoringPanel';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { useRevenuePermissions } from '@/hooks/useRevenuePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Hotel, 
  DollarSign, 
  Star,
  MessageSquare,
  Images,
  Lock,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { isPrimaryAdmin } = useAuth();
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

  const { hasRevenuePermission, permissionLoading } = useRevenuePermissions();

  const { toggleRoomAvailability } = useRoomAvailability(
    rooms,
    setRooms,
    setAvailableRooms
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6 mt-4 lg:mt-0">
        <div className="mt-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Secure admin overview with enhanced monitoring.</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Business Overview</TabsTrigger>
            {isPrimaryAdmin && (
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Monitor
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
              {permissionLoading ? (
                <div className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ) : hasRevenuePermission ? (
                <StatCard 
                  title="Total Revenue" 
                  value={`$${revenue.toLocaleString()}`}
                  icon={<DollarSign size={20} />}
                  trend={12}
                />
              ) : (
                <StatCard 
                  title="Total Revenue" 
                  value="Access Restricted"
                  description="Contact admin for access"
                  icon={<Lock size={20} />}
                  className="opacity-60"
                />
              )}
              <StatCard 
                title="Reviews" 
                value={totalReviews}
                icon={<MessageSquare size={20} />}
              />
              <StatCard 
                title="Gallery Images" 
                value={totalGalleryImages}
                icon={<Images size={20} />}
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
          </TabsContent>

          {isPrimaryAdmin && (
            <TabsContent value="security" className="space-y-6">
              <SecurityMonitoringPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
