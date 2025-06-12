
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
  X,
  User
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
      `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, profile } = useAuth();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/admin/rooms", icon: <Hotel size={18} />, label: "Rooms" },
    { to: "/admin/suites", icon: <Crown size={18} />, label: "Suites" },
    { to: "/admin/bookings", icon: <CalendarDays size={18} />, label: "Bookings" },
    { to: "/admin/reviews", icon: <MessageSquare size={18} />, label: "Reviews" },
    { to: "/admin/gallery", icon: <ImageIcon size={18} />, label: "Gallery" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/442a4b2f-8a6f-4bd7-9c4d-a0a37dfb8260.png" 
              alt="La Posh Logo" 
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">La Posh</span>
              <span className="text-xs font-medium text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>
        <div className="mt-auto border-t p-3">
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <User size={16} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{profile?.full_name || profile?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
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
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-6">
              <Link to="/admin/dashboard" className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/442a4b2f-8a6f-4bd7-9c4d-a0a37dfb8260.png" 
                  alt="La Posh Logo" 
                  className="h-8 w-auto"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">La Posh</span>
                  <span className="text-xs font-medium text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-3">
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
            <div className="mt-auto border-t p-3">
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <User size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{profile?.full_name || profile?.email}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
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

      {/* Main Content - Add padding-top for mobile */}
      <main className="flex-1 overflow-y-auto p-4 pt-14 lg:p-8 lg:pt-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
