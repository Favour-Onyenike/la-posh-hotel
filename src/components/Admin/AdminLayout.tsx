
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Users,
  Star,
  ImageIcon,
  Settings,
  Activity,
  UserCheck,
  Building,
  FileText,
} from "lucide-react";
import AdminProfileDropdown from "./AdminProfileDropdown";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/admin/bookings",
      icon: Calendar,
      label: "Bookings",
    },
    {
      href: "/admin/rooms",
      icon: Bed,
      label: "Rooms",
    },
    {
      href: "/admin/suites",
      icon: Building,
      label: "Suites",
    },
    {
      href: "/admin/gallery",
      icon: ImageIcon,
      label: "Gallery",
    },
    {
      href: "/admin/reviews",
      icon: Star,
      label: "Reviews",
    },
    {
      href: "/admin/events",
      icon: Calendar,
      label: "Events",
    },
    {
      href: "/admin/content-management",
      icon: FileText,
      label: "Content",
    },
    {
      href: "/admin/room-availability",
      icon: Settings,
      label: "Availability",
    },
    {
      href: "/admin/team-management",
      icon: UserCheck,
      label: "Team",
    },
    {
      href: "/admin/activity-logs",
      icon: Activity,
      label: "Activity Logs",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">La Posh Admin</h1>
        </div>
        
        <nav className="mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors",
                  isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Admin Panel
            </h2>
            <AdminProfileDropdown />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
