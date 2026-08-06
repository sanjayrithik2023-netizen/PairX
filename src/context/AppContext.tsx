import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  UserProfile, 
  ServicePoint,
  MeetRequest, 
  ChatMessage, 
  Conversation, 
  CallState, 
  AppNotification, 
  UserPreferences,
  MeetDuration,
  MeetStatus 
} from '../types';
import { INITIAL_PROFILES, INITIAL_SERVICE_POINTS, BROKER_PROFILE } from '../data/mockProfiles';

export type AdminSubTab = 'broker_chat' | 'meets' | 'girl_profiles' | 'service_points' | 'overview' | 'broadcast';

interface AppContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isAdmin: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminSubTab: AdminSubTab;
  setAdminSubTab: (tab: AdminSubTab) => void;
  profiles: UserProfile[];
  servicePoints: ServicePoint[];
  favoriteProfileIds: string[];
  likedProfileIds: string[];
  meetRequests: MeetRequest[];
  conversations: Conversation[];
  chatMessages: Record<string, ChatMessage[]>;
  notifications: AppNotification[];
  callState: CallState;
  userPreferences: UserPreferences;
  activeProfileModal: UserProfile | null;
  setActiveProfileModal: (profile: UserProfile | null) => void;
  activeMeetModal: UserProfile | null;
  setActiveMeetModal: (profile: UserProfile | null) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  
  // Actions
  loginDemoUser: (role: 'user' | 'admin') => void;
  logout: () => void;
  toggleLikeProfile: (id: string) => void;
  toggleFavoriteProfile: (id: string) => void;
  createMeetRequest: (
    targetProfile: UserProfile, 
    servicePoint: ServicePoint,
    durationMinutes: MeetDuration, 
    date: string, 
    timeSlot: string, 
    notes: string
  ) => void;
  updateMeetRequestStatus: (
    requestId: string, 
    status: MeetStatus, 
    brokerNotes?: string,
    selectedServicePoint?: ServicePoint
  ) => void;
  
  // Girl Profile CRUD (Broker Admin only)
  addGirlProfile: (profile: Omit<UserProfile, 'id'>) => void;
  updateGirlProfile: (id: string, profile: Partial<UserProfile>) => void;
  deleteGirlProfile: (id: string) => void;

  // Service Point CRUD (Broker Admin only)
  addServicePoint: (sp: Omit<ServicePoint, 'id'>) => void;
  updateServicePoint: (id: string, sp: Partial<ServicePoint>) => void;
  deleteServicePoint: (id: string) => void;

  sendMessage: (
    conversationId: string, 
    text: string, 
    options?: { imageUrl?: string; locationPin?: { title: string; address: string } }
  ) => void;
  generateAIIcebreaker: (conversationId: string, partner: UserProfile) => Promise<string>;
  startCall: (type: 'audio' | 'video') => void;
  endCall: () => void;
  acceptCall: () => void;
  declineCall: () => void;
  toggleMuteCall: () => void;
  toggleVideoCall: () => void;
  markNotificationsRead: () => void;
  updateUserPreferences: (newPrefs: Partial<UserPreferences>) => void;
  broadcastNotification: (title: string, message: string) => void;
  triggerSimulatedIncomingCall: () => void;
}

