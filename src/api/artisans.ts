import type { ImageSourcePropType } from 'react-native';

import { toAbsoluteMediaUrl } from '../config/env';
import type { Artisan } from '../data/artisans';
import { apiRequest } from './client';

/** Shown until the artisan's photo loads (or when they have none). */
const FALLBACK_IMAGE: ImageSourcePropType = require('../../assets/images/dashboard/image1_1174_145674.png');

/** A verified artisan as returned by `GET /api/v1/artisans/nearby`. */
type ApiArtisan = Readonly<{
  id: number;
  trade: string;
  photoUrl: string | null;
  rating: number;
  reviewsCount: number;
  priceFrom: number | null;
  isAvailable: boolean;
  distanceKm: number;
  user?: Readonly<{ firstName: string; lastName: string }> | null;
}>;

export type ArtisanSort = 'top-rated' | 'nearest' | 'lowest-price';

/** Filters the artisan list can apply; all are sent to `GET /artisans/nearby`. */
export type NearbyArtisanFilters = Readonly<{
  limit?: number;
  /** Free-text search over name and trade. */
  q?: string;
  /** Reserved: the backend does not categorise artisans yet. */
  category?: string;
  sort?: ArtisanSort;
  minRating?: number;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  minPrice?: number;
  maxPrice?: number;
}>;

function buildQuery(filters: NearbyArtisanFilters): string {
  const params = new URLSearchParams();
  const put = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== null && `${value}`.length > 0) {
      params.set(key, String(value));
    }
  };

  put('limit', filters.limit);
  put('q', filters.q?.trim());
  if (filters.category && filters.category !== 'all') {
    put('category', filters.category);
  }
  put('sort', filters.sort);
  if (filters.minRating) {
    put('minRating', filters.minRating);
  }
  put('minDistanceKm', filters.minDistanceKm);
  put('maxDistanceKm', filters.maxDistanceKm);
  put('minPrice', filters.minPrice);
  put('maxPrice', filters.maxPrice);

  const query = params.toString();
  return query ? `?${query}` : '';
}

/**
 * Fetch verified artisans ranked by proximity for the "artisans near you"
 * surfaces. Distance is a placeholder from the backend until artisans capture
 * their coordinates. Pass filters to narrow / sort the list server-side.
 */
export async function fetchNearbyArtisans(
  filters: NearbyArtisanFilters = {},
): Promise<Artisan[]> {
  const { data } = await apiRequest<{ data: ApiArtisan[] }>(
    `/artisans/nearby${buildQuery(filters)}`,
    { method: 'GET' },
  );
  return data.map(toArtisan);
}

type ApiServicePrice = Readonly<{
  service: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}>;

type ApiDaySchedule = Readonly<{
  enabled: boolean;
  start?: string;
  end?: string;
}>;

/** A public artisan profile as returned by `GET /api/v1/artisans/:id`. */
type ApiArtisanDetail = Readonly<{
  id: number;
  businessName: string | null;
  trade: string;
  bio: string | null;
  yearsOfExperience: number;
  city: string | null;
  state: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number | null;
  rating: number;
  reviewsCount: number;
  priceFrom: number | null;
  priceTo: number | null;
  isAvailable: boolean;
  photoUrl: string | null;
  hasCertificate: boolean;
  additionalServices: string[] | null;
  languages: string[] | null;
  portfolioImages: string[] | null;
  servicePricing: ApiServicePrice[] | null;
  minimumLeadTimeHours: number | null;
  weeklySchedule: Readonly<Record<string, ApiDaySchedule>> | null;
  distanceKm: number;
  user?: Readonly<{ firstName: string; lastName: string }> | null;
}>;

