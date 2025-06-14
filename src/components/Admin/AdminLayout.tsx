
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  User,
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
        "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-yellow-600 to-yellow-700 border-r-2 border-black transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-black">
          <img 
            src="/lovable-uploads/62098d96-b078-48ab-9a8e-c9421cbf891e.png" 
            alt="La Posh Signature Suites" 
            className="h-10 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-yellow-400 hover:text-yellow-300"
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
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors border",
                      isActive
                        ? "bg-black text-yellow-400 border-yellow-400 shadow-lg"
                        : "text-black hover:bg-black hover:text-yellow-400 border-transparent hover:border-yellow-400"
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

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-yellow-400">
          <div className="flex items-center mb-4 px-4">
            <User className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-400">{user?.email}</p>
              <p className="text-xs text-yellow-300">Administrator</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b-2 border-black bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-black lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h2 className="text-xl font-semibold text-black">
                Welcome <span className="text-yellow-600">{getDisplayName()}</span>
              </h2>
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
