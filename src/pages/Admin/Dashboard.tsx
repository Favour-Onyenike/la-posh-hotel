
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Hotel, 
  CalendarDays, 
  DollarSign, 
  Star,
  TrendingUp,
  Users,
  ArrowRightLeft,
  CheckSquare
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { supabase } from '@/integrations/supabase/client';
import { Booking, Room } from '@/types/supabase';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

type BookingsByMonth = {
  month: string;
  count: number;
  revenue: number;
};

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
};

const StatCard = ({ title, value, description, icon, trend, className }: StatCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 p-1 text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs font-medium">
          <TrendingUp 
            size={14} 
            className={trend >= 0 ? "text-emerald-500" : "text-rose-500"} 
          />
          <span className={trend >= 0 ? "text-emerald-500" : "text-rose-500"}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [availableRooms, setAvailableRooms] = useState<number>(0);
  const [pendingBookings, setPendingBookings] = useState<number>(0);
  const [confirmedBookings, setConfirmedBookings] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [checkInsToday, setCheckInsToday] = useState<number>(0);
  const [checkOutsToday, setCheckOutsToday] = useState<number>(0);
  const [bookingsByMonth, setBookingsByMonth] = useState<BookingsByMonth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch total rooms
        const { data: rooms } = await supabase
          .from('rooms')
          .select('*');
        
        setTotalRooms(rooms?.length || 0);
        
        // Get today's date
        const today = new Date();
        const todayString = format(today, 'yyyy-MM-dd');
        
        // Fetch active bookings to calculate available rooms
        const { data: activeBookings } = await supabase
          .from('bookings')
          .select('*')
          .lte('check_in_date', todayString)
          .gte('check_out_date', todayString)
          .in('status', ['confirmed', 'checked_in']);
        
        setAvailableRooms(Math.max(0, (rooms?.length || 0) - (activeBookings?.length || 0)));
        
        // Fetch pending bookings
        const { data: pendingBookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('status', 'pending');
        
        setPendingBookings(pendingBookingsData?.length || 0);
        
        // Fetch confirmed bookings
        const { data: confirmedBookingsData } = await supabase
          .from('bookings')
          .select('*')
          .in('status', ['confirmed', 'checked_in']);
        
        setConfirmedBookings(confirmedBookingsData?.length || 0);
        
        // Calculate total revenue from all bookings
        const { data: allBookings } = await supabase
          .from('bookings')
          .select('*');
        
        const totalRevenue = (allBookings || []).reduce(
          (sum: number, booking: Booking) => sum + Number(booking.total_price),
          0
        );
        
        setRevenue(totalRevenue);
        
        // Fetch check-ins for today
        const { data: todayCheckIns } = await supabase
          .from('bookings')
          .select('*')
          .eq('check_in_date', todayString);
        
        setCheckInsToday(todayCheckIns?.length || 0);
        
        // Fetch check-outs for today
        const { data: todayCheckOuts } = await supabase
          .from('bookings')
          .select('*')
          .eq('check_out_date', todayString);
        
        setCheckOutsToday(todayCheckOuts?.length || 0);
        
        // Generate monthly booking data for the chart
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const month = subMonths(today, i);
          const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
          const endDate = format(endOfMonth(month), 'yyyy-MM-dd');
          const monthName = format(month, 'MMM');
          
          const { data: monthBookings } = await supabase
            .from('bookings')
            .select('*')
            .gte('check_in_date', startDate)
            .lte('check_in_date', endDate);
          
          const monthRevenue = (monthBookings || []).reduce(
            (sum: number, booking: Booking) => sum + Number(booking.total_price),
            0
          );
          
          months.push({
            month: monthName,
            count: monthBookings?.length || 0,
            revenue: monthRevenue
          });
        }
        
        setBookingsByMonth(months);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Admin overview of bookings and hotel statistics.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Rooms" 
            value={totalRooms}
            icon={<Hotel size={20} />}
          />
          <StatCard 
            title="Available Rooms" 
            value={availableRooms}
            description={`${Math.round((availableRooms / totalRooms) * 100) || 0}% occupancy rate`}
            icon={<Hotel size={20} />}
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${revenue.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            trend={12}
          />
          <StatCard 
            title="Confirmed Bookings" 
            value={confirmedBookings}
            description={`${pendingBookings} pending reservations`}
            icon={<CalendarDays size={20} />}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Booking Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsByMonth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: any, name: any) => {
                        if (name === 'revenue') {
                          return [`$${Number(value).toLocaleString()}`, 'Revenue'];
                        }
                        return [value, 'Bookings'];
                      }}
                    />
                    <Bar name="count" dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <ArrowRightLeft size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-ins Today</p>
                    <p className="text-2xl font-bold">{checkInsToday}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <CheckSquare size={18} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-outs Today</p>
                    <p className="text-2xl font-bold">{checkOutsToday}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <Users size={18} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Guests</p>
                    <p className="text-2xl font-bold">{confirmedBookings}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <Star size={18} className="text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Occupancy Rate</p>
                    <p className="text-2xl font-bold">{Math.round((confirmedBookings / totalRooms) * 100) || 0}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