export type ArtisanDetail = Readonly<{
  id: string;
  name: string;
  trade: string;
  headline: string;
  image: ImageSourcePropType;
  bio: string;
  yearsExperience: number;
  priceFrom: number | null;
  priceTo: number | null;
  distanceKm: number | null;
  rating: number;
  reviews: number;
  area: string;
  languages: string | null;
  skills: readonly string[];
  services: ReadonlyArray<{ name: string; priceLabel: string }>;
  gallery: readonly ImageSourcePropType[];
  latitude: number | null;
  longitude: number | null;
  isAvailable: boolean;
  verification: ReadonlyArray<{ title: string; detail: string }>;
  terms: ReadonlyArray<{ label: string; detail: string }>;
}>;

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** Fetch one approved artisan for the profile screen. */
export async function fetchArtisanDetail(id: string): Promise<ArtisanDetail> {
  const { artisanProfile } = await apiRequest<{ artisanProfile: ApiArtisanDetail }>(
    `/artisans/${encodeURIComponent(id)}`,
    { method: 'GET' },
  );
  return toArtisanDetail(artisanProfile);
}

/** List-card shape derived from a full profile, so booking can resolve the same id. */
export function artisanFromDetail(detail: ArtisanDetail): Artisan {
  return {
    id: detail.id,
    name: detail.name,
    trade: detail.trade,
    category: 'home',
    image: detail.image,
    rating: detail.rating,
    reviews: detail.reviews,
    distanceKm: detail.distanceKm ?? 0,
    priceFrom: detail.priceFrom ?? 0,
    jobsCompleted: 0,
    availableToday: detail.isAvailable,
  };
}

function toArtisanDetail(api: ApiArtisanDetail): ArtisanDetail {
  const name = api.user
    ? `${api.user.firstName} ${api.user.lastName}`.trim()
    : 'Artisan';
  const photo = toAbsoluteMediaUrl(api.photoUrl);
  const area = [api.address, api.city, api.state].filter(Boolean).join(', ');

  return {
    id: String(api.id),
    name: name || 'Artisan',
    trade: api.trade,
    headline: api.businessName?.trim() || api.trade,
    image: photo ? { uri: photo } : FALLBACK_IMAGE,
    bio: api.bio?.trim() ?? '',
    yearsExperience: api.yearsOfExperience ?? 0,
    priceFrom: api.priceFrom,
    priceTo: api.priceTo,
    distanceKm: api.distanceKm ?? null,
    rating: api.rating ?? 0,
    reviews: api.reviewsCount ?? 0,
    area: area || 'Location not listed',
    languages: api.languages?.length ? `Speaks ${api.languages.join(', ')}` : null,
    skills: skillsFrom(api.servicePricing, api.additionalServices),
    services: servicesFrom(api.servicePricing, api.additionalServices),
    gallery: (api.portfolioImages ?? [])
      .map(toAbsoluteMediaUrl)
      .filter((url): url is string => Boolean(url))
      .map(uri => ({ uri })),
    latitude: api.latitude,
    longitude: api.longitude,
    isAvailable: api.isAvailable,
    verification: verificationFrom(api.hasCertificate),
    terms: termsFrom(api),
  };
}

function skillsFrom(
  pricing: readonly ApiServicePrice[] | null,
  additional: readonly string[] | null,
): string[] {
  const priced = (pricing ?? [])
    .filter(row => row.service?.trim())
    .map(row => {
      const min = finitePrice(row.minPrice);
      const max = finitePrice(row.maxPrice);
      if (min != null && max != null && max !== min) {
        return `${row.service}: ${formatNaira(min)} – ${formatNaira(max)}`;
      }
      if (min != null) {
        return `${row.service}: from ${formatNaira(min)}`;
      }
      if (max != null) {
        return `${row.service}: up to ${formatNaira(max)}`;
      }
      return `${row.service}: Quote needed`;
    });
  const extras = (additional ?? []).map(item => item.trim()).filter(Boolean);
  return [...priced, ...extras];
}

