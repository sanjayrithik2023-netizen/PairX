/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingView } from './components/OnboardingView';
import { HomeView } from './components/HomeView';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { MeetRequestModal } from './components/MeetRequestModal';
import { MeetRequestsView } from './components/MeetRequestsView';
import { MessagesView } from './components/MessagesView';
import { VideoCallView } from './components/VideoCallView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { LoginModal } from './components/LoginModal';
import { ProfileView } from './components/ProfileView';

function MainLayout() {
  const { activeTab, callState } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Show Header unless in full video call mode or onboarding */}
      {activeTab !== 'onboarding' && !callState.active && (
        <Header />
      )}

      {/* Main Screen Content Routing */}
      <main className="flex-1">
        {activeTab === 'onboarding' && <OnboardingView />}
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'meet-requests' && <MeetRequestsView />}
        {activeTab === 'admin' && <AdminDashboardView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'call' && <VideoCallView />}
      </main>

      {/* Mobile Floating Bottom Nav */}
      {activeTab !== 'onboarding' && !callState.active && (
        <BottomNav />
      )}

      {/* Global Modals & Overlays */}
      <ProfileDetailModal />
      <MeetRequestModal />
      <LoginModal />

      {/* WebRTC Video Call Overlay if active while on another tab */}
      {callState.active && activeTab !== 'call' && (
        <VideoCallView />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
