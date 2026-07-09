export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'recycler';
  rewardPoints: number;
  co2Saved: number; // in kg
  treesPlanted: number;
  waterSaved: number; // in Liters
  profilePhoto?: string;
  companyName?: string;
  rating?: number;
  recyclerId?: string;
  earnings?: number; // for recyclers
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Collected' | 'Completed';

export interface WasteRequest {
  id: string; // e.g. #REQ-402
  userId: string;
  userName: string;
  wasteType: 'Plastic' | 'Paper' | 'Cardboard' | 'Glass' | 'Metal' | 'E-Waste' | 'Mixed';
  quantity: number; // in kg
  pickupAddress: string;
  contactNumber: string;
  preferredPickupDate: string;
  status: RequestStatus;
  createdAt: string;
}

export type ActivePage = 'home' | 'login' | 'register' | 'sell' | 'dashboard-user' | 'dashboard-recycler';
