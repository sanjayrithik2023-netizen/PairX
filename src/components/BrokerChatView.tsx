import React, { useState } from 'react';
import { 
  MessageSquare, Search, Send, CheckCheck, Building2, 
  MapPin, Clock, Calendar, ShieldCheck, Video, Phone, 
  CheckCircle2, ArrowLeft, Coffee, Plus, ChevronRight, UserCheck,
  Info, X, User, PhoneCall, Sparkles, Check, Paperclip, AlertCircle, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MeetRequest, ServicePoint, UserProfile } from '../types';

export const BrokerChatView: React.FC = () => {
  const { 
    meetRequests, 
    servicePoints, 
    profiles,
    updateMeetRequestStatus, 
    chatMessages, 
    conversations,
    sendMessage, 
    startCall 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'unread'>('all');
  const [selectedReqId, setSelectedReqId] = useState<string>(meetRequests[0]?.id || 'req-101');
  const [inputText, setInputText] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Approval Modal state with Service Point Selection
  const [approvalModalReq, setApprovalModalReq] = useState<MeetRequest | null>(null);
  const [selectedSPId, setSelectedSPId] = useState<string>('');
  const [brokerNote, setBrokerNote] = useState('');

  // Get active selected request
  const activeReq = meetRequests.find(r => r.id === selectedReqId) || meetRequests[0];
  const activeSP = servicePoints.find(sp => sp.id === activeReq?.servicePointId) || servicePoints[0];
  const targetGirl = profiles.find(p => p.id === activeReq?.targetProfileId) || profiles[0];

  // Derive conversation ID for active request
  const activeConvId = activeReq 
    ? (activeReq.id === 'req-101' ? 'conv-broker' : `conv-${activeReq.id}`)
    : 'conv-broker';

  // Get conversation object and messages for selected client
  const activeConv = conversations.find(c => c.id === activeConvId || c.requestId === activeReq?.id);
  const activeMessages = chatMessages[activeConvId] || chatMessages['conv-broker'] || [];

  // Filter requests for WhatsApp client sidebar list
  const filteredRequests = meetRequests.filter(req => {
    const matchesSearch = 
      req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.targetProfileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.servicePointName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const convId = req.id === 'req-101' ? 'conv-broker' : `conv-${req.id}`;
    const conv = conversations.find(c => c.id === convId);

    if (filterTab === 'pending') return req.status === 'pending_broker_approval';
    if (filterTab === 'approved') return req.status === 'broker_approved';
    if (filterTab === 'unread') return conv ? (conv.unreadCount || 0) > 0 : false;
    return true;
  });

  const handleOpenApprovalModal = (req: MeetRequest) => {
    setApprovalModalReq(req);
    setSelectedSPId(req.servicePointId || servicePoints[0]?.id || '');
    setBrokerNote(req.brokerNotes || 'Service Point Lounge Suite reserved. Identity verified.');
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalReq) return;

    const chosenSP = servicePoints.find(sp => sp.id === selectedSPId) || servicePoints[0];

    updateMeetRequestStatus(
      approvalModalReq.id, 
      'broker_approved', 
      brokerNote, 
      chosenSP
    );

    setSelectedReqId(approvalModalReq.id);
    setApprovalModalReq(null);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeReq) return;

    sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeReq) return;
    sendMessage(activeConvId, text);
  };

  const handleSendLocationPin = (sp: ServicePoint) => {
    if (!activeReq) return;
    sendMessage(activeConvId, `📍 Service Point Address: ${sp.name}, ${sp.address}, Tiruppur. Manager: ${sp.managerContact}`, {
      locationPin: {
        title: sp.name,
        address: `${sp.address}, Tiruppur`
      }
    });
    setShowLocationModal(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[680px] flex flex-col md:flex-row relative">
      
      {/* LEFT COLUMN: Client List (WhatsApp Style Light Theme) */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 ${
        selectedReqId && 'hidden md:flex'
      }`}>
        
        {/* Desk Header */}
        <div className="p-4 bg-emerald-800 text-white border-b border-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-bold shadow-sm">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <span>WhatsApp Broker Desk</span>
                <span className="bg-emerald-900/60 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-600/40">
                  {meetRequests.length} Clients
                </span>
              </h2>
              <p className="text-[11px] text-emerald-200 font-medium">Tiruppur Concierge Clearance</p>
            </div>
          </div>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-emerald-600"
            title="Start New Client Chat Thread"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search clients, girls, service points..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-center transition-colors min-h-[34px] ${
                filterTab === 'all' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All ({meetRequests.length})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-center transition-colors flex items-center justify-center gap-1 min-h-[34px] ${
                filterTab === 'pending' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-white text-amber-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>Pending</span>
              <span className="bg-amber-200 text-amber-950 px-1 py-0.2 rounded-full text-[10px] font-extrabold">
                {meetRequests.filter(r => r.status === 'pending_broker_approval').length}
              </span>
            </button>
            <button
              onClick={() => setFilterTab('approved')}
              className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-center transition-colors min-h-[34px] ${
                filterTab === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Approved ({meetRequests.filter(r => r.status === 'broker_approved').length})
            </button>
            <button
              onClick={() => setFilterTab('unread')}
              className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-center transition-colors min-h-[34px] ${
                filterTab === 'unread' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* WhatsApp Client List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <Coffee className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No client booking requests match your filter</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isSelected = req.id === selectedReqId;
              const isPending = req.status === 'pending_broker_approval';
              const convId = req.id === 'req-101' ? 'conv-broker' : `conv-${req.id}`;
              const conv = conversations.find(c => c.id === convId);
              const msgs = chatMessages[convId] || [];
              const lastMsg = msgs[msgs.length - 1]?.text || conv?.lastMessage || 'Booking request submitted';
              const lastTime = msgs[msgs.length - 1]?.timestamp || conv?.lastMessageTime || 'Today';

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-3.5 cursor-pointer transition-all flex flex-col gap-2 relative ${
                    isSelected 
                      ? 'bg-emerald-50/80 border-l-4 border-emerald-600' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="relative shrink-0">
                        <img
                          src={req.requesterPhoto}
                          alt={req.requesterName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                          <span>{req.requesterName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-medium">Client</span>
                        </h4>
                        
                        <p className="text-[11px] text-emerald-800 font-medium truncate flex items-center gap-1">
                          <span className="text-slate-500">Target:</span>
                          <strong className="text-slate-900 font-semibold">{req.targetProfileName}</strong>
                        </p>

                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {lastMsg}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">{lastTime}</span>
                      {conv && (conv.unreadCount || 0) > 0 && (
                        <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assigned Service Point & Status Pill */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                      <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{req.servicePointName}</span>
                    </span>

                    {isPending ? (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending Clearance
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Approved
                      </span>
                    )}
                  </div>

                  {/* Inline Action for Pending Requests */}
                  {isPending && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenApprovalModal(req);
                      }}
                      className="mt-1 w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Select Service Point & Approve</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CENTER COLUMN: Active WhatsApp Chat Conversation (Light Theme) */}
      {activeReq ? (
        <div className={`flex-1 bg-slate-50 flex flex-col relative ${!selectedReqId && 'hidden md:flex'}`}>
          
          {/* Chat Header */}
          <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shadow-xs z-10">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedReqId('')}
                className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div 
                className="relative shrink-0 cursor-pointer"
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              >
                <img
                  src={activeReq.requesterPhoto}
                  alt={activeReq.requesterName}
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div className="min-w-0 cursor-pointer" onClick={() => setShowInfoDrawer(!showInfoDrawer)}>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">{activeReq.requesterName}</h3>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold hidden sm:inline-block">
                    Target: {activeReq.targetProfileName}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                  <span className="text-slate-700 font-medium truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    {activeReq.servicePointName}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Identity Cleared
                  </span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {activeReq.status === 'pending_broker_approval' && (
                <button
                  onClick={() => handleOpenApprovalModal(activeReq)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 min-h-[40px]"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Assign & Approve</span>
                </button>
              )}

              <button
                onClick={() => startCall('video')}
                className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Start WebRTC Direct Video Call with Client"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                className={`p-2.5 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border ${
                  showInfoDrawer 
                    ? 'bg-emerald-700 text-white border-emerald-800' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="Toggle Client & Booking Information Panel"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Service Point Live Status Bar */}
          <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">Active Lounge Suite: <strong className="text-slate-900">{activeReq.servicePointName}</strong></span>
            </div>

            <button
              onClick={() => handleOpenApprovalModal(activeReq)}
              className="text-emerald-800 font-bold hover:text-emerald-950 shrink-0 ml-2 underline text-[11px]"
            >
              Change Service Point
            </button>
          </div>

          {/* Chat Messages Area (Light WhatsApp Background) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-emerald-50/20">
            
            {/* Embedded Official Booking Summary Card */}
            <div className="bg-white border border-emerald-200 p-4 rounded-2xl max-w-md mx-auto space-y-2 text-xs text-slate-800 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official PairX Clearance Card
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                  activeReq.status === 'broker_approved' 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {activeReq.status === 'broker_approved' ? 'Approved by Broker' : 'Pending Clearance'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">Client Name</span>
                  <strong className="text-slate-900">{activeReq.requesterName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Target Girl</span>
                  <strong className="text-emerald-800">{activeReq.targetProfileName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Schedule</span>
                  <strong className="text-slate-900">{activeReq.date} at {activeReq.timeSlot}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Duration</span>
                  <strong className="text-slate-900">{activeReq.durationMinutes} Minutes</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-semibold text-rose-700">{activeReq.servicePointName}</span>
              </div>
            </div>

            {/* Chat Messages */}
            {activeMessages.map((msg) => {
              const isBroker = msg.senderId.includes('broker') || msg.isBrokerMessage;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBroker ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-xs sm:max-w-md rounded-2xl p-3.5 text-xs shadow-xs space-y-1.5 ${
                    isBroker 
                      ? 'bg-emerald-700 text-white rounded-br-none' 
                      : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                  }`}>
                    <div className={`flex items-center justify-between gap-2 text-[10px] font-bold ${
                      isBroker ? 'text-emerald-100' : 'text-slate-500'
                    }`}>
                      <span>{msg.senderName}</span>
                      {isBroker && <span className="bg-emerald-900/40 px-1.5 py-0.2 rounded text-[9px] text-emerald-100">Broker Desk</span>}
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {msg.locationPin && (
                      <div className={`mt-2 p-2.5 rounded-xl text-xs space-y-1 ${
                        isBroker ? 'bg-emerald-900/50 border border-emerald-500/40 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-rose-500">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{msg.locationPin.title}</span>
                        </div>
                        <p className={`text-[10px] ${isBroker ? 'text-emerald-200' : 'text-slate-500'}`}>{msg.locationPin.address}</p>
                      </div>
                    )}

                    <div className={`flex items-center justify-end gap-1 text-[10px] pt-0.5 ${
                      isBroker ? 'text-emerald-200' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isBroker && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Chips (Light Theme) */}
          <div className="p-2 bg-white border-t border-slate-200 flex flex-wrap items-center gap-1.5">
            {[
              '📍 Send Service Point Location Pin',
              '🆔 Identity Clearance Approved',
              '⏱️ Please arrive 10 mins before slot',
              '📞 Start Direct WebRTC Call',
              '💳 Security Advance Confirmed'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(chip)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 text-[11px] font-medium rounded-full min-h-[32px] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer (Light Theme) */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="p-2.5 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200"
              title="Send Service Point Location Pin"
            >
              <MapPin className="w-5 h-5 text-emerald-700" />
            </button>

            <input
              type="text"
              placeholder={`Type WhatsApp message to ${activeReq.requesterName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 bg-slate-50 hidden md:flex items-center justify-center p-8 text-center text-slate-500 space-y-3">
          <div className="max-w-sm space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Select a Client Conversation</h3>
            <p className="text-xs text-slate-500">View client requests, assign official Service Points, and manage WhatsApp communications.</p>
          </div>
        </div>
      )}

      {/* RIGHT SIDE DRAWER: Client & Booking Information Panel (Light Theme) */}
      {showInfoDrawer && activeReq && (
        <div className="w-full lg:w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto space-y-4 shrink-0 z-20">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Client Information</span>
            </h3>
            <button
              onClick={() => setShowInfoDrawer(false)}
              className="p-1 text-slate-400 hover:text-slate-700 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Client Avatar & Name */}
          <div className="text-center space-y-2">
            <img
              src={activeReq.requesterPhoto}
              alt={activeReq.requesterName}
              className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-emerald-500/50 shadow-md"
            />
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">{activeReq.requesterName}</h4>
              <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> PairX Verified Client
              </p>
            </div>
          </div>

          {/* Requested Girl Target Profile Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 block">
              Requested Escort/Girl Profile
            </span>
            <div className="flex items-center gap-2.5">
              <img
                src={targetGirl?.avatar || activeReq.targetProfilePhoto}
                alt={activeReq.targetProfileName}
                className="w-10 h-10 rounded-xl object-cover border border-emerald-300"
              />
              <div>
                <strong className="text-slate-900 font-bold block">{activeReq.targetProfileName}</strong>
                <span className="text-[11px] text-slate-500">{targetGirl?.occupation || 'Model & Escort'} • {targetGirl?.age || 22} yrs</span>
              </div>
            </div>
          </div>

          {/* Assigned Service Point Lounge */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 block">
              Assigned Service Point Lounge
            </span>
            <div>
              <strong className="text-slate-900 font-bold block">{activeSP.name}</strong>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeSP.address}, {activeSP.locality}</p>
              <p className="text-[11px] text-emerald-800 font-medium mt-1">Lounge Manager: {activeSP.managerContact}</p>
            </div>

            <button
              onClick={() => handleOpenApprovalModal(activeReq)}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-emerald-800 border border-slate-200 font-bold rounded-lg text-[11px] min-h-[36px] transition-colors"
            >
              Change Assigned Lounge
            </button>
          </div>

          {/* Meeting Schedule */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
              Booking Schedule
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <strong className="text-slate-900">{activeReq.date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <strong className="text-slate-900">{activeReq.timeSlot}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <strong className="text-slate-900">{activeReq.durationMinutes} Minutes</strong>
              </div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => startCall('video')}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Video className="w-4 h-4" />
              <span>Launch WebRTC Video Call</span>
            </button>

            {activeReq.status === 'pending_broker_approval' ? (
              <button
                onClick={() => handleOpenApprovalModal(activeReq)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <UserCheck className="w-4 h-4" />
                <span>Approve & Clear Booking</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold">
                ✓ Booking Fully Approved
              </div>
            )}
          </div>
        </div>
      )}

      {/* SERVICE POINT SELECTION & APPROVAL MODAL */}
      {approvalModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-5 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-base text-slate-900">Assign Service Point & Approve Client</h3>
              </div>
              <button
                onClick={() => setApprovalModalReq(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Client Request Summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Client Name:</span>
                <strong className="text-slate-900 font-bold">{approvalModalReq.requesterName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Target Escort requested:</span>
                <strong className="text-emerald-800 font-bold">{approvalModalReq.targetProfileName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-800 font-semibold">{approvalModalReq.date} at {approvalModalReq.timeSlot}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Select Official Tiruppur Service Point <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Choose the verified lounge location where the meeting will take place.
                </p>

                <select
                  value={selectedSPId}
                  onChange={(e) => setSelectedSPId(e.target.value)}
                  className="w-full min-h-[44px] p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {servicePoints.map(sp => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} — {sp.locality} ({sp.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Broker Clearance Note (Visible in Chat)</label>
                <textarea
                  rows={2}
                  value={brokerNote}
                  onChange={(e) => setBrokerNote(e.target.value)}
                  placeholder="e.g. Lounge Suite #2 reserved. Client identity cleared."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovalModalReq(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl min-h-[44px] shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Add to Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOCATION PIN PICKER MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm">Send Service Point Location Pin</h3>
              <button onClick={() => setShowLocationModal(false)} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {servicePoints.map(sp => (
                <div
                  key={sp.id}
                  onClick={() => handleSendLocationPin(sp)}
                  className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl cursor-pointer border border-slate-200 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-emerald-800">{sp.name}</h4>
                    <p className="text-[10px] text-slate-500">{sp.address}, {sp.locality}</p>
                  </div>
                  <MapPin className="w-4 h-4 text-rose-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW CLIENT CHAT MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Initiate Client Chat Thread</span>
              </h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>

            <p className="text-xs text-slate-500">Select an existing client request to open their WhatsApp thread:</p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {meetRequests.map(req => (
                <div
                  key={req.id}
                  onClick={() => {
                    setSelectedReqId(req.id);
                    setShowNewChatModal(false);
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl cursor-pointer border border-slate-200 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={req.requesterPhoto} alt={req.requesterName} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900">{req.requesterName}</h4>
                      <span className="text-[10px] text-emerald-800">Target: {req.targetProfileName}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
