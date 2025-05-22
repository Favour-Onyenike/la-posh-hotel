
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Hotel,
  CalendarDays,
  MessageSquare,
  Image as ImageIcon,
  FileText,
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
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/admin/rooms", icon: <Hotel size={18} />, label: "Rooms" },
    { to: "/admin/bookings", icon: <CalendarDays size={18} />, label: "Bookings" },
    { to: "/admin/reviews", icon: <MessageSquare size={18} />, label: "Reviews" },
    { to: "/admin/gallery", icon: <ImageIcon size={18} />, label: "Gallery" },
    { to: "/admin/content", icon: <FileText size={18} />, label: "Content" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">La Posh</span>
            <span className="text-sm font-medium">Admin</span>
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
            onClick={handleSignOut}
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
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-6">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">La Posh</span>
                <span className="text-sm font-medium">Admin</span>
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
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
