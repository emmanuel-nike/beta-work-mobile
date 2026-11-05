import type { AddressSelection, SavedAddress } from '../data/locations';
import { apiRequest } from './client';

type ApiSavedAddress = Readonly<{
  id: number;
  address: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
}>;

function toSavedAddress(api: ApiSavedAddress): SavedAddress {
  return { ...api, id: String(api.id) };
}

/** The authenticated user's recent addresses, newest first (max 10). */
export async function fetchRecentAddresses(): Promise<SavedAddress[]> {
  const { data } = await apiRequest<{ data: ApiSavedAddress[] }>('/addresses', {
    method: 'GET',
  });
  return data.map(toSavedAddress);
}

/** Save a selected address; returns the updated recent list. */
export async function saveAddress(
  input: AddressSelection,
): Promise<SavedAddress[]> {
  const { data } = await apiRequest<{ data: ApiSavedAddress[] }>('/addresses', {
    method: 'POST',
    body: input,
  });
  return data.map(toSavedAddress);
}
