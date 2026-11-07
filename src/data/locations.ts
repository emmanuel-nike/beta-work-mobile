/** Recent addresses are kept separately per app mode. */
export type AddressScope = 'client' | 'artisan';

export type SavedAddress = Readonly<{
  id: string;
  /** Full formatted address, e.g. "12 Allen Ave, Ikeja, Lagos, Nigeria". */
  address: string;
  /** Street-level line, e.g. "12 Allen Avenue". */
  line1: string;
  city: string;
  state: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
}>;

/** A chosen address before it is persisted (no id yet). */
export type AddressSelection = Omit<SavedAddress, 'id'>;

/** Header prompt shown before the user has picked a location. */
export const DEFAULT_LOCATION_LABEL = 'Set your location';

/** Compact "City, State" form used in the dashboard header. */
export function formatArea(
  address: Pick<SavedAddress, 'city' | 'state'>,
): string {
  return [address.city, address.state].filter(Boolean).join(', ');
}
