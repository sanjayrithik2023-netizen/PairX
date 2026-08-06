import React, { useState } from 'react';
import { 
  Heart, Bell, Search, ShieldCheck, User as UserIcon, LogIn, Lock, 
  MapPin, Building2, Menu, X, ChevronRight, MessageSquare, Calendar, 
  Home as HomeIcon, PhoneCall
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenSearchFilter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearchFilter }) => {
  const { 
    currentUser, 
    isAuthenticated, 
    isAdmin,
    notifications, 
    markNotificationsRead,
    setActiveTab, 
    setIsLoginModalOpen,
    userPreferences,
    activeTab,
    meetRequests,
    startCall
  } = useApp();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingRequestsCount = meetRequests.filter(r => r.status === 'pending_broker_approval').length;

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* BRAND LOGO & LOCALITY TAG */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-200/50 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                PairX
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded-md border border-purple-200 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-purple-700" />
                <span className="hidden xs:inline">Broker Desk</span>
              </span>
            </div>

            <div className="flex items-center text-[10px] sm:text-xs text-slate-500 gap-1 font-semibold truncate max-w-[130px] sm:max-w-none">
              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
              <span className="truncate">{userPreferences.localityFilter || 'Tiruppur Service Points'}</span>
            </div>
          </div>
        </div>

        {/* DESKTOP TOP NAVIGATION TABS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {[
            { id: 'home', label: 'Explore Models', icon: HomeIcon },
            { id: 'messages', label: 'Chat Desk', icon: MessageSquare },
            { id: 'meet-requests', label: 'Clearances', icon: Calendar, badge: pendingRequestsCount },
            { id: 'admin', label: 'Broker Console', icon: Lock, highlight: true },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                  isActive
                    ? item.highlight
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* HEADER RIGHT ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Direct Broker Desk Button (Mobile & Desktop) */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-extrabold rounded-xl border flex items-center gap-1.5 transition-all min-h-[40px] shadow-xs ${
              activeTab === 'admin'
                ? 'bg-purple-700 text-white border-purple-800 ring-2 ring-purple-300' 
                : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700'
            }`}
            title="Broker Admin Master Console"
          >
            <Lock className="w-3.5 h-3.5 text-purple-200 shrink-0" />
            <span className="hidden xs:inline">
              {isAdmin ? 'Broker Console' : 'Broker Desk'}
            </span>
            <span className="xs:hidden">
              Desk
            </span>
            {pendingRequestsCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Search Button */}
          {onOpenSearchFilter && (
            <button
              onClick={onOpenSearchFilter}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200/80"
              title="Search Models & Service Points"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                if (!showNotificationsDropdown) markNotificationsRead();
              }}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200/80"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel (Mobile & Desktop Responsive) */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900">Desk Notifications</h4>
                  <span className="text-[11px] text-rose-600 font-bold cursor-pointer hover:underline" onClick={markNotificationsRead}>
                    Mark all read
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${!n.read ? 'bg-rose-50/50' : ''}`}>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          {n.type === 'verification' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          <span>{n.title}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5 text-[11px] leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Profile / Sign In */}
          {isAuthenticated ? (
            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
              title="View Account Profile"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-purple-500 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors min-h-[40px]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* MOBILE MENU TOGGLE DRAWER BUTTON */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200/80"
            title="Toggle Navigation Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER OVERLAY */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
              <div>
                <strong className="text-slate-900 font-bold block">Tiruppur Broker Console</strong>
                <span className="text-[10px] text-slate-500">Official Clearance & WebRTC Hotline</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowMobileMenu(false);
                startCall('video');
              }}
              className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg shadow-xs flex items-center gap-1 min-h-[32px]"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call Broker</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'home', label: 'Explore Models', icon: HomeIcon, color: 'text-rose-500' },
              { id: 'messages', label: 'Chat Desk', icon: MessageSquare, color: 'text-emerald-600' },
              { id: 'meet-requests', label: 'Clearances', icon: Calendar, badge: pendingRequestsCount, color: 'text-amber-600' },
              { id: 'admin', label: 'Broker Console', icon: Lock, color: 'text-purple-600' },
              { id: 'profile', label: 'My Profile', icon: UserIcon, color: 'text-slate-600' },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-purple-50 border-purple-300 text-purple-950 font-extrabold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {!!item.badge && item.badge > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
