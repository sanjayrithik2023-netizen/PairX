import React, { useState } from 'react';
import { 
  X, ShieldCheck, MapPin, Coffee, MessageSquare, Video, Phone, 
  Sparkles, Heart, GraduationCap, Languages, Ruler, Target, Share2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileDetailModal: React.FC = () => {
  const { 
    activeProfileModal, 
    setActiveProfileModal, 
    setActiveMeetModal,
    startCall,
    setActiveTab,
    toggleLikeProfile,
    likedProfileIds,
    generateAIIcebreaker,
    sendMessage,
    conversations
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [aiIcebreaker, setAiIcebreaker] = useState<string | null>(null);
  const [isGeneratingIcebreaker, setIsGeneratingIcebreaker] = useState(false);

  if (!activeProfileModal) return null;

  const profile = activeProfileModal;
  const isLiked = likedProfileIds.includes(profile.id);

  const handleGenerateIcebreaker = async () => {
    setIsGeneratingIcebreaker(true);
    const text = await generateAIIcebreaker(`conv-${profile.id}`, profile);
    setAiIcebreaker(text);
    setIsGeneratingIcebreaker(false);
  };

  const handleSendIcebreakerAndChat = () => {
    const convId = `conv-${profile.id}`;
    if (aiIcebreaker) {
      sendMessage(convId, aiIcebreaker);
    }
    setActiveProfileModal(null);
    setActiveTab('messages');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 my-8 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveProfileModal(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Gallery Header */}
        <div className="relative h-80 bg-slate-950">
          <img
            src={profile.photos[activePhotoIndex] || profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

          {/* Photo Dots */}
          {profile.photos.length > 1 && (
            <div className="absolute top-4 left-4 z-10 flex gap-1.5">
              {profile.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activePhotoIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Info Badge */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">{profile.name}, {profile.age}</h2>
              {profile.verified && (
                <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified Tiruppur Resident" />
              )}
            </div>
            <p className="text-xs text-rose-200 mt-0.5 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{profile.locality} • {profile.distanceKm} km away</span>
            </p>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-5">
          
          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
            <button
              onClick={() => {
                setActiveProfileModal(null);
                setActiveMeetModal(profile);
              }}
              className="flex-1 py-2.5 min-h-[44px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Coffee className="w-4 h-4" />
              <span>Request Broker Booking</span>
            </button>

            <button
              onClick={() => {
                setActiveProfileModal(null);
                startCall('video');
              }}
              className="p-2.5 min-h-[44px] min-w-[44px] bg-white text-purple-600 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors flex items-center justify-center"
              title="Call Single Broker Desk"
            >
              <Video className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleLikeProfile(profile.id)}
              className={`p-2.5 min-h-[44px] min-w-[44px] rounded-xl border transition-colors flex items-center justify-center ${
                isLiked 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* About & Bio */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Me</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>

          {/* AI Icebreaker Generator Feature */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Gemini AI Icebreaker Assistant
              </span>
              <button
                onClick={handleGenerateIcebreaker}
                disabled={isGeneratingIcebreaker}
                className="text-[11px] bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGeneratingIcebreaker ? 'Generating...' : 'Generate Line'}
              </button>
            </div>

            {aiIcebreaker && (
              <div className="bg-white p-3 rounded-xl border border-purple-100 text-xs text-slate-800 space-y-2">
                <p className="italic">"{aiIcebreaker}"</p>
                <button
                  onClick={handleSendIcebreakerAndChat}
                  className="w-full py-1.5 bg-purple-600 text-white font-semibold rounded-lg text-[11px] flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Send This Line in Chat</span>
                </button>
              </div>
            )}
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Target className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Looking For</span>
                <span className="font-semibold text-slate-800">{profile.intent}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <GraduationCap className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Education</span>
                <span className="font-semibold text-slate-800">{profile.education || 'Graduate'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Languages className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Languages</span>
                <span className="font-semibold text-slate-800">{profile.languages?.join(', ') || 'Tamil, English'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Ruler className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Height</span>
                <span className="font-semibold text-slate-800">{profile.heightCm} cm</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interests & Hobbies</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map(interest => (
                <span
                  key={interest}
                  className="bg-rose-50 text-rose-700 border border-rose-100 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
