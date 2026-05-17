import { User, Trip, Post, Achievement, Voucher, Hotel, Destination, UserStats } from "@shared/schema";

// Activity type re-exported from shared schema
export type { Activity } from "@shared/schema";

// For the tab navigation
export type TabType = 'activity-feed' | 'my-trips' | 'bookings';

// For the destination search on the booking tab
export type SearchParams = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
};

// For the eco-transport search
export type TransportParams = {
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  transportType: 'car' | 'train' | 'flight';
};

// Carbon saving sources
export type CarbonSource = {
  name: string;
  icon: string;
  amount: number;
};

// Reward item
export type Reward = {
  name: string;
  icon: string;
  pointsNeeded: number;
};
