import React from 'react';
import { Home, MessageSquare, Calendar, Shield, Users, Building2, ArrowLeft, BarChart3, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    adminSubTab, 
    setAdminSubTab, 
    conversations, 
    meetRequests 
  } = useApp();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingRequestsCount = meetRequests.filter(r => r.status === 'pending_broker_approval').length;

  // BROKER DESK MOBILE BOTTOM NAV (Only visible when activeTab === 'admin')
  if (activeTab === 'admin') {
    const brokerNavItems = [
      { id: 'overview', label: 'Dashboard', icon: BarChart3 },
      { id: 'broker_chat', label: 'Chat', icon: MessageSquare, badge: pendingRequestsCount },
      { id: 'meets', label: 'Clearance', icon: Shield, badge: pendingRequestsCount },
      { id: 'girl_profiles', label: 'Profiles', icon: Users },
      { id: 'service_points', label: 'Lounges', icon: Building2 },
      { id: 'broadcast', label: 'Alert', icon: Bell },
      { id: 'exit', label: 'Exit', icon: ArrowLeft },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-1 py-1 sm:hidden">
        <div className="flex items-center justify-around h-14 max-w-md mx-auto">
          {brokerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'exit' ? false : adminSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'exit') {
                    setActiveTab('home');
                  } else {
                    setAdminSubTab(item.id as any);
                  }
                }}
                className={`flex flex-col items-center justify-center min-w-[42px] px-1 h-full relative transition-colors ${
                  isActive ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-purple-600' : ''} transition-transform`} />
                  {!!item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1 py-0.2 rounded-full min-w-[13px] text-center border border-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] mt-1 tracking-tighter font-semibold truncate max-w-[46px]">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 w-6 h-0.5 bg-purple-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // STANDARD CLIENT VIEW MOBILE BOTTOM NAV ("Booking" instead of Connect)
  const navItems = [
    { id: 'home', label: 'Explore', icon: Home },
    { id: 'meet-requests', label: 'Booking', icon: Calendar, badge: pendingRequestsCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: totalUnreadMessages },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 sm:hidden">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-24 h-full relative transition-colors ${
                isActive ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-[14px] text-center border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-rose-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
