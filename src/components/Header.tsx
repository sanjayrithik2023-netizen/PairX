import React, { useState } from 'react';
import { 
  Heart, Bell, Search, MapPin, MessageSquare, Calendar, Home as HomeIcon, LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenSearchFilter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearchFilter }) => {
  const { 
    currentUser, 
    isAuthenticated, 
    notifications, 
    markNotificationsRead,
    setActiveTab, 
    setIsLoginModalOpen,
    activeTab,
    meetRequests
  } = useApp();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingRequestsCount = meetRequests.filter(r => r.status === 'pending_broker_approval').length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-2">
        
        {/* BRAND LOGO & LOCALITY TAG (ONLY TIRUPPUR) */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                PairX
              </span>
            </div>

            <div className="flex items-center text-[10px] sm:text-xs text-slate-500 gap-1 font-bold truncate">
              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
              <span>Tiruppur, TN</span>
            </div>
          </div>
        </div>

        {/* DESKTOP TOP NAVIGATION TABS */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {[
            { id: 'home', label: 'Explore', icon: HomeIcon },
            { id: 'meet-requests', label: 'Booking', icon: Calendar, badge: pendingRequestsCount },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[36px] ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110 text-rose-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* HEADER RIGHT ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Compact Search Button */}
          {onOpenSearchFilter && (
            <button
              onClick={onOpenSearchFilter}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative min-h-[36px] min-w-[36px] flex items-center justify-center border border-slate-200/80"
              title="Search Models & Service Points"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Button (Opens Page) */}
          <button
            onClick={() => {
              markNotificationsRead();
              setActiveTab('notifications');
            }}
            className={`p-2 rounded-xl transition-colors relative min-h-[36px] min-w-[36px] flex items-center justify-center border ${
              activeTab === 'notifications'
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50 border-slate-200/80'
            }`}
            title="Open Notifications Page"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Picture Shown */}
          {isAuthenticated ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-rose-300 transition-all cursor-pointer"
              title="View Profile"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-rose-500 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors min-h-[36px]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
