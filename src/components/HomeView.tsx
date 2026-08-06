import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, ShieldCheck, Heart, Coffee, 
  MapPin, Sparkles, UserCheck, MessageSquare, Star, ArrowUpRight,
  ChevronLeft, ChevronRight, Calendar, Building2, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { TIRUPPUR_LOCALITIES } from '../data/mockProfiles';

export const HomeView: React.FC = () => {
  const { 
    profiles, 
    likedProfileIds, 
    toggleLikeProfile, 
    favoriteProfileIds,
    setActiveProfileModal, 
    setActiveMeetModal,
    setActiveTab,
    userPreferences,
    meetRequests
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterLocality, setSelectedFilterLocality] = useState(userPreferences.localityFilter || 'All Localities');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Flipkart Banner Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      id: 'slide-1',
      tag: '100% VERIFIED SINGLE BROKER DESK',
      title: 'Tiruppur Premium Model Lounges',
      subtitle: 'Book verified female profiles with single-broker safety clearance pass.',
      btnText: 'Book Lounge Meet',
      btnAction: () => {
        const firstModel = profiles[0];
        if (firstModel) setActiveMeetModal(firstModel);
      },
      gradient: 'from-rose-600 via-pink-600 to-purple-700',
      badgeBg: 'bg-emerald-500/90',
      imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'slide-2',
      tag: 'EXECUTIVE LOUNGES IN TIRUPPUR',
      title: 'Rayapuram & Avinashi Road Lounges',
      subtitle: 'Private & secure coffee lounges equipped with high-speed WiFi and valet parking.',
      btnText: 'View My Bookings',
      btnAction: () => setActiveTab('meet-requests'),
      gradient: 'from-purple-700 via-indigo-600 to-slate-900',
      badgeBg: 'bg-amber-500/90',
      imgUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'slide-3',
      tag: 'REAL-TIME CLEARANCE',
      title: 'Direct Single Broker Desk Chat',
      subtitle: 'Speak directly with our single broker desk for quick clearance and venue booking.',
      btnText: 'Chat Broker Desk',
      btnAction: () => setActiveTab('messages'),
      gradient: 'from-pink-600 via-rose-700 to-rose-950',
      badgeBg: 'bg-rose-500/90',
      imgUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // Auto slide carousel every 4.5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [bannerSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

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
    <div className="min-h-screen bg-slate-50 pb-20 pt-2 sm:pt-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">

        {/* TOP SECTION: COMPACT SEARCH BAR & ADDRESS + LOCALITY HORIZONTAL SLIDER (ABOVE HERO BANNER) */}
        <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-xs border border-slate-200/90 space-y-2">
          
          {/* Small Address & Compact Search Row */}
          <div className="flex items-center gap-2">
            
            {/* Small Compact Address Tag */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50/80 hover:bg-rose-100/80 rounded-xl text-rose-700 border border-rose-200/60 shrink-0 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="text-[11px] font-extrabold max-w-[85px] sm:max-w-[120px] truncate">
                {selectedFilterLocality === 'All Localities' ? 'Tiruppur' : selectedFilterLocality}
              </span>
              <ChevronDown className="w-3 h-3 text-rose-500 shrink-0" />
            </div>

            {/* Compact Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search models, interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 min-h-[32px] text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="p-2 min-h-[32px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors shrink-0"
              title="Filter Options"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Localities Horizontal Slider */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none whitespace-nowrap">
            {TIRUPPUR_LOCALITIES.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedFilterLocality(loc)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 border ${
                  selectedFilterLocality === loc
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border-slate-200/60'
                }`}
              >
                {loc}
              </button>
            ))}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 border ${
                onlyVerified
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Only</span>
            </button>
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 border ${
                onlyOnline
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Online Now</span>
            </button>
          </div>

        </div>

        {/* FLIPKART STYLE PROMOTIONAL BANNER CAROUSEL (BELOW SEARCH & LOCALITY SLIDER) */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className={`relative bg-gradient-to-r ${bannerSlides[currentSlide].gradient} text-white p-5 sm:p-7 min-h-[170px] sm:min-h-[210px] flex flex-col justify-between overflow-hidden`}
            >
              {/* Background Decor Image */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 opacity-25 sm:opacity-40 mix-blend-overlay pointer-events-none">
                <img 
                  src={bannerSlides[currentSlide].imgUrl} 
                  alt="Banner" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Banner Header Tag */}
              <div className="relative z-10 flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs ${bannerSlides[currentSlide].badgeBg}`}>
                  {bannerSlides[currentSlide].tag}
                </span>
                <span className="text-[10px] text-white/80 font-mono">Tiruppur Hub</span>
              </div>

              {/* Main Content */}
              <div className="relative z-10 max-w-xl my-1.5">
                <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-sm">
                  {bannerSlides[currentSlide].title}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-2 leading-relaxed">
                  {bannerSlides[currentSlide].subtitle}
                </p>
              </div>

              {/* Action Button & Slider Controls */}
              <div className="relative z-10 flex items-center justify-between pt-1">
                <button
                  onClick={bannerSlides[currentSlide].btnAction}
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-rose-50 text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>{bannerSlides[currentSlide].btnText}</span>
                </button>

                {/* Left/Right Prev Next Controls & Dots */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevSlide}
                    className="w-7 h-7 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {bannerSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={handleNextSlide}
                    className="w-7 h-7 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Featured Profiles Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Featured Tiruppur Profiles
              </h2>
              <p className="text-[11px] text-slate-500">Verified female profiles managed by Single Broker Desk</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {featuredProfiles.map(profile => {
              const activeBooking = meetRequests.find(r => r.profileId === profile.id);

              return (
                <div
                  key={`feat-${profile.id}`}
                  onClick={() => setActiveProfileModal(profile)}
                  className="min-w-[190px] w-48 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group shrink-0"
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

                  <div className="p-2.5 bg-white flex items-center justify-between gap-1">
                    <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold truncate">
                      {profile.intent}
                    </span>
                    {activeBooking ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('meet-requests');
                        }}
                        className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Booked
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMeetModal(profile);
                        }}
                        className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-black px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Coffee className="w-3 h-3" /> Book Model
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Profiles Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredProfiles.map((profile) => {
                const isLiked = likedProfileIds.includes(profile.id);
                const activeBooking = meetRequests.find(r => r.profileId === profile.id);

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
                      className="relative h-60 overflow-hidden cursor-pointer"
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

                      {/* Like Button */}
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
                        {activeBooking ? (
                          <button
                            onClick={() => setActiveTab('meet-requests')}
                            className="flex-1 py-2.5 min-h-[40px] bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Booked ({activeBooking.status === 'pending_broker_approval' ? 'Pending' : 'Approved'})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveMeetModal(profile)}
                            className="flex-1 py-2.5 min-h-[40px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Coffee className="w-4 h-4" />
                            <span>Book Model</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => setActiveProfileModal(profile)}
                          className="px-3 py-2.5 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
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
        <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-3xl p-5 sm:p-7 space-y-4">
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
              <p className="text-xs text-slate-200 font-medium font-sans">"The 30-min coffee option takes away the awkwardness of long dates. Excellent design!"</p>
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
