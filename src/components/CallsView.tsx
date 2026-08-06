import React, { useState } from 'react';
import { 
  Phone, Video, Search, ShieldCheck, CheckCircle2, UserCheck, 
  MapPin, PhoneCall, ArrowLeft, Calendar, Sparkles, Clock, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { BROKER_PROFILE } from '../data/mockProfiles';

export const CallsView: React.FC = () => {
  const { 
    profiles, 
    startCall, 
    meetRequests, 
    setActiveTab, 
    setActiveProfileModal 
  } = useApp();

  const [searchCallQuery, setSearchCallQuery] = useState('');

  // Filter profiles for call
  const callProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchCallQuery.toLowerCase()) ||
    p.locality.toLowerCase().includes(searchCallQuery.toLowerCase())
  );

  // Mock call logs
  const callLogs = [
    {
      id: 'log-1',
      profile: BROKER_PROFILE,
      type: 'incoming',
      time: 'Today, 10:45 AM',
      duration: '02:30',
      status: 'Admin Approved Line'
    },
    {
      id: 'log-2',
      profile: profiles[0],
      type: 'outgoing',
      time: 'Yesterday, 06:15 PM',
      duration: '01:12',
      status: 'Single Broker Verified'
    }
  ];

  const handleInitiateCall = (profile: UserProfile, type: 'audio' | 'video') => {
    // Start WebRTC call
    startCall(type);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Header */}
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
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                WebRTC Calls Hub
              </h1>
              <p className="text-xs text-slate-500">Admin Approved Calls & Direct Broker Assistance Desk</p>
            </div>
          </div>

          <button
            onClick={() => startCall('video')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Video className="w-4 h-4" />
            <span>Call Broker Desk</span>
          </button>
        </div>

        {/* Quick Direct Broker Call Card */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-5 shadow-lg border border-purple-800/50 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 z-10">
            <img
              src={BROKER_PROFILE.avatar}
              alt="Single Broker"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  100% Approved Line
                </span>
                <span className="text-[10px] text-purple-200 font-mono">Tiruppur Brokerage</span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">Single Broker Support & Clearance Desk</h3>
              <p className="text-xs text-purple-200">Connect instantly with our verified admin for booking clearance.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto z-10 shrink-0">
            <button
              onClick={() => startCall('audio')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Voice Call</span>
            </button>
            <button
              onClick={() => startCall('video')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
          </div>
        </div>

        {/* Search Profile to Select User to Call */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-600" />
            Search Profile & Call Admin Approved Users
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user profile name or locality to call..."
              value={searchCallQuery}
              onChange={(e) => setSearchCallQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {callProfiles.map(profile => {
              const booking = meetRequests.find(r => r.profileId === profile.id);
              const isApproved = booking?.status === 'broker_approved' || profile.verified;

              return (
                <div
                  key={profile.id}
                  className="p-3 bg-slate-50/80 hover:bg-slate-100 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between gap-3"
                >
                  <div 
                    className="flex items-center gap-2.5 cursor-pointer min-w-0"
                    onClick={() => setActiveProfileModal(profile)}
                  >
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">{profile.name}, {profile.age}</h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500" /> {profile.locality}
                      </p>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Admin Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-amber-600 mt-0.5">
                          <Clock className="w-3 h-3" /> Single Broker Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleInitiateCall(profile, 'audio')}
                      className="p-2 bg-slate-200 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
                      title="Voice Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleInitiateCall(profile, 'video')}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
                      title="Video Call (Attended by User)"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Call Logs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            Recent WebRTC Calls Log
          </h3>

          <div className="divide-y divide-slate-100">
            {callLogs.map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={log.profile.avatar}
                    alt={log.profile.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{log.profile.name}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        {log.status}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {log.time} • Duration: {log.duration}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => startCall('video')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Redial</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
