import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Coffee, ShieldCheck, 
  CheckCircle2, XCircle, AlertCircle, MessageSquare, Building2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MeetRequestsView: React.FC = () => {
  const { 
    meetRequests, 
    setActiveTab
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved'>('all');

  const filteredRequests = meetRequests.filter(req => {
    if (filterTab === 'pending') return req.status === 'pending_broker_approval';
    if (filterTab === 'approved') return req.status === 'broker_approved';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Booking Desk</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              My Bookings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              All meetups are processed by PairX Single Broker Desk and conducted at official Service Point lounges in Tiruppur.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-center">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterTab === 'all' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({meetRequests.length})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterTab === 'pending' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending ({meetRequests.filter(r => r.status === 'pending_broker_approval').length})
            </button>
            <button
              onClick={() => setFilterTab('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterTab === 'approved' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Approved ({meetRequests.filter(r => r.status === 'broker_approved').length})
            </button>
          </div>
        </div>

        {/* Meet Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
            <Coffee className="w-12 h-12 text-rose-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore verified female profiles on the home screen and submit a booking request to the Broker!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors inline-block"
            >
              Explore Profiles & Book
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Top Bar Status */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Booking ID #{req.id.slice(-5)}</span>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-purple-600" /> Single Broker Verified
                      </span>
                    </div>

                    {req.status === 'pending_broker_approval' && (
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Clearance
                      </span>
                    )}

                    {req.status === 'broker_approved' && (
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lounge Approved
                      </span>
                    )}

                    {req.status === 'declined' && (
                      <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Booking Declined
                      </span>
                    )}
                  </div>

                  {/* Profile & Booking Details */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.profileAvatar}
                        alt={req.profileName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500 shadow-xs"
                      />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{req.profileName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{req.servicePointName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 w-full sm:w-auto min-w-[200px]">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400 font-medium">Date & Time:</span>
                        <strong className="text-slate-800">{req.date} @ {req.time}</strong>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400 font-medium">Duration:</span>
                        <strong className="text-slate-800">{req.duration} Minutes</strong>
                      </div>
                    </div>
                  </div>

                  {/* Broker Lounge Pin Info */}
                  {req.status === 'broker_approved' && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          Official Lounge Access Pass
                        </span>
                        <span className="bg-emerald-700 text-white font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg">
                          PIN: {req.brokerApprovalPin || '8842'}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Present this pass PIN to the service manager upon arrival at <strong>{req.servicePointName}</strong>.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 min-h-[38px]"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>Chat with Broker Desk</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
