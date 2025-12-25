import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Bell
} from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // Desktop state
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsDesktopCollapsed(!isDesktopCollapsed);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Stock', path: '/stock', icon: Package },
    { name: 'Sales', path: '/sales', icon: ShoppingCart },
    { name: 'Crew', path: '/crew', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-30 bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800",
          // Mobile: Fixed width, slide in/out
          "w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: Static position, width controlled by collapse state
          "lg:static lg:translate-x-0",
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className={clsx(
          "flex items-center h-16 border-b border-slate-800 transition-all duration-300",
          isDesktopCollapsed ? "lg:justify-center px-0" : "justify-between px-6"
        )}>
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-lg">N</span>
            </div>
            <span className={clsx(
              "text-xl font-bold tracking-tight whitespace-nowrap transition-all duration-300",
              isDesktopCollapsed ? "lg:w-0 lg:opacity-0 lg:hidden" : "block"
            )}>
              Nexus
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                title={isDesktopCollapsed ? item.name : undefined}
                className={({ isActive }) => clsx(
                  "flex items-center rounded-lg transition-all duration-200 min-h-[48px]",
                  // Alignment and spacing changes based on collapse state
                  isDesktopCollapsed ? "lg:justify-center px-2 py-3" : "px-4 py-3 space-x-3",
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={clsx(
                  "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                  isDesktopCollapsed ? "lg:w-0 lg:opacity-0 lg:hidden" : "block"
                )}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button 
            onClick={onLogout}
            title={isDesktopCollapsed ? "Sign Out" : undefined}
            className={clsx(
              "flex items-center rounded-lg transition-colors min-h-[48px] text-slate-400 hover:text-red-400 hover:bg-slate-800",
              isDesktopCollapsed ? "lg:justify-center w-full p-2" : "w-full px-4 py-3 space-x-3"
            )}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={clsx(
              "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
              isDesktopCollapsed ? "lg:w-0 lg:opacity-0 lg:hidden" : "block"
            )}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 transition-all duration-300">
          {/* Toggle Button - Visible on both Mobile and Desktop now */}
          <button 
            onClick={toggleSidebar} 
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors mr-4"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1">
             <h1 className="text-lg font-semibold text-slate-800 capitalize">
               {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
             </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                AD
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-slate-700">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;