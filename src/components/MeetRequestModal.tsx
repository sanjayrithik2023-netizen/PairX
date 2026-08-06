import React, { useState, useEffect } from 'react';
import { 
  X, Coffee, Calendar, Clock, MapPin, ShieldCheck, 
  CheckCircle2, AlertCircle, ArrowRight, Building2,
  Phone, Video, MessageSquare, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MeetDuration } from '../types';

export const MeetRequestModal: React.FC = () => {
  const { 
    activeMeetModal, 
    setActiveMeetModal, 
    createMeetRequest, 
    setActiveTab,
    servicePoints,
    startCall,
    BROKER_PROFILE
  } = useApp();

  const [duration, setDuration] = useState<MeetDuration>(30);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('05:30 PM');
  const [notes, setNotes] = useState<string>('Requesting 30-min coffee meeting clearance.');
  
  // Timer Connecting View state
  const [isConnectingCall, setIsConnectingCall] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);

  const targetProfile = activeMeetModal;

  // Countdown effect when connecting call is active
  useEffect(() => {
    let timer: any;
    if (isConnectingCall && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isConnectingCall && countdown === 0) {
      // Auto-connect video call upon timer completion
      handleConnectCall('video');
    }
    return () => clearInterval(timer);
  }, [isConnectingCall, countdown]);

  if (!targetProfile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default service point assigned initially; broker will pick/confirm official service point upon clearance
    createMeetRequest(
      targetProfile,
      servicePoints[0] || { id: 'sp-1', name: 'PairX Executive Lounge' },
      duration,
      selectedDate,
      selectedTime,
      notes
    );
    // Trigger automated connecting call timer view
    setIsConnectingCall(true);
    setCountdown(15);
  };

  const handleConnectCall = (type: 'video' | 'audio') => {
    setIsConnectingCall(false);
    setActiveMeetModal(null);
    startCall(type);
  };

  const handleOpenChat = () => {
    setIsConnectingCall(false);
    setActiveMeetModal(null);
    setActiveTab('meet-requests');
  };

  const getStatusText = () => {
    if (countdown > 11) return "⚡ Encrypting booking request payload & security tokens...";
    if (countdown > 7) return "📡 Dispatching request to PairX Tiruppur Single Broker Desk...";
    if (countdown > 3) return "🔍 Broker Desk inspecting concierge slot & ID clearance...";
    if (countdown > 0) return "📞 Establishing high-definition WebRTC voice/video line...";
    return "🎉 Connected! Launching live Broker video call...";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative my-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsConnectingCall(false);
            setActiveMeetModal(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold z-10 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConnectingCall ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Target Profile Brief */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
              <img
                src={targetProfile.avatar}
                alt={targetProfile.name}
                className="w-12 h-12 rounded-xl object-cover border border-rose-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{targetProfile.name}, {targetProfile.age}</h3>
                  <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Broker Managed
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{targetProfile.locality}</span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Request Broker Booking</h2>
              <p className="text-xs text-slate-500">Submit meeting request to PairX Broker for profile {targetProfile.name}.</p>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Meeting Duration</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDuration(30)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    duration === 30
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">30 Minutes</span>
                    <Clock className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Quick Casual Filter Coffee Chat</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDuration(60)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    duration === 60
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">60 Minutes</span>
                    <Coffee className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Relaxed Conversation & Snacks</p>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="11:30 AM">11:30 AM (Morning Slot)</option>
                  <option value="04:00 PM">04:00 PM (Afternoon Slot)</option>
                  <option value="05:30 PM">05:30 PM (Evening Slot)</option>
                  <option value="07:00 PM">07:00 PM (Late Evening Slot)</option>
                </select>
              </div>
            </div>

            {/* Client Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Client Notes for Broker</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-rose-500"
                placeholder="Write any message or preferences for the Broker..."
              />
            </div>

            {/* Broker Protocol Guarantee Notice */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-purple-800 leading-tight">
                <strong>Broker Security Protocol:</strong> Your request is sent directly to the single Broker Desk. The Broker will assign an official Tiruppur Service Point and clear your meeting slot.
              </p>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Request & Connect Broker Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        ) : (
          /* AUTOMATED BROKER CALL CONNECTING TIMER VIEW */
          <div className="-m-6 p-6 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900 text-white space-y-6 text-center relative">
            
            {/* Header Title */}
            <div className="space-y-1.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>PairX Concierge Line</span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Connecting Live Broker Clearance Call
              </h3>
              <p className="text-xs text-purple-200/80 max-w-xs mx-auto">
                Request for <strong className="text-white">{targetProfile.name}</strong> forwarded. Connecting to Single Broker Desk...
              </p>
            </div>

            {/* Pulsing Avatar Radar & Countdown Timer Badge */}
            <div className="relative py-4 flex items-center justify-center">
              
              {/* Radar Rings */}
              <div className="absolute w-36 h-36 rounded-full bg-purple-600/20 animate-ping"></div>
              <div className="absolute w-28 h-28 rounded-full bg-indigo-500/30 animate-pulse"></div>

              {/* Center Broker Avatar Container */}
              <div className="relative z-10 w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-2xl">
                <img
                  src={BROKER_PROFILE.avatar}
                  alt={BROKER_PROFILE.name}
                  className="w-full h-full rounded-full object-cover border-2 border-slate-950"
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950">
                  ✓
                </span>
              </div>

              {/* Countdown Digital Badge */}
              <div className="absolute -bottom-2 z-20 bg-slate-900/90 border border-purple-400/50 px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-mono font-extrabold text-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Auto-call in {countdown}s</span>
              </div>
            </div>

            {/* Status Progress Bar & Text */}
            <div className="bg-slate-900/80 border border-purple-500/30 p-4 rounded-2xl text-xs space-y-2 max-w-xs mx-auto shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-purple-200 font-medium">
                <span>Signal Progress</span>
                <span className="font-mono text-amber-300 font-bold">{Math.round(((15 - countdown) / 15) * 100)}%</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${((15 - countdown) / 15) * 100}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-purple-200 font-semibold leading-tight pt-1 min-h-[32px] flex items-center justify-center">
                {getStatusText()}
              </p>
            </div>

            {/* Direct Action CTAs */}
            <div className="space-y-2 pt-1 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => handleConnectCall('video')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <Video className="w-4 h-4 text-purple-200" />
                <span>Launch Video Call Now</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleConnectCall('audio')}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 min-h-[40px] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Voice Call</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 min-h-[40px] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>Open Chat</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenChat}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline pt-1 block mx-auto"
            >
              Dismiss timer & track status in bookings dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};


