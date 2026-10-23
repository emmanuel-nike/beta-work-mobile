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
