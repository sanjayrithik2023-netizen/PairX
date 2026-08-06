export type Gender = 'female' | 'male';

export type DatingIntent = 'Dating & Romance' | 'Casual Coffee' | 'Networking' | 'Serious Relationship';

export interface ServicePoint {
  id: string;
  name: string;
  type: string; // e.g. 'Executive Lounge', 'Private Meeting Hub', 'VIP Service Station'
  locality: string; // e.g., 'Rayapuram, Tiruppur'
  address: string;
  managerContact: string;
  facilities: string[];
  activeStatus: 'Active' | 'Maintenance';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  occupation: string;
  locality: string; // e.g., 'PN Road, Tiruppur', 'Rayapuram, Tiruppur'
  bio: string;
  interests: string[];
  photos: string[];
  avatar: string;
  verified: boolean;
  managedByBroker: boolean; // female profiles are uploaded/managed exclusively by the admin broker
  servicePointId?: string; // Assigned Tiruppur service point center
  distanceKm: number;
  online: boolean;
  lastActive: string;
  compatibilityScore: number; // e.g. 94%
  intent: DatingIntent;
  heightCm?: number;
  education?: string;
  languages?: string[];
  lookingFor?: string;
}

export type MeetDuration = 30 | 60;
export type MeetStatus = 'pending_broker_approval' | 'broker_approved' | 'declined_by_broker' | 'completed';

export interface MeetRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhoto: string;
  targetProfileId: string;
  targetProfileName: string;
  targetProfilePhoto: string;
  servicePointId: string;
  servicePointName: string;
  durationMinutes: MeetDuration;
  date: string;
  timeSlot: string; // e.g., "05:30 PM"
  notes: string;
  status: MeetStatus;
  brokerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  imageUrl?: string;
  locationPin?: {
    title: string;
    address: string;
  };
  isIcebreaker?: boolean;
  isBrokerMessage?: boolean;
}

export interface Conversation {
  id: string;
  partner: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isEncrypted: boolean;
  servicePointName?: string;
  requestId?: string;
}

export interface CallState {
  active: boolean;
  type: 'audio' | 'video';
  remoteUser: UserProfile | null;
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  connectionQuality: 'Excellent P2P' | 'Good' | 'Reconnecting';
  incoming: boolean;
  isBrokerCall: boolean; // Indicates call is with single central broker desk
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'meet_request' | 'message' | 'call' | 'verification' | 'system';
  read: boolean;
}

export interface UserPreferences {
  ghostMode: boolean;
  hideDistance: boolean;
  twoFactorAuth: boolean;
  pushNotifications: boolean;
  targetGender: string;
  minAge: number;
  maxAge: number;
  localityFilter: string;
}

