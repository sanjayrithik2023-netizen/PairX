import React, { useState } from 'react';
import { 
  User, ShieldCheck, MapPin, EyeOff, Lock, Bell, 
  Heart, Settings, LogOut, Edit3, CheckCircle2, ChevronRight, Sliders, Smartphone 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    userPreferences, 
    updateUserPreferences, 
    logout, 
    favoriteProfileIds, 
    profiles,
    setActiveProfileModal 
  } = useApp();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser.bio);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  const favoriteProfiles = profiles.filter(p => favoriteProfileIds.includes(p.id));

  const handleVerificationRequest = () => {
    setVerificationSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-rose-500/10 to-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-rose-500 shadow-md"
              />
              {currentUser.verified && (
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Verified Tiruppur Resident">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser.name}, {currentUser.age}
                </h2>
                <span className="bg-rose-50 text-rose-600 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-rose-100 self-center sm:self-auto">
                  {currentUser.occupation}
                </span>
              </div>

              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{currentUser.locality}</span>
              </p>

              {/* Bio block */}
              <div className="pt-2">
                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Save Bio
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <p className="text-xs text-slate-700 italic">"{bioText}"</p>
                    <button onClick={() => setIsEditingBio(true)} className="text-slate-400 hover:text-rose-600">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Tiruppur Identity Verification</h3>
              <p className="text-xs text-emerald-100">
                {verificationSubmitted ? 'Verification Audit Pending (ETA 5 mins)' : 'Government ID & Selfie Verified Badge Active'}
              </p>
            </div>
          </div>

          {!verificationSubmitted && (
            <button
              onClick={handleVerificationRequest}
              className="px-3.5 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
            >
              Re-verify ID
            </button>
          )}
        </div>

        {/* Privacy & Security Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Privacy & Security Controls</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <EyeOff className="w-5 h-5 text-slate-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Ghost Mode (Incognito Browsing)</h4>
                  <p className="text-[11px] text-slate-500">Hide online status & browse profiles privately.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={userPreferences.ghostMode}
                onChange={(e) => updateUserPreferences({ ghostMode: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Hide Exact Distance</h4>
                  <p className="text-[11px] text-slate-500">Only show neighborhood name in Tiruppur.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={userPreferences.hideDistance}
                onChange={(e) => updateUserPreferences({ hideDistance: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Push Notifications & E2E Alerts</h4>
                  <p className="text-[11px] text-slate-500">Receive instant alerts for meet requests & chats.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={userPreferences.pushNotifications}
                onChange={(e) => updateUserPreferences({ pushNotifications: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Saved Favorites */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600 fill-current" />
            <span>Saved Favorite Profiles ({favoriteProfiles.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteProfiles.map(p => (
              <div
                key={p.id}
                onClick={() => setActiveProfileModal(p)}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}, {p.age}</h4>
                  <p className="text-[10px] text-slate-500">{p.locality}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-2xl border border-rose-200 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of PairX Session</span>
        </button>

      </div>
    </div>
  );
};