function servicesFrom(
  pricing: readonly ApiServicePrice[] | null,
  additional: readonly string[] | null,
): Array<{ name: string; priceLabel: string }> {
  const priced = (pricing ?? [])
    .filter(row => row.service?.trim())
    .map(row => {
      const min = finitePrice(row.minPrice);
      return {
        name: row.service.trim(),
        priceLabel: min != null ? `From ${formatNaira(min)}` : 'Get a quote',
      };
    });
  const extras = (additional ?? [])
    .map(item => item.trim())
    .filter(Boolean)
    .map(name => ({ name, priceLabel: 'Get a quote' }));
  return [...priced, ...extras];
}

function verificationFrom(
  hasCertificate: boolean,
): Array<{ title: string; detail: string }> {
  const items = [
    { title: 'Identity verified', detail: 'Government ID verified' },
    { title: 'Background checked', detail: 'Verified by Beta Work' },
  ];
  if (hasCertificate) {
    items.push({
      title: 'Professional certification',
      detail: 'Certified professional',
    });
  }
  return items;
}

function termsFrom(api: ApiArtisanDetail): Array<{ label: string; detail: string }> {
  const terms: Array<{ label: string; detail: string }> = [];
  const availability = formatSchedule(api.weeklySchedule);
  if (availability) {
    terms.push({ label: 'Availability', detail: availability });
  }
  if (api.minimumLeadTimeHours != null && api.minimumLeadTimeHours > 0) {
    const hours = api.minimumLeadTimeHours;
    terms.push({
      label: 'Lead time',
      detail: `Book at least ${hours} hour${hours === 1 ? '' : 's'} ahead.`,
    });
  }
  if (api.serviceRadiusKm != null && api.serviceRadiusKm > 0) {
    const place = api.city?.trim();
    terms.push({
      label: 'Service area',
      detail: place
        ? `Serves up to ${api.serviceRadiusKm} km from ${place}.`
        : `Serves up to ${api.serviceRadiusKm} km.`,
    });
  }
  if (!api.isAvailable) {
    terms.push({ label: 'Status', detail: 'Not taking new jobs right now.' });
  }
  return terms;
}

function formatSchedule(
  schedule: Readonly<Record<string, ApiDaySchedule>> | null,
): string | null {
  if (!schedule) {
    return null;
  }

  const lines: string[] = [];
  let start: string | null = null;
  let end: string | null = null;
  let hours: string | null = null;

  const flush = () => {
    if (!start || !hours) {
      return;
    }
    const days = start === end ? start : `${start} - ${end}`;
    lines.push(`${days} ${hours}`);
    start = null;
    end = null;
    hours = null;
  };

  for (const day of WEEKDAYS) {
    const slot = schedule[day];
    if (!slot?.enabled) {
      flush();
      continue;
    }
    const dayHours =
      slot.start && slot.end
        ? `${formatClock(slot.start)}–${formatClock(slot.end)}`
        : 'hours not set';
    if (hours === dayHours && start) {
      end = day;
      continue;
    }
    flush();
    start = day;
    end = day;
    hours = dayHours;
  }
  flush();

  return lines.length > 0 ? lines.join('; ') : null;
}

function formatClock(value: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(value.trim());
  if (!match) {
    return value;
  }
  const hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${suffix}`;
}

function finitePrice(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function toArtisan(api: ApiArtisan): Artisan {
  const name = api.user
    ? `${api.user.firstName} ${api.user.lastName}`.trim()
    : 'Artisan';
  const photo = toAbsoluteMediaUrl(api.photoUrl);

  return {
    id: String(api.id),
    name,
    trade: api.trade,
    // The API does not categorise artisans; the rail does not filter by it.
    category: 'home',
    image: photo ? { uri: photo } : FALLBACK_IMAGE,
    rating: api.rating ?? 0,
    reviews: api.reviewsCount ?? 0,
    distanceKm: api.distanceKm,
    priceFrom: api.priceFrom ?? 0,
    jobsCompleted: 0,
    availableToday: api.isAvailable,
  };
}