const DEFAULT_CURRENT_USER: UserProfile = {
  id: 'boy-client-1',
  name: 'Rohan Sharma',
  age: 27,
  gender: 'male',
  occupation: 'Apparel Merchandiser & Client User',
  locality: 'Rayapuram, Tiruppur',
  bio: 'Tiruppur resident looking to connect with verified girl profiles through PairX Licensed Broker.',
  interests: ['Coffee', 'Badminton', 'Photography', 'Technology', 'Road Trips'],
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'],
  verified: true,
  managedByBroker: false,
  distanceKm: 0,
  online: true,
  lastActive: 'Just now',
  compatibilityScore: 100,
  intent: 'Dating & Romance',
  heightCm: 175,
  education: 'B.Tech IT',
  languages: ['Tamil', 'English']
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('broker_chat');
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>(INITIAL_SERVICE_POINTS);
  const [favoriteProfileIds, setFavoriteProfileIds] = useState<string[]>(['user-1']);
  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(['user-1', 'user-3']);
  
  const [activeProfileModal, setActiveProfileModal] = useState<UserProfile | null>(null);
  const [activeMeetModal, setActiveMeetModal] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Check initial URL route for /admin or /admin/login
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      setIsAdmin(true);
      setActiveTab('admin');
      setCurrentUser({
        ...DEFAULT_CURRENT_USER,
        name: 'PairX Admin (Single Broker)',
        occupation: 'Platform Administrator & Broker Manager'
      });
    }
  }, []);

  // Initial Meet Requests forwarded to Broker
  const [meetRequests, setMeetRequests] = useState<MeetRequest[]>([
    {
      id: 'req-101',
      requesterId: 'boy-client-1',
      requesterName: 'Rohan Sharma',
      requesterPhoto: DEFAULT_CURRENT_USER.avatar,
      targetProfileId: 'user-1',
      targetProfileName: 'Priya Sundaram',
      targetProfilePhoto: INITIAL_PROFILES[0].avatar,
      servicePointId: 'sp-1',
      servicePointName: 'PairX Executive Lounge - Rayapuram',
      durationMinutes: 30,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '05:30 PM',
      notes: 'Submitted request for 30-min coffee meeting at Rayapuram Lounge.',
      status: 'broker_approved',
      brokerNotes: 'Identity verified. Lounge room booked.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'req-102',
      requesterId: 'boy-client-2',
      requesterName: 'Karthik Natesan',
      requesterPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      targetProfileId: 'user-2',
      targetProfileName: 'Kavya Ramakrishnan',
      targetProfilePhoto: INITIAL_PROFILES[1].avatar,
      servicePointId: 'sp-2',
      servicePointName: 'PairX Meeting Hub - Avinashi Road',
      durationMinutes: 45,
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      timeSlot: '06:00 PM',
      notes: 'Please check if Avinashi Road private lounge is available for 6:00 PM.',
      status: 'pending_broker_approval',
      brokerNotes: '',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'req-103',
      requesterId: 'boy-client-3',
      requesterName: 'Anish Verma',
      requesterPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      targetProfileId: 'user-3',
      targetProfileName: 'Sneha Patel',
      targetProfilePhoto: INITIAL_PROFILES[2].avatar,
      servicePointId: 'sp-3',
      servicePointName: 'PairX VIP Suite - PN Road Center',
      durationMinutes: 60,
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      timeSlot: '07:30 PM',
      notes: 'Client requesting security deposit clearance and location pin.',
      status: 'pending_broker_approval',
      brokerNotes: '',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'req-104',
      requesterId: 'boy-client-4',
      requesterName: 'Vikram Subramaniam',
      requesterPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
      targetProfileId: 'user-4',
      targetProfileName: 'Divya Krishnan',
      targetProfilePhoto: INITIAL_PROFILES[3].avatar,
      servicePointId: 'sp-1',
      servicePointName: 'PairX Executive Lounge - Rayapuram',
      durationMinutes: 30,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '04:00 PM',
      notes: 'Repeat client. ID already on file.',
      status: 'broker_approved',
      brokerNotes: 'Identity pre-cleared. Lounge Suite #1 reserved.',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      updatedAt: new Date(Date.now() - 14400000).toISOString()
    }
  ]);

  // Initial Conversations with BROKER_PROFILE
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-broker',
      partner: BROKER_PROFILE,
      lastMessage: 'Your request for Priya Sundaram at Rayapuram Lounge is APPROVED by Broker.',
      lastMessageTime: '10:42 AM',
      unreadCount: 1,
      isEncrypted: true,
      servicePointName: 'PairX Executive Lounge - Rayapuram',
      requestId: 'req-101'
    },
    {
      id: 'conv-req-102',
      partner: {
        id: 'boy-client-2',
        name: 'Karthik Natesan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        age: 28,
        gender: 'male',
        locality: 'Avinashi Road, Tiruppur',
        bio: 'Verified PairX Client',
        interests: ['Tech', 'Dining'],
        verified: true,
        online: true,
        photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200']
      },
      lastMessage: 'Hello Broker Desk, submitted booking request for Kavya Ramakrishnan.',
      lastMessageTime: '11:15 AM',
      unreadCount: 2,
      isEncrypted: true,
      servicePointName: 'PairX Meeting Hub - Avinashi Road',
      requestId: 'req-102'
    },
    {
      id: 'conv-req-103',
      partner: {
        id: 'boy-client-3',
        name: 'Anish Verma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        age: 31,
        gender: 'male',
        locality: 'PN Road, Tiruppur',
        bio: 'Verified PairX Client',
        interests: ['Business', 'Coffee'],
        verified: true,
        online: true,
        photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200']
      },
      lastMessage: 'Can I get the location pin for PN Road Center VIP Lounge?',
      lastMessageTime: '09:50 AM',
      unreadCount: 1,
      isEncrypted: true,
      servicePointName: 'PairX VIP Suite - PN Road Center',
      requestId: 'req-103'
    },
    {
      id: 'conv-req-104',
      partner: {
        id: 'boy-client-4',
        name: 'Vikram Subramaniam',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
        age: 29,
        gender: 'male',
        locality: 'Rayapuram, Tiruppur',
        bio: 'Verified PairX VIP Client',
        interests: ['Fitness', 'Travel'],
        verified: true,
        online: false,
        photos: ['https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200']
      },
      lastMessage: 'Thank you Broker Desk! See you tomorrow at 4 PM.',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isEncrypted: true,
      servicePointName: 'PairX Executive Lounge - Rayapuram',
      requestId: 'req-104'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'conv-broker': [
      {
        id: 'msg-1',
        conversationId: 'conv-broker',
        senderId: BROKER_PROFILE.id,
        senderName: 'PairX Single Broker Desk',
        text: 'Hello Rohan! I am your assigned PairX Broker for Tiruppur. I received your request for Priya Sundaram.',
        timestamp: '10:30 AM',
        status: 'read',
        isBrokerMessage: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-broker',
        senderId: 'boy-client-1',
        senderName: 'Rohan Sharma',
        text: 'Hi Broker! Thanks for verifying my identity. Is the 5:30 PM slot at Rayapuram Lounge confirmed?',
        timestamp: '10:35 AM',
        status: 'read'
      },
      {
        id: 'msg-3',
        conversationId: 'conv-broker',
        senderId: BROKER_PROFILE.id,
        senderName: 'PairX Single Broker Desk',
        text: 'Yes, your booking is APPROVED! Rayapuram Lounge Suite #2 is reserved. You can call our Broker WebRTC desk anytime for assistance.',
        timestamp: '10:42 AM',
        status: 'delivered',
        isBrokerMessage: true
      }
    ],
    'conv-req-102': [
      {
        id: 'msg-k1',
        conversationId: 'conv-req-102',
        senderId: 'boy-client-2',
        senderName: 'Karthik Natesan',
        text: 'Hello PairX Broker Desk, I just submitted a booking request for Kavya Ramakrishnan at Avinashi Road Lounge.',
        timestamp: '11:10 AM',
        status: 'read'
      },
      {
        id: 'msg-k2',
        conversationId: 'conv-req-102',
        senderId: 'boy-client-2',
        senderName: 'Karthik Natesan',
        text: 'Is the 6:00 PM slot tomorrow available?',
        timestamp: '11:15 AM',
        status: 'sent'
      }
    ],
    'conv-req-103': [
      {
        id: 'msg-a1',
        conversationId: 'conv-req-103',
        senderId: 'boy-client-3',
        senderName: 'Anish Verma',
        text: 'Hi Broker Desk! Can I get the exact location pin and entrance instructions for PN Road VIP Suite?',
        timestamp: '09:50 AM',
        status: 'read'
      }
    ],
    'conv-req-104': [
      {
        id: 'msg-v1',
        conversationId: 'conv-req-104',
        senderId: BROKER_PROFILE.id,
        senderName: 'PairX Single Broker Desk',
        text: 'Hello Vikram! Your request for Divya Krishnan at Rayapuram Lounge is cleared.',
        timestamp: 'Yesterday',
        status: 'read',
        isBrokerMessage: true
      },
      {
        id: 'msg-v2',
        conversationId: 'conv-req-104',
        senderId: 'boy-client-4',
        senderName: 'Vikram Subramaniam',
        text: 'Thank you Broker Desk! See you tomorrow at 4 PM.',
        timestamp: 'Yesterday',
        status: 'read'
      }
    ]
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Broker Clearance Approved',
      message: 'Your meeting request for Priya Sundaram has been approved by PairX Broker.',
      timestamp: '10m ago',
      type: 'meet_request',
      read: false
    }
  ]);

  // Call State (Always connects to Single Broker Desk)
  const [callState, setCallState] = useState<CallState>({
    active: false,
    type: 'video',
    remoteUser: BROKER_PROFILE,
    durationSeconds: 0,
    isMuted: false,
    isVideoOff: false,
    isSpeakerOn: true,
    connectionQuality: 'Excellent P2P',
    incoming: false,
    isBrokerCall: true
  });

  // User Preferences
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    ghostMode: false,
    hideDistance: false,
    twoFactorAuth: true,
    pushNotifications: true,
    targetGender: 'all',
    minAge: 20,
    maxAge: 35,
    localityFilter: 'All Localities'
  });

  // Timer for active call duration
  useEffect(() => {
    let timer: any;
    if (callState.active && !callState.incoming) {
      timer = setInterval(() => {
        setCallState(prev => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.active, callState.incoming]);

  const loginDemoUser = useCallback((role: 'user' | 'admin') => {
    setIsAuthenticated(true);
    if (role === 'admin') {
      setIsAdmin(true);
      setActiveTab('admin');
      setCurrentUser({
        ...DEFAULT_CURRENT_USER,
        name: 'PairX Admin (Single Broker)',
        occupation: 'Platform Administrator & Broker Manager'
      });
    } else {
      setIsAdmin(false);
      setCurrentUser(DEFAULT_CURRENT_USER);
      setActiveTab('home');
    }
    setIsLoginModalOpen(false);
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setActiveTab('onboarding');
  };

  const toggleLikeProfile = (id: string) => {
    setLikedProfileIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteProfile = (id: string) => {
    setFavoriteProfileIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const createMeetRequest = (
    targetProfile: UserProfile, 
    servicePoint: ServicePoint,
    durationMinutes: MeetDuration, 
    date: string, 
    timeSlot: string, 
    notes: string
  ) => {
    const newReq: MeetRequest = {
      id: `req-${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterPhoto: currentUser.avatar,
      targetProfileId: targetProfile.id,
      targetProfileName: targetProfile.name,
      targetProfilePhoto: targetProfile.avatar,
      servicePointId: servicePoint.id,
      servicePointName: servicePoint.name,
      durationMinutes,
      date,
      timeSlot,
      notes,
      status: 'pending_broker_approval',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMeetRequests(prev => [newReq, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Forwarded to PairX Broker',
      message: `Your booking request for ${targetProfile.name} at ${servicePoint.name} has been submitted to the Broker for clearance.`,
      timestamp: 'Just now',
      type: 'meet_request',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateMeetRequestStatus = (
    requestId: string, 
    status: MeetStatus, 
    brokerNotes?: string,
    selectedServicePoint?: ServicePoint
  ) => {
    setMeetRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const targetSPId = selectedServicePoint ? selectedServicePoint.id : req.servicePointId;
        const targetSPName = selectedServicePoint ? selectedServicePoint.name : req.servicePointName;

        const updated = {
          ...req,
          status,
          servicePointId: targetSPId,
          servicePointName: targetSPName,
          brokerNotes: brokerNotes || req.brokerNotes,
          updatedAt: new Date().toISOString()
        };

        // If approved by broker, unlock/create broker conversation
        if (status === 'broker_approved') {
          const convId = req.id === 'req-101' ? 'conv-broker' : `conv-${req.id}`;
          
          setConversations(cPrev => {
            const exists = cPrev.some(c => c.id === convId);
            if (!exists) {
              return [
                {
                  id: convId,
                  partner: {
                    id: req.requesterId || `user-${req.id}`,
                    name: req.requesterName,
                    avatar: req.requesterPhoto,
                    age: 27,
                    gender: 'male',
                    locality: 'Tiruppur',
                    bio: 'Verified PairX Client',
                    interests: ['Dating', 'Coffee'],
                    verified: true,
                    online: true,
                    photos: [req.requesterPhoto]
                  },
                  lastMessage: `Broker APPROVED booking for ${req.targetProfileName} at ${targetSPName}`,
                  lastMessageTime: 'Just now',
                  unreadCount: 1,
                  isEncrypted: true,
                  servicePointName: targetSPName,
                  requestId: req.id
                },
                ...cPrev
              ];
            } else {
              return cPrev.map(c => c.id === convId ? {
                ...c,
                servicePointName: targetSPName,
                lastMessage: `Broker APPROVED booking for ${req.targetProfileName} at ${targetSPName}`,
                lastMessageTime: 'Just now'
              } : c);
            }
          });

          // Append broker system message
          const approveMsg: ChatMessage = {
            id: `msg-approve-${Date.now()}`,
            conversationId: convId,
            senderId: BROKER_PROFILE.id,
            senderName: 'PairX Single Broker Desk',
            text: `🎉 Request APPROVED! Your meeting with ${req.targetProfileName} is confirmed for ${req.date} at ${req.timeSlot} at ${targetSPName}. ${brokerNotes ? `Broker Note: ${brokerNotes}` : ''}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
            isBrokerMessage: true
          };

          setChatMessages(mPrev => ({
            ...mPrev,
            [convId]: [...(mPrev[convId] || []), approveMsg]
          }));

          // Send notification to user
          setNotifications(nPrev => [
            {
              id: `notif-appr-${Date.now()}`,
              title: 'Broker Clearance Approved!',
              message: `Your booking for ${req.targetProfileName} at ${targetSPName} is APPROVED. WebRTC Call & Broker Chat are active!`,
              timestamp: 'Just now',
              type: 'meet_request',
              read: false
            },
            ...nPrev
          ]);
        }

        return updated;
      }
      return req;
    }));
  };

  // Girl Profile CRUD Actions (Broker Admin Only)
  const addGirlProfile = (profileData: Omit<UserProfile, 'id'>) => {
    const newGirl: UserProfile = {
      ...profileData,
      id: `girl-${Date.now()}`,
      gender: 'female',
      managedByBroker: true,
      verified: true,
      online: true,
      lastActive: 'Managed by Broker'
    };
    setProfiles(prev => [newGirl, ...prev]);
    broadcastNotification('New Profile Listed', `Broker uploaded new verified girl profile: ${newGirl.name}`);
  };

  const updateGirlProfile = (id: string, updatedFields: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteGirlProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  // Service Point CRUD Actions (Broker Admin Only)
  const addServicePoint = (spData: Omit<ServicePoint, 'id'>) => {
    const newSP: ServicePoint = {
      ...spData,
      id: `sp-${Date.now()}`
    };
    setServicePoints(prev => [...prev, newSP]);
  };

  const updateServicePoint = (id: string, updatedFields: Partial<ServicePoint>) => {
    setServicePoints(prev => prev.map(sp => sp.id === id ? { ...sp, ...updatedFields } : sp));
  };

  const deleteServicePoint = (id: string) => {
    setServicePoints(prev => prev.filter(sp => sp.id !== id));
  };

  const sendMessage = (
    conversationId: string, 
    text: string, 
    options?: { imageUrl?: string; locationPin?: { title: string; address: string } }
  ) => {
    const isFromAdmin = isAdmin;
    const senderId = isFromAdmin ? BROKER_PROFILE.id : currentUser.id;
    const senderName = isFromAdmin ? BROKER_PROFILE.name : currentUser.name;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      imageUrl: options?.imageUrl,
      locationPin: options?.locationPin,
      isBrokerMessage: isFromAdmin
    };

    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text || (options?.locationPin ? '📍 Shared Service Point Location' : 'Attachment'),
          lastMessageTime: 'Just now'
        };
      }
      return c;
    }));

    // If client sent message, simulate broker automated response if not in admin mode
    if (!isFromAdmin) {
      setTimeout(() => {
        const brokerReply: ChatMessage = {
          id: `msg-broker-reply-${Date.now()}`,
          conversationId,
          senderId: BROKER_PROFILE.id,
          senderName: BROKER_PROFILE.name,
          text: `PairX Broker Desk received your message. Our concierge manager is standing by. Feel free to launch a direct WebRTC Call to speak to us!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          isBrokerMessage: true
        };
        setChatMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), brokerReply]
        }));
      }, 1800);
    }
  };

  const generateAIIcebreaker = async (conversationId: string, partner: UserProfile): Promise<string> => {
    try {
      const response = await fetch('/api/ai-icebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileName: partner.name,
          interests: partner.interests,
          location: partner.locality,
          tone: 'friendly'
        })
      });
      const data = await response.json();
      return data.icebreaker || `Hello PairX Broker, I have a query regarding my booking for ${partner.name}.`;
    } catch {
      return `Hello PairX Broker, I would like to confirm my meeting details.`;
    }
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallState({
      active: true,
      type,
      remoteUser: BROKER_PROFILE,
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      connectionQuality: 'Excellent P2P',
      incoming: false,
      isBrokerCall: true
    });
    setActiveTab('call');
  };

  const triggerSimulatedIncomingCall = () => {
    setCallState({
      active: true,
      type: 'video',
      remoteUser: BROKER_PROFILE,
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      connectionQuality: 'Excellent P2P',
      incoming: true,
      isBrokerCall: true
    });
  };

  const endCall = () => {
    setCallState({
      active: false,
      type: 'video',
      remoteUser: BROKER_PROFILE,
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      connectionQuality: 'Excellent P2P',
      incoming: false,
      isBrokerCall: true
    });
    setActiveTab('messages');
  };

  const acceptCall = () => {
    setCallState(prev => ({
      ...prev,
      incoming: false,
      active: true
    }));
  };

  const declineCall = () => {
    endCall();
  };

  const toggleMuteCall = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleVideoCall = () => {
    setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateUserPreferences = (newPrefs: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const broadcastNotification = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `broadcast-${Date.now()}`,
      title: `📣 ${title}`,
      message,
      timestamp: 'Just now',
      type: 'system',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const contextValue = useMemo(() => ({
    currentUser,
    isAuthenticated,
    isAdmin,
    activeTab,
    setActiveTab,
    adminSubTab,
    setAdminSubTab,
    profiles,
    servicePoints,
    favoriteProfileIds,
    likedProfileIds,
    meetRequests,
    conversations,
    chatMessages,
    notifications,
    callState,
    userPreferences,
    activeProfileModal,
    setActiveProfileModal,
    activeMeetModal,
    setActiveMeetModal,
    isLoginModalOpen,
    setIsLoginModalOpen,

    loginDemoUser,
    logout,
    toggleLikeProfile,
    toggleFavoriteProfile,
    createMeetRequest,
    updateMeetRequestStatus,
    addGirlProfile,
    updateGirlProfile,
    deleteGirlProfile,
    addServicePoint,
    updateServicePoint,
    deleteServicePoint,
    sendMessage,
    generateAIIcebreaker,
    startCall,
    endCall,
    acceptCall,
    declineCall,
    toggleMuteCall,
    toggleVideoCall,
    markNotificationsRead,
    updateUserPreferences,
    broadcastNotification,
    triggerSimulatedIncomingCall
  }), [
    currentUser,
    isAuthenticated,
    isAdmin,
    activeTab,
    adminSubTab,
    profiles,
    servicePoints,
    favoriteProfileIds,
    likedProfileIds,
    meetRequests,
    conversations,
    chatMessages,
    notifications,
    callState,
    userPreferences,
    activeProfileModal,
    activeMeetModal,
    isLoginModalOpen,
    loginDemoUser
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

