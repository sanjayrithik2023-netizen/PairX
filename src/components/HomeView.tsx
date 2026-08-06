import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, SlidersHorizontal, ShieldCheck, Heart, Coffee, 
  MapPin, Sparkles, UserCheck, MessageSquare, Star, ArrowUpRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { TIRUPPUR_LOCALITIES } from '../data/mockProfiles';

export const HomeView: React.FC = () => {
  const { 
    profiles, 
    likedProfileIds, 
    toggleLikeProfile, 
    toggleFavoriteProfile,
    favoriteProfileIds,
    setActiveProfileModal, 
    setActiveMeetModal,
    setActiveTab,
    userPreferences,
    updateUserPreferences
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterLocality, setSelectedFilterLocality] = useState(userPreferences.localityFilter || 'All Localities');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter logic
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          profile.locality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocality = selectedFilterLocality === 'All Localities' || profile.locality.includes(selectedFilterLocality);
    const matchesVerified = !onlyVerified || profile.verified;
    const matchesOnline = !onlyOnline || profile.online;
    return matchesSearch && matchesLocality && matchesVerified && matchesOnline;
  });

  const featuredProfiles = profiles.filter(p => p.verified);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Hero Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white p-6 sm:p-8 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Licensed Broker-Managed Model • Tiruppur</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Verified Girl Profiles Managed by Single Broker Desk
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              To guarantee female privacy & safety, all girl profiles are curated and managed by the central PairX Broker. Select a profile and submit a booking request for an official Tiruppur Service Point. Once approved, speak directly to the Broker via WebRTC Call!
            </p>
          </div>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search by name, interests or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-3.5 py-2.5 min-h-[44px] bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Quick Filter Chips (Wrapping layout without scrolling) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {TIRUPPUR_LOCALITIES.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedFilterLocality(loc)}
                className={`px-3 py-1.5 min-h-[32px] rounded-full text-[11px] font-semibold transition-all flex items-center justify-center ${
                  selectedFilterLocality === loc
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1.5 min-h-[32px] rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                onlyVerified
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Only</span>
            </button>
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`px-3 py-1.5 min-h-[32px] rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                onlyOnline
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Online Now</span>
            </button>
          </div>
        </div>

        {/* Featured Members Carousel Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Featured Tiruppur Singles
              </h2>
              <p className="text-xs text-slate-500">Verified members looking for coffee meetups this week</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {featuredProfiles.map(profile => (
              <div
                key={`feat-${profile.id}`}
                onClick={() => setActiveProfileModal(profile)}
                className="min-w-[200px] w-52 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group shrink-0"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  
                  {profile.verified && (
                    <span className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}

                  <span className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    {profile.compatibilityScore}% Match
                  </span>

                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h4 className="font-bold text-sm tracking-tight">{profile.name}, {profile.age}</h4>
                    <p className="text-[10px] text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" /> {profile.locality}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white flex items-center justify-between">
                  <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
                    {profile.intent}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMeetModal(profile);
                    }}
                    className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Coffee className="w-3 h-3" /> Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Profiles Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Recommended Profiles ({filteredProfiles.length})
            </h3>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-slate-200">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700">No matching profiles found</h4>
              <p className="text-xs text-slate-500">Try clearing filters or searching for different interests in Tiruppur.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilterLocality('All Localities');
                  setOnlyVerified(false);
                  setOnlyOnline(false);
                }}
                className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map((profile) => {
                const isLiked = likedProfileIds.includes(profile.id);
                const isFav = favoriteProfileIds.includes(profile.id);

                return (
                  <motion.div
                    key={profile.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    {/* Top Photo & Badges */}
                    <div 
                      className="relative h-64 overflow-hidden cursor-pointer"
                      onClick={() => setActiveProfileModal(profile)}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                      {/* Online Status & Verification */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {profile.verified && (
                          <span className="bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                        {profile.online && (
                          <span className="bg-slate-950/60 backdrop-blur-md text-emerald-400 px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Online
                          </span>
                        )}
                      </div>

                      {/* Like & Favorite Button */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeProfile(profile.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                            isLiked ? 'bg-rose-500 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Info overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold tracking-tight">
                            {profile.name}, {profile.age}
                          </h3>
                          <span className="bg-rose-500/90 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                            {profile.compatibilityScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{profile.locality} • {profile.distanceKm} km away</span>
                        </p>
                      </div>
                    </div>

                    {/* Bio & Details */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          "{profile.bio}"
                        </p>

                        {/* Interest Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {profile.interests.slice(0, 3).map(interest => (
                            <span
                              key={interest}
                              className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setActiveMeetModal(profile)}
                          className="flex-1 py-2.5 min-h-[44px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Coffee className="w-4 h-4" />
                          <span>Request Broker Booking</span>
                        </button>
                        
                        <button
                          onClick={() => setActiveProfileModal(profile)}
                          className="px-3.5 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <span>Profile</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tiruppur Community Safety & Testimonials Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>PairX Tiruppur Safety & Trust Standard</span>
          </div>
          <h3 className="text-xl font-bold">Safe Local Meetups in Tiruppur</h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every meetup requested on PairX is routed through verified public venues in Tiruppur (Rayapuram Coffee Lounge, Avinashi Road Bistros, Smart City Walk). Our local moderation team monitors member safety and handles 24/7 report support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex text-amber-400 text-xs gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <p className="text-xs text-slate-200 font-medium">"Met my partner at Rayapuram Coffee Lounge through PairX. Safe, smooth, and authentic!"</p>
              <span className="text-[10px] text-rose-300 font-semibold block">– Vivek & Ananya, Tiruppur</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex text-amber-400 text-xs gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <p className="text-xs text-slate-200 font-medium">"The 30-min coffee option takes away the awkwardness of long dates. Excellent design!"</p>
              <span className="text-[10px] text-rose-300 font-semibold block">– Sathish K., Avinashi Road</span>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" /> Filter Profiles
              </h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Locality in Tiruppur</label>
                <select
                  value={selectedFilterLocality}
                  onChange={(e) => setSelectedFilterLocality(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-rose-500"
                >
                  {TIRUPPUR_LOCALITIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Show Verified Members Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOnline}
                    onChange={(e) => setOnlyOnline(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Show Online Now Only</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedFilterLocality('All Localities');
                  setOnlyVerified(false);
                  setOnlyOnline(false);
                }}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
