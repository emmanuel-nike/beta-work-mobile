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

/**
 * Fetch verified artisans ranked by proximity for the "artisans near you" rail.
 * Distance is a placeholder from the backend until artisans capture their
 * coordinates.
 */
export async function fetchNearbyArtisans(limit = 10): Promise<Artisan[]> {
  const { data } = await apiRequest<{ data: ApiArtisan[] }>(
    `/artisans/nearby?limit=${limit}`,
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
