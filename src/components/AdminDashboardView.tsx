import React, { useState } from 'react';
import { 
  ShieldAlert, Users, Calendar, CheckCircle2, XCircle, 
  Search, Radio, Activity, Lock, AlertTriangle, ShieldCheck, Plus, Trash2, Edit3, Building2, MapPin, UserPlus, MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, ServicePoint } from '../types';
import { BrokerChatView } from './BrokerChatView';

export const AdminDashboardView: React.FC = () => {
  const { 
    isAdmin, 
    loginDemoUser, 
    profiles, 
    servicePoints,
    meetRequests, 
    updateMeetRequestStatus,
    broadcastNotification,
    addGirlProfile,
    updateGirlProfile,
    deleteGirlProfile,
    addServicePoint,
    updateServicePoint,
    deleteServicePoint,
    adminSubTab,
    setAdminSubTab
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [userSearch, setUserSearch] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Broker Notes & Service Point Selection for Meet Request Approval
  const [selectedReqForApproval, setSelectedReqForApproval] = useState<string | null>(null);
  const [brokerNoteInput, setBrokerNoteInput] = useState('');
  const [selectedSPIdForApproval, setSelectedSPIdForApproval] = useState<string>('');

  // Girl Profile Form State
  const [showGirlModal, setShowGirlModal] = useState(false);
  const [editingGirlId, setEditingGirlId] = useState<string | null>(null);
  const [girlForm, setGirlForm] = useState({
    name: '',
    age: 24,
    occupation: '',
    locality: 'Rayapuram, Tiruppur',
    bio: '',
    interests: 'Coffee, Music, Travel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    intent: 'Long-term Relationship',
    education: 'Bachelor Degree',
    languages: 'Tamil, English'
  });

  // Service Point Form State
  const [showSPModal, setShowSPModal] = useState(false);
  const [editingSPId, setEditingSPId] = useState<string | null>(null);
  const [spForm, setSPForm] = useState({
    name: '',
    type: 'Executive Lounge Hub',
    address: '142 Avinashi Road',
    locality: 'Avinashi Road, Tiruppur',
    managerContact: '+91 98420 11223',
    facilities: 'Single Entry Security, CCTV Lounge, VIP Access',
    activeStatus: 'Active' as 'Active' | 'Maintenance'
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === 'admin') {
      loginDemoUser('admin');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    broadcastNotification(broadcastTitle.trim(), broadcastMsg.trim());
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  // Submit Girl Profile
  const handleSaveGirlProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!girlForm.name.trim()) return;

    const interestArr = girlForm.interests.split(',').map(s => s.trim()).filter(Boolean);
    const langArr = girlForm.languages.split(',').map(s => s.trim()).filter(Boolean);

    if (editingGirlId) {
      updateGirlProfile(editingGirlId, {
        name: girlForm.name,
        age: Number(girlForm.age),
        occupation: girlForm.occupation,
        locality: girlForm.locality,
        bio: girlForm.bio,
        interests: interestArr,
        avatar: girlForm.avatar,
        photos: [girlForm.avatar],
        intent: girlForm.intent,
        education: girlForm.education,
        languages: langArr
      });
    } else {
      addGirlProfile({
        name: girlForm.name,
        age: Number(girlForm.age),
        gender: 'female',
        occupation: girlForm.occupation || 'Tiruppur Professional',
        locality: girlForm.locality,
        bio: girlForm.bio || 'Verified Tiruppur resident managed by PairX Broker Desk.',
        interests: interestArr.length ? interestArr : ['Coffee', 'Reading'],
        avatar: girlForm.avatar,
        photos: [girlForm.avatar],
        managedByBroker: true,
        verified: true,
        distanceKm: 2.1,
        online: true,
        lastActive: 'Managed by Broker',
        intent: girlForm.intent,
        education: girlForm.education,
        languages: langArr
      });
    }
    setShowGirlModal(false);
    setEditingGirlId(null);
  };

  const handleEditGirl = (girl: UserProfile) => {
    setEditingGirlId(girl.id);
    setGirlForm({
      name: girl.name,
      age: girl.age,
      occupation: girl.occupation,
      locality: girl.locality,
      bio: girl.bio,
      interests: girl.interests.join(', '),
      avatar: girl.avatar,
      intent: girl.intent || 'Long-term Relationship',
      education: girl.education || 'Bachelor Degree',
      languages: (girl.languages || []).join(', ')
    });
    setShowGirlModal(true);
  };

  // Submit Service Point
  const handleSaveServicePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spForm.name.trim()) return;

    const facilityArr = spForm.facilities.split(',').map(s => s.trim()).filter(Boolean);

    if (editingSPId) {
      updateServicePoint(editingSPId, {
        name: spForm.name,
        type: spForm.type,
        address: spForm.address,
        locality: spForm.locality,
        managerContact: spForm.managerContact,
        facilities: facilityArr,
        activeStatus: spForm.activeStatus
      });
    } else {
      addServicePoint({
        name: spForm.name,
        type: spForm.type,
        address: spForm.address,
        locality: spForm.locality,
        managerContact: spForm.managerContact,
        facilities: facilityArr,
        activeStatus: spForm.activeStatus
      });
    }
    setShowSPModal(false);
    setEditingSPId(null);
  };

  const handleEditSP = (sp: ServicePoint) => {
    setEditingSPId(sp.id);
    setSPForm({
      name: sp.name,
      type: sp.type,
      address: sp.address,
      locality: sp.locality,
      managerContact: sp.managerContact,
      facilities: sp.facilities.join(', '),
      activeStatus: sp.activeStatus
    });
    setShowSPModal(true);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">PairX Single Broker Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Authorized single broker login for Tiruppur service points & girl profile clearance.</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block text-left mb-1">Enter Broker Passcode</label>
              <input
                type="password"
                placeholder="Passcode (Demo: admin123)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full min-h-[44px] px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {pinError && <p className="text-xs text-rose-400 mt-1 text-left">Incorrect passcode. Try 'admin123'</p>}
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
            >
              Authenticate Single Broker
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={() => loginDemoUser('admin')}
              className="text-xs text-purple-400 hover:underline min-h-[44px] py-2"
            >
              One-Click Broker Login (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const girlProfiles = profiles.filter(p => p.gender === 'female');

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-3">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">

        {/* Top Navigation Tabs for Broker Desk (Desktop & Tablet) */}
        <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight flex items-center gap-2">
                <span>Broker Desk</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-300">
                  Online
                </span>
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'overview', label: '📊 Dashboard' },
              { id: 'broker_chat', label: '💬 Chat Desk', badge: meetRequests.filter(r => r.status === 'pending_broker_approval').length },
              { id: 'meets', label: '🛡️ Clearances', badge: meetRequests.filter(r => r.status === 'pending_broker_approval').length },
              { id: 'girl_profiles', label: `👥 Profiles (${girlProfiles.length})` },
              { id: 'service_points', label: `🛋️ Lounges (${servicePoints.length})` },
              { id: 'broadcast', label: '📢 System Alert' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminSubTab(tab.id as any)}
                className={`py-1.5 px-3 font-bold text-xs rounded-xl transition-all min-h-[36px] flex items-center gap-1.5 ${
                  adminSubTab === tab.id
                    ? 'bg-purple-600 text-white shadow-xs font-extrabold'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SEPARATE DEDICATED DASHBOARD PAGE (Only shown when adminSubTab === 'overview') */}
        {adminSubTab === 'overview' && (
          <div className="space-y-5">
            {/* Admin Banner */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>PairX Tiruppur Single Broker Desk</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">Broker Master Dashboard</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage verified girl profiles, official service points, client meet requests & WebRTC desk.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 min-h-[40px] ${
                    maintenanceMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{maintenanceMode ? 'Desk Paused' : 'Live Broker Desk'}</span>
                </button>
              </div>
            </div>

            {/* Admin Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div 
                onClick={() => setAdminSubTab('girl_profiles')}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Girl Profiles</span>
                <div className="text-2xl font-extrabold text-slate-900 flex items-center justify-between">
                  <span>{girlProfiles.length}</span>
                  <Users className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Broker Verified & Managed</span>
              </div>

              <div 
                onClick={() => setAdminSubTab('service_points')}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Points</span>
                <div className="text-2xl font-extrabold text-slate-900 flex items-center justify-between">
                  <span>{servicePoints.length}</span>
                  <Building2 className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-[10px] text-slate-500">Official Tiruppur Lounges</span>
              </div>

              <div 
                onClick={() => setAdminSubTab('meets')}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Meet Requests</span>
                <div className="text-2xl font-extrabold text-slate-900 flex items-center justify-between">
                  <span>{meetRequests.length}</span>
                  <Calendar className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-[10px] text-amber-600 font-semibold">{meetRequests.filter(r => r.status === 'pending_broker_approval').length} Pending Clearance</span>
              </div>

              <div 
                onClick={() => setAdminSubTab('broker_chat')}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">WebRTC Hotline</span>
                <div className="text-2xl font-extrabold text-emerald-600 flex items-center justify-between">
                  <span>Active</span>
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500">Single Broker Call Channel</span>
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                onClick={() => setAdminSubTab('broker_chat')}
                className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl cursor-pointer hover:bg-emerald-100/70 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">WhatsApp Broker Chat Desk</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">Chat directly with clients, verify IDs & send lounge pins.</p>
                </div>
              </div>

              <div 
                onClick={() => setAdminSubTab('meets')}
                className="bg-amber-50 border border-amber-200 p-4 rounded-2xl cursor-pointer hover:bg-amber-100/70 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Clearance Approvals</h4>
                  <p className="text-[11px] text-amber-900 font-medium">{meetRequests.filter(r => r.status === 'pending_broker_approval').length} pending requests awaiting lounge clearance.</p>
                </div>
              </div>

              <div 
                onClick={() => setAdminSubTab('girl_profiles')}
                className="bg-purple-50 border border-purple-200 p-4 rounded-2xl cursor-pointer hover:bg-purple-100/70 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Add / Manage Girl Profiles</h4>
                  <p className="text-[11px] text-purple-900 font-medium">Upload new verified female profiles in Tiruppur.</p>
                </div>
              </div>
            </div>

            {/* Operational Logs */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Broker Operational Activity Audit</h3>
              <div className="space-y-2.5">
                {[
                  { time: '10:45 AM', event: 'Broker clearance approved for request req-101 at Rayapuram Service Lounge.' },
                  { time: '10:12 AM', event: 'New Girl Profile "Ananya Krishnan" added to broker directory.' },
                  { time: '09:30 AM', event: 'Service Point #sp-1 lounge availability synced.' },
                  { time: '08:15 AM', event: 'Single Broker WebRTC Desk connected and ready for client calls.' }
                ].map((log, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="text-slate-700 font-medium">{log.event}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 0: Broker WhatsApp Chat Desk (Dedicated Page without clutter) */}
        {adminSubTab === 'broker_chat' && <BrokerChatView />}

        {/* Tab 2: Girl Profiles CRUD */}
        {adminSubTab === 'girl_profiles' && (
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Verified Girl Profiles (Broker Managed)</h3>
                <p className="text-xs text-slate-500">Only the Broker creates and edits these profiles to safeguard identity.</p>
              </div>

              <button
                onClick={() => {
                  setEditingGirlId(null);
                  setGirlForm({
                    name: '',
                    age: 24,
                    occupation: 'Textile Merchandiser',
                    locality: 'Rayapuram, Tiruppur',
                    bio: 'Verified Tiruppur profile managed exclusively by PairX Broker.',
                    interests: 'Coffee, Classical Music, Badminton',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                    intent: 'Long-term Relationship',
                    education: 'Bachelor Degree',
                    languages: 'Tamil, English'
                  });
                  setShowGirlModal(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Girl Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {girlProfiles.map(girl => (
                <div key={girl.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={girl.avatar} alt={girl.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{girl.name}, {girl.age}</h4>
                      <p className="text-xs text-slate-500 truncate">{girl.locality} • {girl.occupation}</p>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold inline-block mt-0.5">
                        Broker Managed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditGirl(girl)}
                      className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGirlProfile(girl.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Service Points CRUD */}
        {adminSubTab === 'service_points' && (
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Official Tiruppur Service Points</h3>
                <p className="text-xs text-slate-500">Official verified lounges where all client-broker meetings are hosted.</p>
              </div>

              <button
                onClick={() => {
                  setEditingSPId(null);
                  setSPForm({
                    name: '',
                    type: 'Executive Lounge Hub',
                    address: '142 Avinashi Road',
                    locality: 'Avinashi Road, Tiruppur',
                    managerContact: '+91 98420 11223',
                    facilities: 'Single Entry Security, CCTV Lounge, VIP Access',
                    activeStatus: 'Active'
                  });
                  setShowSPModal(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service Point</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {servicePoints.map(sp => (
                <div key={sp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{sp.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{sp.address}, {sp.locality}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditSP(sp)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteServicePoint(sp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 pt-1 flex items-center justify-between border-t border-slate-200/60">
                    <span>Type: <strong className="text-purple-700">{sp.type}</strong></span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{sp.activeStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Meet Approvals */}
        {adminSubTab === 'meets' && (
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Client Meeting Requests (Broker Review)</h3>
            <div className="space-y-3">
              {meetRequests.map(req => (
                <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {req.requesterName} ➔ {req.targetProfileName}
                    </span>
                    <span className="text-rose-600 font-bold">{req.durationMinutes} Min Meeting</span>
                  </div>

                  <div className="text-slate-600 space-y-1">
                    <p>Service Point: <strong className="text-purple-700">{req.servicePointName}</strong></p>
                    <p>Date & Time: <span>{req.date} at {req.timeSlot}</span></p>
                    {req.notes && <p className="italic text-slate-500">Client Note: "{req.notes}"</p>}
                  </div>
                  
                  {req.status === 'pending_broker_approval' ? (
                    <div className="pt-2 border-t border-slate-200 space-y-2.5">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Select/Confirm Service Point Lounge <span className="text-rose-500">*</span></label>
                        <select
                          value={selectedReqForApproval === req.id && selectedSPIdForApproval ? selectedSPIdForApproval : req.servicePointId}
                          onChange={(e) => {
                            setSelectedReqForApproval(req.id);
                            setSelectedSPIdForApproval(e.target.value);
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl min-h-[44px] bg-white font-medium"
                        >
                          {servicePoints.map(sp => (
                            <option key={sp.id} value={sp.id}>
                              {sp.name} — {sp.locality} ({sp.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Add Broker note (e.g. Lounge Suite #2 reserved)..."
                        value={selectedReqForApproval === req.id ? brokerNoteInput : ''}
                        onChange={(e) => {
                          setSelectedReqForApproval(req.id);
                          setBrokerNoteInput(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl min-h-[44px]"
                      />

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => {
                            const chosenSP = servicePoints.find(sp => sp.id === selectedSPIdForApproval) || servicePoints.find(sp => sp.id === req.servicePointId) || servicePoints[0];
                            updateMeetRequestStatus(
                              req.id, 
                              'broker_approved', 
                              brokerNoteInput || 'Approved by Broker Desk. Lounge suite reserved.', 
                              chosenSP
                            );
                            setBrokerNoteInput('');
                            setSelectedReqForApproval(null);
                            setSelectedSPIdForApproval('');
                            setAdminSubTab('broker_chat');
                          }}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs min-h-[44px] shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Service Point & Approve to Chat</span>
                        </button>

                        <button
                          onClick={() => {
                            updateMeetRequestStatus(req.id, 'declined_by_broker', 'Slot unavailable at requested Service Point.');
                          }}
                          className="px-4 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 text-xs min-h-[44px]"
                        >
                          Decline Request
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 text-xs">
                      <span className={`font-bold px-2 py-1 rounded-md ${
                        req.status === 'broker_approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        Status: {req.status === 'broker_approved' ? 'Broker Approved' : 'Rejected'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Broadcast */}
        {adminSubTab === 'broadcast' && (
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" /> Dispatch System Announcement
            </h3>
            <p className="text-xs text-slate-500">Send an instant push alert to all PairX members across Tiruppur.</p>

            <form onSubmit={handleSendBroadcast} className="space-y-3 max-w-lg">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. Service Point Rayapuram Expansion"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  rows={3}
                  placeholder="Write message for members..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {broadcastSent && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Broadcast notification dispatched!</span>
                </div>
              )}

              <button
                type="submit"
                className="py-3 px-6 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 shadow-md flex items-center gap-2 min-h-[44px]"
              >
                <Radio className="w-4 h-4" />
                <span>Send Broadcast Alert</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Girl Profile Create/Edit Modal */}
      {showGirlModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              {editingGirlId ? 'Edit Girl Profile' : 'Add New Verified Girl Profile'}
            </h3>

            <form onSubmit={handleSaveGirlProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={girlForm.name}
                  onChange={e => setGirlForm({ ...girlForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                  placeholder="e.g. Ananya Krishnan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={girlForm.age}
                    onChange={e => setGirlForm({ ...girlForm, age: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={girlForm.occupation}
                    onChange={e => setGirlForm({ ...girlForm, occupation: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                    placeholder="e.g. Fashion Designer"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Locality (Tiruppur)</label>
                <input
                  type="text"
                  value={girlForm.locality}
                  onChange={e => setGirlForm({ ...girlForm, locality: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                  placeholder="e.g. Rayapuram, Tiruppur"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={girlForm.bio}
                  onChange={e => setGirlForm({ ...girlForm, bio: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="Brief introduction..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Interests (Comma separated)</label>
                <input
                  type="text"
                  value={girlForm.interests}
                  onChange={e => setGirlForm({ ...girlForm, interests: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={girlForm.avatar}
                  onChange={e => setGirlForm({ ...girlForm, avatar: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGirlModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl min-h-[44px]"
                >
                  Save Girl Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Point Create/Edit Modal */}
      {showSPModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              {editingSPId ? 'Edit Service Point' : 'Add New Tiruppur Service Point'}
            </h3>

            <form onSubmit={handleSaveServicePoint} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lounge Name</label>
                <input
                  type="text"
                  required
                  value={spForm.name}
                  onChange={e => setSPForm({ ...spForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                  placeholder="e.g. PairX Lounge - Pushpa Theatre Junction"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lounge Type</label>
                  <input
                    type="text"
                    required
                    value={spForm.type}
                    onChange={e => setSPForm({ ...spForm, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                    placeholder="e.g. Executive Lounge Hub"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Locality (Tiruppur)</label>
                  <input
                    type="text"
                    required
                    value={spForm.locality}
                    onChange={e => setSPForm({ ...spForm, locality: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                    placeholder="e.g. Avinashi Road"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={spForm.address}
                  onChange={e => setSPForm({ ...spForm, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                  placeholder="e.g. 142 Avinashi Road"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Manager Contact Phone</label>
                <input
                  type="text"
                  value={spForm.managerContact}
                  onChange={e => setSPForm({ ...spForm, managerContact: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Facilities (Comma separated)</label>
                <input
                  type="text"
                  value={spForm.facilities}
                  onChange={e => setSPForm({ ...spForm, facilities: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl min-h-[44px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSPModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl min-h-[44px]"
                >
                  Save Service Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

