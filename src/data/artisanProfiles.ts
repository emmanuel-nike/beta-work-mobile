import type { ImageSourcePropType } from 'react-native';

import { ARTISANS, type Artisan } from './artisans';

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

export type ArtisanProfile = Readonly<{
  headline: string;
  bio: string;
  completedJobs: number;
  yearsExperience: number;
  area: string;
  languages: string;
  skills: readonly string[];
  gallery: readonly ImageSourcePropType[];
  map: ImageSourcePropType;
  averageRating: number;
  totalReviews: number;
  breakdown: readonly RatingBreakdown[];
  reviews: readonly Review[];
  verification: readonly string[];
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
  skills: [
    'Tap & Sink Repair: (Quote Needed)',
    'Toilet Installation & Repair: (Quote Needed)',
    'Burst Pipe Emergency: (Quote Needed)',
    'Water Heater Installation: (Quote Needed)',
    'Full Bathroom Remodel: (Quote Needed)',
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
    'Background checked and verified by our team.',
    'Fully licensed & certified in plumbing',
    'Certified HSE officer',
    'Water Heater Installation: (Quote Needed)',
    'Full Bathroom Remodel: (Quote Needed)',
  ],
  terms: [
    {
      label: 'Service Guarantee',
      detail: 'I ensure all plumbing work is leak-tested before completion.',
    },
    { label: 'Availability', detail: 'I work Monday–Saturday, 8 AM–6 PM.' },
    { label: 'Payment Terms', detail: 'Payment upon completion of job.' },
    {
      label: 'Cancellations',
      detail: 'Please cancel at least 2 hours before scheduled time.',
    },
    {
      label: 'Safety Policy',
      detail: 'Certified in HSE Level 1 – Complies with site safety standards.',
    },
    { label: 'Warranty', detail: 'Repairs covered for 3 days after service.' },
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
  return ARTISANS.find(artisan => artisan.id === id);
}
