
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Hotel,
  Crown,
  CalendarDays,
  MessageSquare,
  Image as ImageIcon,
  LogOut,
  Menu,
  User,
  Settings,
  Users,
  Globe
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const NavItem = ({ to, icon, label, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-4 py-3 text-white transition-all hover:bg-gray-700 ${
        isActive ? "bg-blue-600" : ""
      }`
    }
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, profile } = useAuth();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/admin/rooms", icon: <Hotel size={20} />, label: "Rooms" },
    { to: "/admin/suites", icon: <Crown size={20} />, label: "Suites" },
    { to: "/admin/bookings", icon: <CalendarDays size={20} />, label: "Bookings" },
    { to: "/admin/reviews", icon: <MessageSquare size={20} />, label: "Reviews" },
    { to: "/admin/gallery", icon: <ImageIcon size={20} />, label: "Gallery" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar - Dark theme like template */}
      <aside className="hidden w-64 flex-col bg-gray-800 lg:flex">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-600 rounded-lg p-3 mb-3">
              <Hotel className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">PHP</h2>
            <p className="text-gray-400 text-sm">HOTEL SITE</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
          
          {/* Additional menu items to match template */}
          <div className="pt-4 border-t border-gray-700">
            <NavItem
              to="/admin/users"
              icon={<Users size={20} />}
              label="Admin Users"
            />
            <NavItem
              to="/"
              icon={<Globe size={20} />}
              label="Website"
            />
            <NavItem
              to="/admin/settings"
              icon={<Settings size={20} />}
              label="Settings"
            />
          </div>
        </nav>
        
        <div className="mt-auto border-t border-gray-700 p-4">
          <div className="mb-3 flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">{profile?.full_name || 'Administrator'}</p>
              <p className="text-xs text-gray-400">Admin User</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={signOut}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gray-800 border-gray-700">
          {/* Mobile content matches desktop */}
          <div className="flex h-full flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-600 rounded-lg p-3 mb-3">
                  <Hotel className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-white font-bold text-lg">PHP</h2>
                <p className="text-gray-400 text-sm">HOTEL SITE</p>
              </div>
            </div>
            
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
            
            <div className="mt-auto border-t border-gray-700 p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Blue like template */}
        <header className="bg-blue-500 text-white p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-100 hover:bg-blue-400 hover:text-white"
                onClick={() => window.open('/', '_blank')}
              >
                <Globe size={16} className="mr-2" />
                OPEN THE MAIN SITE
              </Button>
              <span className="text-blue-100">administrator ▼</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pt-6 lg:p-8 lg:pt-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
