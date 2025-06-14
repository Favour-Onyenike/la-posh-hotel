
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

type BookingsByMonth = {
  month: string;
  count: number;
  revenue: number;
};

type BookingChartProps = {
  data: BookingsByMonth[];
};

const BookingChart = ({ data }: BookingChartProps) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Booking Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
);

export default BookingChart;
