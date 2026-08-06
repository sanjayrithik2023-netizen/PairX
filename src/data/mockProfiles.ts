import { UserProfile, ServicePoint } from '../types';

export const BROKER_PROFILE: UserProfile = {
  id: 'broker-admin',
  name: 'PairX Single Broker Desk',
  age: 35,
  gender: 'male',
  occupation: 'Licensed Tiruppur Social Broker & Service Concierge',
  locality: 'Rayapuram Main Office, Tiruppur',
  bio: 'Official PairX Broker Concierge. We manage girl profiles with 100% privacy, verify boy client identity, and facilitate bookings at official Service Points.',
  interests: ['Service Point Mgmt', 'Identity Audit', 'WebRTC Video Desk', 'Client Concierge'],
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  photos: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'],
  verified: true,
  managedByBroker: true,
  distanceKm: 0,
  online: true,
  lastActive: 'Active Call Desk',
  compatibilityScore: 100,
  intent: 'Networking'
};

export const INITIAL_SERVICE_POINTS: ServicePoint[] = [
  {
    id: 'sp-1',
    name: 'PairX Executive Lounge - Rayapuram',
    type: 'Executive Service Point',
    locality: 'Rayapuram',
    address: 'Door 42, Kumaran Road, Rayapuram, Tiruppur',
    managerContact: '+91 98420 11223',
    facilities: ['Private Lounge', 'AC Refreshments', 'Biometric Security', 'CCTV Entrance'],
    activeStatus: 'Active'
  },
  {
    id: 'sp-2',
    name: 'PairX Smart Hub - Avinashi Road',
    type: 'Premium Meeting Lounge',
    locality: 'Avinashi Road',
    address: 'Plot 108, Avinashi Road, Near Pushpa Theatre, Tiruppur',
    managerContact: '+91 98420 44556',
    facilities: ['Beverage Station', 'High-Speed Wi-Fi', 'Private Cabana'],
    activeStatus: 'Active'
  },
  {
    id: 'sp-3',
    name: 'PairX Concierge Station - PN Road',
    type: 'VIP Service Center',
    locality: 'PN Road',
    address: 'Near Old Bus Stand Junction, PN Road, Tiruppur',
    managerContact: '+91 98420 77889',
    facilities: ['VIP Reception', 'Private Meeting Suite', 'Parking Support'],
    activeStatus: 'Active'
  },
  {
    id: 'sp-4',
    name: 'PairX Garden Service Point - Dharapuram Road',
    type: 'Outdoor Cafe Service Lounge',
    locality: 'Dharapuram Road',
    address: 'Opposite Government Hospital Road, Dharapuram Road, Tiruppur',
    managerContact: '+91 98420 99001',
    facilities: ['Garden Cafe', 'Private Pods', 'Valet Parking'],
    activeStatus: 'Active'
  }
];

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Priya Sundaram',
    age: 25,
    gender: 'female',
    occupation: 'Textile Designer & Fashion Stylist',
    locality: 'Rayapuram, Tiruppur',
    bio: 'Profile uploaded & verified by PairX Broker. Passionate about traditional saree design and filter coffee. Available for broker-approved meetups at Rayapuram Executive Lounge.',
    interests: ['Filter Coffee', 'Design', 'Tamil Cinema', 'Fitness', 'Foodie Tours'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    verified: true,
    managedByBroker: true,
    servicePointId: 'sp-1',
    distanceKm: 1.8,
    online: true,
    lastActive: 'Managed by Broker',
    compatibilityScore: 96,
    intent: 'Dating & Romance',
    heightCm: 165,
    education: 'B.Des Fashion, NIFT',
    languages: ['Tamil', 'English'],
    lookingFor: 'Kind, honest partner. All requests reviewed by PairX Broker.'
  },
  {
    id: 'user-3',
    name: 'Divya Natesan',
    age: 24,
    gender: 'female',
    occupation: 'Software Engineer & UI Designer',
    locality: 'PN Road, Tiruppur',
    bio: 'Broker Vetted Girl Profile. Techie by day, amateur painter by weekend. Loves listening to Ilaiyaraaja melodies. Available for meetings at PN Road VIP Service Station.',
    interests: ['UI Design', 'Art & Sketching', 'Music', 'Tech Startups', 'South Indian Cuisine'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    verified: true,
    managedByBroker: true,
    servicePointId: 'sp-3',
    distanceKm: 3.1,
    online: true,
    lastActive: 'Managed by Broker',
    compatibilityScore: 89,
    intent: 'Serious Relationship',
    heightCm: 162,
    education: 'B.Tech IT, PSG Tech',
    languages: ['Tamil', 'English'],
    lookingFor: 'An intellectually curious person with good values.'
  },
  {
    id: 'user-5',
    name: 'Ananya Krishnan',
    age: 26,
    gender: 'female',
    occupation: 'Classical Dancer & Yoga Instructor',
    locality: 'Kumaran Road, Tiruppur',
    bio: 'Broker Verified Profile. Mindfulness practitioner, Bharatanatyam dancer, and healthy living advocate. Available for scheduled meetings at PairX Service Points.',
    interests: ['Yoga', 'Dance', 'Wellness', 'Books', 'Organic Farming'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    verified: true,
    managedByBroker: true,
    servicePointId: 'sp-1',
    distanceKm: 1.2,
    online: true,
    lastActive: 'Managed by Broker',
    compatibilityScore: 94,
    intent: 'Serious Relationship',
    heightCm: 168,
    education: 'M.A. Performing Arts',
    languages: ['Tamil', 'English', 'Malayalam'],
    lookingFor: 'Someone peaceful, respectful, and family-oriented.'
  },
  {
    id: 'user-7',
    name: 'Kavitha Ramachandran',
    age: 27,
    gender: 'female',
    occupation: 'Boutique Owner & Garment Merchant',
    locality: 'Avinashi Road, Tiruppur',
    bio: 'Broker Uploaded & Authenticated. Runs a premier ethnic boutique on Avinashi Road. Interested in meaningful dates via PairX Broker Service Point.',
    interests: ['Boutique Fashion', 'Classical Music', 'Baking', 'Tiruppur History'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80'
    ],
    verified: true,
    managedByBroker: true,
    servicePointId: 'sp-2',
    distanceKm: 2.1,
    online: true,
    lastActive: 'Managed by Broker',
    compatibilityScore: 91,
    intent: 'Casual Coffee',
    heightCm: 164,
    education: 'B.Com Commerce',
    languages: ['Tamil', 'English']
  }
];

export const TIRUPPUR_LOCALITIES = [
  'All Localities',
  'Rayapuram',
  'Avinashi Road',
  'PN Road',
  'Dharapuram Road',
  'Kumaran Road',
  'Velampalayam',
  'Boyampalayam'
];

export const RECOMMENDED_MEET_LOCATIONS = INITIAL_SERVICE_POINTS.map(sp => ({
  name: sp.name,
  type: sp.type,
  area: sp.locality
}));

