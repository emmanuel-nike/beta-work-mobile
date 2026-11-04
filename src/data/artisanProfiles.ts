import type { ImageSourcePropType } from 'react-native';

import { findCatalogueArtisan, type Artisan } from './artisans';

export type Review = Readonly<{
  id: string;
  author: string;
  area: string;
  rating: number;
  postedAgo: string;
  body: string;
  avatar: ImageSourcePropType;
}>;

export type RatingBreakdown = Readonly<{
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
}>;

export type OfferedService = Readonly<{
  name: string;
  priceLabel: string;
}>;

export type TrustItem = Readonly<{
  title: string;
  detail: string;
}>;

export type ArtisanProfile = Readonly<{
  headline: string;
  bio: string;
  completedJobs: number;
  yearsExperience: number;
  area: string;
  languages: string;
  traits: readonly string[];
  services: readonly OfferedService[];
  gallery: readonly ImageSourcePropType[];
  map: ImageSourcePropType;
  averageRating: number;
  totalReviews: number;
  breakdown: readonly RatingBreakdown[];
  reviews: readonly Review[];
  verification: readonly TrustItem[];
  terms: ReadonlyArray<{ label: string; detail: string }>;
}>;

const REVIEWER_A = require('../../assets/images/dashboard/image1_1174_145674.png');
const REVIEWER_B = require('../../assets/images/dashboard/image2_1174_145674.png');
const REVIEWER_C = require('../../assets/images/dashboard/image0_676_87466.png');

const GALLERY = [
  require('../../assets/images/artisan-profile/gallery-1.jpg'),
  require('../../assets/images/artisan-profile/gallery-2.jpg'),
];
const MAP = require('../../assets/images/artisan-profile/location-map.jpg');

/**
 * One rich profile stands in for every artisan until the API provides them,
 * with the headline and stats derived from the artisan being viewed.
 */
const SHARED_PROFILE = {
  bio: "I'm Tunde, and I've been serving homes in Abuja for over 10 years. From leaky taps to complete bathroom renovations, I focus on permanent fixes, not quick patch-ups. I guarantee all my work and prioritize leaving your space cleaner than I found it. Every job is quoted up front, so there are no surprises when the work is done.",
  area: 'Wuse 2, Abuja',
  languages: 'Speaks English, Yoruba',
  traits: ['Professional & reliable'],
  services: [
    { name: 'Tap & sink repair', priceLabel: 'From ₦15,000' },
    { name: 'Toilet installation & repair', priceLabel: 'Get a quote' },
    { name: 'Burst pipe emergency', priceLabel: 'Get a quote' },
    { name: 'Water heater installation', priceLabel: 'From ₦20,000' },
    { name: 'Full bathroom remodel', priceLabel: 'Get a quote' },
  ],
  gallery: GALLERY,
  map: MAP,
  averageRating: 3.8,
  breakdown: [
    { stars: 5, count: 68 },
    { stars: 4, count: 18 },
    { stars: 3, count: 9 },
    { stars: 2, count: 6 },
    { stars: 1, count: 1 },
  ],
  reviews: [
    {
      id: 'rv-a',
      author: 'Chinwe',
      area: 'Jabi',
      rating: 5,
      postedAgo: '2 days ago',
      body: 'The service was absolutely fantastic! He showed up right on schedule and handled every detail with incredible care and precision, ensuring everything was perfect.',
      avatar: REVIEWER_A,
    },
    {
      id: 'rv-b',
      author: 'Aisha',
      area: 'Kubwa',
      rating: 4,
      postedAgo: '3 days ago',
      body: 'Exceptional service! Showed up early and completed the job with great attention to detail. Highly recommend!',
      avatar: REVIEWER_B,
    },
    {
      id: 'rv-c',
      author: 'Emeka',
      area: 'Wuse',
      rating: 5,
      postedAgo: '1 days ago',
      body: 'I had an amazing experience! The team was professional, punctual, and very attentive to my needs throughout the process.',
      avatar: REVIEWER_C,
    },
  ],
  verification: [
    { title: 'Identity verified', detail: 'Government ID verified' },
    { title: 'Background checked', detail: 'Verified by Beta Work' },
    { title: 'Plumbing certification', detail: 'Certified professional' },
    {
      title: 'HSE certified',
      detail: 'Health, safety and environment training',
    },
  ],
  terms: [
    { label: 'Availability', detail: 'Mon – Sat, 8:00 AM – 6:00 PM' },
    { label: 'Payment', detail: 'Payment after service' },
    { label: 'Cancellation policy', detail: 'Cancel at least 2 hours before' },
    { label: 'Warranty', detail: '3-day repair warranty' },
  ],
} as const;

export function getArtisanProfile(artisan: Artisan): ArtisanProfile {
  return {
    ...SHARED_PROFILE,
    headline: `Master ${artisan.trade} & Pipefitter`,
    completedJobs: artisan.jobsCompleted,
    yearsExperience: 8,
    totalReviews: artisan.reviews,
  };
}

export function findArtisan(id: string): Artisan | undefined {
  return findCatalogueArtisan(id);
}
