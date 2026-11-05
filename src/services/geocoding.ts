import { apiRequest } from '../api/client';
import { getCurrentLocation } from './location';

export type AddressPrediction = Readonly<{
  placeId: string;
  description: string;
}>;

export type ResolvedPlace = Readonly<{
  address: string;
  latitude: number;
  longitude: number;
}>;

/** Address suggestions for a partial query (proxied to Google via our API). */
export async function autocompleteAddress(
  query: string,
  sessionToken?: string,
): Promise<AddressPrediction[]> {
  const params = new URLSearchParams({ q: query });
  if (sessionToken) {
    params.set('sessionToken', sessionToken);
  }
  const { data } = await apiRequest<{ data: AddressPrediction[] }>(
    `/geocoding/autocomplete?${params.toString()}`,
    { method: 'GET' },
  );
  return data;
}

/** Resolve a selected suggestion to a formatted address + coordinates. */
export async function resolvePlace(
  placeId: string,
  sessionToken?: string,
): Promise<ResolvedPlace> {
  const query = sessionToken
    ? `?${new URLSearchParams({ sessionToken }).toString()}`
    : '';
  const { data } = await apiRequest<{ data: ResolvedPlace }>(
    `/geocoding/place/${encodeURIComponent(placeId)}${query}`,
    { method: 'GET' },
  );
  return data;
}

/** Reverse geocode coordinates to a formatted address (empty when unmatched). */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ResolvedPlace> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
  });
  const { data } = await apiRequest<{ data: ResolvedPlace }>(
    `/geocoding/reverse?${params.toString()}`,
    { method: 'GET' },
  );
  return data;
}

/**
 * Read the device's current GPS position and resolve it to an address. The
 * address is best-effort — coordinates are always returned, `address` is ''
 * when reverse geocoding is unavailable. Throws only if GPS/permission fails.
 */
export async function captureCurrentLocation(): Promise<ResolvedPlace> {
  const coords = await getCurrentLocation();
  try {
    const place = await reverseGeocode(coords.latitude, coords.longitude);
    return { ...place, latitude: coords.latitude, longitude: coords.longitude };
  } catch {
    return { address: '', latitude: coords.latitude, longitude: coords.longitude };
  }
}

/** An opaque token grouping one autocomplete session for Google billing. */
export function newSessionToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
