
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import AdminProfileDropdown from './AdminProfileDropdown';
import { 
  LayoutDashboard, 
  Calendar, 
  BedDouble, 
  Star, 
  MessageSquare, 
  Images,
  CalendarDays,
  Menu,
  X,
  LogOut,
  UserPlus,
  ToggleLeft
} from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut, user, profile } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Rooms', href: '/admin/rooms', icon: BedDouble },
    { name: 'Suites', href: '/admin/suites', icon: Star },
    { name: 'Room Availability', href: '/admin/room-availability', icon: ToggleLeft },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Gallery', href: '/admin/gallery', icon: Images },
    { name: 'Events', href: '/admin/events', icon: CalendarDays },
    { name: 'Team', href: '/admin/team', icon: UserPlus },
    { name: 'Activity Logs', href: '/admin/activity-logs', icon: MessageSquare },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  // Get display name prioritizing full_name, then username, then email prefix
  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (profile?.username) {
      return profile.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Admin';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <img 
            src="/lovable-uploads/62098d96-b078-48ab-9a8e-c9421cbf891e.png" 
            alt="La Posh Signature Suites" 
            className="h-10 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
          <div className="flex items-center mb-4 px-4">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
              <AvatarFallback className="bg-gray-600 text-gray-200 text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{getDisplayName()}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome {getDisplayName()}
              </h2>
            </div>
            
            {/* Profile Dropdown in header */}
            <div className="flex items-center ml-auto">
              <AdminProfileDropdown />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
