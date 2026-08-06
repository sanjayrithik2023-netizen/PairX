import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, MapPin, Coffee, Lock, ArrowRight, CheckCircle2, Sparkles, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TIRUPPUR_LOCALITIES } from '../data/mockProfiles';

export const OnboardingView: React.FC = () => {
  const { setActiveTab, updateUserPreferences } = useApp();
  const [step, setStep] = useState<number>(1);
  const [selectedLocality, setSelectedLocality] = useState<string>('Rayapuram');
  const [selectedIntent, setSelectedIntent] = useState<string>('Dating & Romance');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Filter Coffee', 'Tamil Cinema', 'Badminton']);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleFinishOnboarding = () => {
    updateUserPreferences({
      localityFilter: selectedLocality,
    });
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Progress Bar */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">PairX</span>
            </div>
            <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-medium">
              Step {step} of 3
            </span>
          </div>

          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Welcome & Value Prop */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl overflow-hidden h-48 group">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
                    alt="Tiruppur Locals Connecting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-4">
                    <p className="text-white font-medium text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      Authentic local connections in Tiruppur
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Welcome to PairX Tiruppur
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The premium local platform for adults in Tiruppur to discover verified singles, book safe coffee meetups, and connect securely.
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100/60">
                    <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">100% Verified Local Profiles</h4>
                      <p className="text-[11px] text-slate-500">Government ID & selfie photo verified Tiruppur residents.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-pink-50/50 border border-pink-100/60">
                    <Coffee className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">30 & 60 Min Public Meet Requests</h4>
                      <p className="text-[11px] text-slate-500">Invite dates to safe coffee lounges on Avinashi Road or PN Road.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100/60">
                    <Lock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">E2E Encrypted & HD Calling</h4>
                      <p className="text-[11px] text-slate-500">End-to-end private messaging & WebRTC video calling.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>Set Up Preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Locality & Intent Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Tiruppur Locality</h3>
                  <p className="text-xs text-slate-500 mt-1">Select your neighborhood to discover nearby verified members.</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {TIRUPPUR_LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocality(loc)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                          selectedLocality === loc
                            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocality === loc && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">What are you looking for?</h3>
                  <div className="space-y-2 mt-2">
                    {['Dating & Romance', 'Casual Coffee', 'Networking', 'Serious Relationship'].map((intent) => (
                      <button
                        key={intent}
                        onClick={() => setSelectedIntent(intent)}
                        className={`w-full p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          selectedIntent === intent
                            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{intent}</span>
                        {selectedIntent === intent && <Sparkles className="w-4 h-4 text-rose-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 border border-slate-200 font-semibold text-slate-600 text-xs rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Interests</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Interests & Final CTA */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Select Your Interests</h3>
                  <p className="text-xs text-slate-500 mt-1">Pick at least 3 topics to boost compatibility matching in Tiruppur.</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      'Filter Coffee', 'Tamil Cinema', 'Badminton', 'Design', 
                      'Entrepreneurship', 'Foodie Tours', 'Road Trips', 'Fitness', 
                      'Music', 'Photography', 'Yoga', 'Architecture'
                    ].map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Safety & Trust guarantee */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-semibold block">Privacy & Security Promise</span>
                    Your phone number and exact live location are never revealed publicly. All dates meet in safe public venues.
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 border border-slate-200 font-semibold text-slate-600 text-xs rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinishOnboarding}
                    className="w-2/3 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore Tiruppur Singles</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
