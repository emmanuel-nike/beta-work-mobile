import type { ImageSourcePropType } from 'react-native';

export type ArtisanCategory =
  | 'home'
  | 'beauty'
  | 'auto'
  | 'events'
  | 'fashion'
  | 'tech';

export type Artisan = Readonly<{
  id: string;
  name: string;
  trade: string;
  category: ArtisanCategory;
  image: ImageSourcePropType;
  rating: number;
  reviews: number;
  distanceKm: number;
  /** Lowest naira amount the artisan takes jobs at. */
  priceFrom: number;
  jobsCompleted: number;
  availableToday: boolean;
}>;

export const ARTISAN_CATEGORIES: ReadonlyArray<{
  id: ArtisanCategory | 'all';
  label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'auto', label: 'Auto' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'events', label: 'Events' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home', label: 'Home' },
  { id: 'tech', label: 'Tech' },
];

const PLUMBER = require('../../assets/images/dashboard/image0_1174_145674.png');
const STYLIST = require('../../assets/images/dashboard/image1_1174_145674.png');
const NAIL_TECH = require('../../assets/images/dashboard/image2_1174_145674.png');
const ELECTRICIAN = require('../../assets/images/dashboard/image1_676_87466.png');
const TAILOR = require('../../assets/images/dashboard/image0_676_87466.png');

export const ARTISANS: readonly Artisan[] = [
  {
    id: 'ar-1',
    name: 'Femilayo N.',
    trade: 'Electrician',
    category: 'home',
    image: ELECTRICIAN,
    rating: 3.2,
    reviews: 102,
    distanceKm: 4.2,
    priceFrom: 20000,
    jobsCompleted: 32,
    availableToday: true,
  },
  {
    id: 'ar-2',
    name: 'Tunde E.',
    trade: 'Plumber',
    category: 'home',
    image: PLUMBER,
    rating: 4.9,
    reviews: 102,
    distanceKm: 4.2,
    priceFrom: 27000,
    jobsCompleted: 32,
    availableToday: true,
  },
  {
    id: 'ar-3',
    name: 'Amaka S.',
    trade: 'Hair stylist',
    category: 'beauty',
    image: STYLIST,
    rating: 4.7,
    reviews: 102,
    distanceKm: 4.2,
    priceFrom: 8000,
    jobsCompleted: 12,
    availableToday: true,
  },
  {
    id: 'ar-4',
    name: 'Abraham K.',
    trade: 'Cleaner',
    category: 'home',
    image: PLUMBER,
    rating: 4.4,
    reviews: 102,
    distanceKm: 4.2,
    priceFrom: 12000,
    jobsCompleted: 32,
    availableToday: false,
  },
  {
    id: 'ar-5',
    name: 'Hannah O.',
    trade: 'Tailor',
    category: 'fashion',
    image: TAILOR,
    rating: 4.8,
    reviews: 102,
    distanceKm: 4.2,
    priceFrom: 15000,
    jobsCompleted: 22,
    availableToday: false,
  },
  {
    id: 'ar-6',
    name: 'Keisha K.',
    trade: 'Cleaner',
    category: 'home',
    image: NAIL_TECH,
    rating: 4.1,
    reviews: 102,
    distanceKm: 4.2,
    priceFrom: 10000,
    jobsCompleted: 17,
    availableToday: true,
  },
  {
    id: 'ar-7',
    name: 'Mariam Suleiman',
    trade: 'Hair Stylist',
    category: 'beauty',
    image: STYLIST,
    rating: 4.7,
    reviews: 84,
    distanceKm: 10.2,
    priceFrom: 12000,
    jobsCompleted: 41,
    availableToday: false,
  },
  {
    id: 'ar-8',
    name: 'Favour Sang',
    trade: 'Nail Technician',
    category: 'beauty',
    image: NAIL_TECH,
    rating: 4.8,
    reviews: 56,
    distanceKm: 3.1,
    priceFrom: 8000,
    jobsCompleted: 28,
    availableToday: true,
  },
  {
    id: 'ar-9',
    name: 'Chidi Okafor',
    trade: 'Mechanic',
    category: 'auto',
    image: ELECTRICIAN,
    rating: 4.6,
    reviews: 73,
    distanceKm: 6.5,
    priceFrom: 20000,
    jobsCompleted: 55,
    availableToday: false,
  },
  {
    id: 'ar-10',
    name: 'Ngozi Peters',
    trade: 'Event decorator',
    category: 'events',
    image: TAILOR,
    rating: 5,
    reviews: 39,
    distanceKm: 2.4,
    priceFrom: 35000,
    jobsCompleted: 19,
    availableToday: true,
  },
  {
    id: 'ar-11',
    name: 'Segun Bello',
    trade: 'Carpenter',
    category: 'home',
    image: PLUMBER,
    rating: 4.5,
    reviews: 61,
    distanceKm: 8.7,
    priceFrom: 18000,
    jobsCompleted: 44,
    availableToday: false,
  },
  {
    id: 'ar-12',
    name: 'Ifeanyi Obi',
    trade: 'Phone repair',
    category: 'tech',
    image: ELECTRICIAN,
    rating: 4.3,
    reviews: 27,
    distanceKm: 5.1,
    priceFrom: 6000,
    jobsCompleted: 31,
    availableToday: true,
  },
];

export const TOP_ARTISANS: readonly Artisan[] = ARTISANS.slice(0, 6);

/** Most recently opened artisan profiles, newest first. */
export const RECENTLY_VIEWED_ARTISANS: readonly Artisan[] = [
  ARTISANS[8],
  ARTISANS[9],
  ARTISANS[7],
  ARTISANS[6],
];

export function formatCompactPrice(amount: number): string {
  return amount >= 1000 ? `₦${Math.round(amount / 1000)}k+` : `₦${amount}+`;
}

export function formatFullPrice(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatDistance(distanceKm: number): string {
  return `${distanceKm} km`;
}

export function formatDistanceAway(distanceKm: number): string {
  return `${distanceKm}km away`;
}
