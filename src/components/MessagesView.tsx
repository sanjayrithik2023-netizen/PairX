import React, { useState } from 'react';
import { 
  Lock, Send, Image as ImageIcon, MapPin, Video, Phone, 
  Sparkles, Check, CheckCheck, ShieldCheck, ArrowLeft, MoreVertical, Coffee 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { RECOMMENDED_MEET_LOCATIONS } from '../data/mockProfiles';

export const MessagesView: React.FC = () => {
  const { 
    conversations, 
    chatMessages, 
    sendMessage, 
    currentUser, 
    startCall, 
    generateAIIcebreaker,
    setActiveProfileModal,
    setActiveMeetModal
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messages = activeConv ? chatMessages[activeConv.id] || [] : [];

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

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Chat Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex h-[700px]">
          
          {/* Left Sidebar: Conversations List */}
          <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">Messages</h2>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {conversations.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">No messages yet</p>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                        isActive ? 'bg-rose-50/70 border-l-4 border-rose-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={conv.partner.avatar}
                          alt={conv.partner.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        {conv.partner.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{conv.partner.name}</h4>
                          <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Active Chat Window */}
          {activeConv ? (
            <div className={`flex-1 flex flex-col bg-slate-50/50 ${
              !activeConvId ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* Active Chat Header */}
              <div className="bg-white p-3.5 border-b border-slate-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId('')}
                    className="md:hidden p-1 text-slate-500 hover:text-slate-800"
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
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      {activeConv.partner.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-sm text-slate-900">{activeConv.partner.name}</h3>
                        {activeConv.partner.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Member" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {activeConv.partner.online ? 'Online now' : `Last active ${activeConv.partner.lastActive}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Call & Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startCall('audio')}
                    className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                    title="Audio Call to Broker"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => startCall('video')}
                    className="p-2 text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs flex items-center gap-1 text-xs font-semibold px-3"
                    title="Start Broker WebRTC Video Call"
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Call Broker</span>
                  </button>
                </div>
              </div>

              {/* Encryption Notice */}
              <div className="bg-emerald-50/80 border-b border-emerald-100 py-1.5 px-4 text-center text-[11px] text-emerald-800 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Messages and media in this chat are end-to-end encrypted on PairX network.</span>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-3 text-xs space-y-1 shadow-xs ${
                        isMe
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-tr-xs'
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

                        <p className="leading-relaxed">{msg.text}</p>
                        
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
              <div className="px-4 py-2 bg-purple-50/80 border-t border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-purple-900 font-medium">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Need an icebreaker idea for {activeConv.partner.name}?</span>
                </div>
                <button
                  onClick={handleGenerateAiPrompt}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 bg-purple-600 text-white font-semibold text-[11px] rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isGeneratingAi ? 'Thinking...' : 'AI Suggestion'}
                </button>
              </div>

              {/* Location Picker Drawer */}
              {showLocationPicker && (
                <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">Share Safe Meetup Venue in Tiruppur</h4>
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

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Share Venue Location"
                >
                  <MapPin className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Type encrypted message to ${activeConv.partner.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <Lock className="w-12 h-12 text-slate-300 mb-2" />
              <h3 className="font-bold text-slate-700">Select a Conversation</h3>
              <p className="text-xs text-slate-500">All chats are end-to-end encrypted.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
