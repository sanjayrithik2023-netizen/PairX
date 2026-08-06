import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Coffee, ShieldCheck, 
  CheckCircle2, XCircle, AlertCircle, MessageSquare, Building2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MeetRequest } from '../types';

export const MeetRequestsView: React.FC = () => {
  const { 
    meetRequests, 
    setActiveTab, 
    currentUser
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Broker Service Point Bookings</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              My Broker Clearance Requests
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              All bookings are processed by PairX Single Broker Desk and conducted at official Service Point lounges.
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
            <h3 className="text-base font-bold text-slate-800">No booking requests found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore verified female profiles on the home screen and submit a request to the Broker!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors inline-block"
            >
              Explore Girl Profiles
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
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Request #{req.id.slice(-5)}</span>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-purple-600" /> Broker Monitored
                      </span>
                    </div>

                    {/* Status Pill */}
                    {req.status === 'pending_broker_approval' && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Pending Broker Clearance
                      </span>
                    )}
                    {req.status === 'broker_approved' && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Broker
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Declined by Broker
                      </span>
                    )}
                  </div>

                  {/* Details Content */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.targetProfilePhoto}
                        alt={req.targetProfileName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500 shadow-xs"
                      />
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{req.targetProfileName}</h3>
                        <p className="text-xs text-rose-600 font-semibold mt-0.5">
                          Verified Profile (Broker Managed)
                        </p>
                      </div>
                    </div>

                    {/* Service Point Schedule Badge */}
                    <div className="bg-rose-50/70 border border-rose-100 p-3 rounded-2xl space-y-1 text-xs text-rose-950 font-medium">
                      <div className="flex items-center gap-2 font-bold text-rose-700">
                        <Coffee className="w-4 h-4" />
                        <span>{req.durationMinutes} Min Meeting</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{req.date} at {req.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold">{req.servicePointName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {req.notes && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Your Note: </span>
                      "{req.notes}"
                    </div>
                  )}

                  {req.brokerNotes && (
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-purple-900 font-medium">
                      <span className="font-bold text-purple-700">Broker Response: </span>
                      "{req.brokerNotes}"
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Single Broker Desk</span>
                    </button>

                    {req.status === 'broker_approved' && (
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                      >
                        Open Broker WebRTC Call
                      </button>
                    )}
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

