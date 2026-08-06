import React, { useState } from 'react';
import { 
  Bell, Check, ShieldCheck, Calendar, MessageSquare, Phone, 
  Sparkles, CheckCheck, Trash2, ArrowLeft, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationsRead, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'meet') return n.type === 'meet_request';
    if (filterType === 'message') return n.type === 'message' || n.type === 'call';
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'meet_request':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'call':
        return <Phone className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-600" />
                Notifications Page
              </h1>
              <p className="text-xs text-slate-500">Live updates from PairX Single Broker Desk & Lounge Center</p>
            </div>
          </div>

          <button
            onClick={markNotificationsRead}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Notifications' },
            { id: 'meet', label: 'Booking Updates' },
            { id: 'message', label: 'Messages & Calls' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                filterType === tab.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No Notifications Found</h3>
              <p className="text-xs text-slate-500">You are all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div 
                key={n.id} 
                className={`p-4 transition-colors flex items-start gap-3 hover:bg-slate-50/80 ${
                  !n.read ? 'bg-rose-50/40 border-l-4 border-rose-600' : ''
                }`}
              >
                <div className="p-2.5 rounded-2xl bg-slate-100 shrink-0 mt-0.5">
                  {getIconForType(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  
                  {n.type === 'meet_request' && (
                    <button
                      onClick={() => setActiveTab('meet-requests')}
                      className="mt-2.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>View My Bookings</span>
                    </button>
                  )}

                  {(n.type === 'message' || n.type === 'call') && (
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="mt-2.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Broker Chat</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
