import React, { useState } from 'react';
import { 
  Lock, Send, MapPin, Video, Phone, Sparkles, Check, CheckCheck, 
  ShieldCheck, ArrowLeft, Search, Plus, UserPlus, Coffee, MoreVertical, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, Conversation } from '../types';
import { RECOMMENDED_MEET_LOCATIONS, BROKER_PROFILE } from '../data/mockProfiles';

export const MessagesView: React.FC = () => {
  const { 
    conversations, 
    chatMessages, 
    sendMessage, 
    currentUser, 
    startCall, 
    generateAIIcebreaker,
    setActiveProfileModal,
    setActiveMeetModal,
    profiles
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState<string>('');
  const [searchContactQuery, setSearchContactQuery] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messages = activeConv ? chatMessages[activeConv.id] || [] : [];

  // Filter existing conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.partner.name.toLowerCase().includes(searchContactQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchContactQuery.toLowerCase())
  );

  // Available profiles to start a new chat with
  const availableNewProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchContactQuery.toLowerCase()) ||
    p.locality.toLowerCase().includes(searchContactQuery.toLowerCase())
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleSendLocation = (venueName: string, area: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, `Let's meet at ${venueName}!`, {
      locationPin: {
        title: venueName,
        address: area
      }
    });
    setShowLocationPicker(false);
  };

  const handleGenerateAiPrompt = async () => {
    if (!activeConv) return;
    setIsGeneratingAi(true);
    const icebreaker = await generateAIIcebreaker(activeConv.id, activeConv.partner);
    setInputText(icebreaker);
    setIsGeneratingAi(false);
  };

  const startChatWithProfile = (profile: UserProfile) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.partner.id === profile.id);
    if (existingConv) {
      setActiveConvId(existingConv.id);
    } else {
      // Use existing or broker conversation ID
      setActiveConvId('conv-broker');
    }
    setShowNewChatModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16 pt-2 sm:pt-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* WHATSAPP-STYLE FULL MESSENGER INTERFACE */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex h-[calc(100vh-120px)] min-h-[580px]">
          
          {/* LEFT CHAT LIST SIDEBAR (WhatsApp Style) */}
          <div className={`w-full md:w-96 border-r border-slate-200 bg-white flex flex-col ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Header & User Info */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-rose-300 shadow-xs"
                />
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900 leading-tight">WhatsApp Messenger</h2>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Single Broker Desk Verified</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                title="Search User / New Chat"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>

            {/* Search Bar for Chats & Profiles */}
            <div className="p-2.5 bg-slate-50/60 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search chats, contacts or models..."
                  value={searchContactQuery}
                  onChange={(e) => setSearchContactQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 min-h-[34px] text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Direct Broker Fast Access Tile */}
            <div 
              onClick={() => setActiveConvId('conv-broker')}
              className={`p-3 border-b border-slate-100 flex items-center gap-3 cursor-pointer transition-colors ${
                activeConvId === 'conv-broker' ? 'bg-purple-50 border-l-4 border-purple-600' : 'bg-gradient-to-r from-purple-50/50 to-pink-50/30 hover:bg-purple-50/70'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={BROKER_PROFILE.avatar}
                  alt="Single Broker Desk"
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-purple-500 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                  <ShieldCheck className="w-3 h-3" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-purple-950 truncate">Single Broker Desk</h4>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">24/7 Live</span>
                </div>
                <p className="text-[11px] text-slate-600 truncate mt-0.5">Central coordination & WebRTC Call line</p>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No active chats matching query</p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    + Search user to message
                  </button>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                        isActive ? 'bg-rose-50/80 border-l-4 border-rose-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.partner.avatar}
                          alt={conv.partner.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        {conv.partner.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate">{conv.partner.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT ACTIVE CHAT VIEW (WhatsApp Full Pane) */}
          {activeConv ? (
            <div className={`flex-1 flex flex-col bg-[#e5ddd5]/20 ${
              !activeConvId ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* WhatsApp Active Chat Header */}
              <div className="bg-white p-3 border-b border-slate-200 flex items-center justify-between z-10 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveConvId('')}
                    className="md:hidden p-1 text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div 
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => setActiveProfileModal(activeConv.partner)}
                  >
                    <div className="relative">
                      <img
                        src={activeConv.partner.avatar}
                        alt={activeConv.partner.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      {activeConv.partner.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-extrabold text-sm text-slate-900">{activeConv.partner.name}</h3>
                        {activeConv.partner.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" title="Broker Verified Profile" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block leading-none">
                        {activeConv.partner.online ? 'Online now' : `Last active ${activeConv.partner.lastActive}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call Header Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startCall('audio')}
                    className="p-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                    title="Audio Call via Single Broker Desk"
                  >
                    <Phone className="w-4.5 h-4.5" />
                  </button>

                  <button
                    onClick={() => startCall('video')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="WebRTC Video Call via Broker Clearance"
                  >
                    <Video className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                </div>
              </div>

              {/* Encryption Banner */}
              <div className="bg-emerald-50/90 border-b border-emerald-100 py-1 px-4 text-center text-[10px] text-emerald-800 font-medium flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>End-to-End Encrypted via PairX Single Broker Clearance Desk</span>
              </div>

              {/* Messages Stream Pane */}
              <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 bg-slate-50/60">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 text-xs space-y-1 shadow-xs ${
                        isMe
                          ? 'bg-rose-600 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}>
                        
                        {/* Location Pin Card if present */}
                        {msg.locationPin && (
                          <div className={`p-2 rounded-xl mb-1 flex items-start gap-2 ${
                            isMe ? 'bg-white/10 border border-white/20' : 'bg-rose-50 border border-rose-100 text-rose-950'
                          }`}>
                            <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-xs block">{msg.locationPin.title}</span>
                              <span className="text-[10px] opacity-80">{msg.locationPin.address}</span>
                            </div>
                          </div>
                        )}

                        <p className="leading-relaxed font-sans">{msg.text}</p>
                        
                        <div className={`flex items-center justify-end gap-1 text-[9px] ${
                          isMe ? 'text-rose-200' : 'text-slate-400'
                        }`}>
                          <span>{msg.timestamp}</span>
                          {isMe && (
                            msg.status === 'read' ? (
                              <CheckCheck className="w-3 h-3 text-white" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Icebreaker Prompt Bar */}
              <div className="px-3 py-1.5 bg-purple-50/90 border-t border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-purple-900 font-semibold truncate">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Need chat ideas for {activeConv.partner.name}?</span>
                </div>
                <button
                  onClick={handleGenerateAiPrompt}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 bg-purple-600 text-white font-bold text-[10px] rounded-lg hover:bg-purple-700 transition-colors shrink-0 disabled:opacity-50"
                >
                  {isGeneratingAi ? 'Generating...' : 'AI Suggestion'}
                </button>
              </div>

              {/* Location Picker Drawer */}
              {showLocationPicker && (
                <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">Share Safe Lounge Location in Tiruppur</h4>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {RECOMMENDED_MEET_LOCATIONS.map(loc => (
                      <button
                        key={loc.name}
                        onClick={() => handleSendLocation(loc.name, loc.area)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs rounded-xl font-medium shrink-0 hover:bg-rose-100"
                      >
                        📍 {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Message Input Form */}
              <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                  title="Share Venue Location"
                >
                  <MapPin className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Type encrypted message to ${activeConv.partner.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2 min-h-[38px] bg-slate-100/80 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <Lock className="w-12 h-12 text-slate-300 mb-2" />
              <h3 className="font-extrabold text-slate-800 text-base">Select a Contact to Message</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">All messages are end-to-end encrypted and routed through PairX Single Broker Desk.</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-xs"
              >
                + Search & Message User
              </button>
            </div>
          )}

        </div>

      </div>

      {/* NEW CHAT / USER SEARCH MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-4.5 h-4.5 text-rose-600" /> Search User to Message
              </h3>
              <button 
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Type profile name or locality in Tiruppur..."
                value={searchContactQuery}
                onChange={(e) => setSearchContactQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
              {/* Single Broker Desk Default Option */}
              <div 
                onClick={() => {
                  setActiveConvId('conv-broker');
                  setShowNewChatModal(false);
                }}
                className="p-3 hover:bg-purple-50/80 rounded-2xl cursor-pointer transition-colors flex items-center gap-3 bg-purple-50/40 my-1"
              >
                <img src={BROKER_PROFILE.avatar} alt="Broker" className="w-10 h-10 rounded-xl object-cover border border-purple-400" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs text-purple-950 flex items-center gap-1">
                    Single Broker Desk <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-[10px] text-slate-500">Instant admin support & clearance</p>
                </div>
                <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-1 rounded-lg">Chat</span>
              </div>

              {availableNewProfiles.map(p => (
                <div
                  key={p.id}
                  onClick={() => startChatWithProfile(p)}
                  className="p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors flex items-center gap-3"
                >
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900">{p.name}, {p.age}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" /> {p.locality}
                    </p>
                  </div>
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-100">
                    Message
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowNewChatModal(false)}
              className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
