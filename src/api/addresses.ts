import type {
  AddressScope,
  AddressSelection,
  SavedAddress,
} from '../data/locations';
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

/** The user's recent addresses for a mode, newest first (max 10). */
export async function fetchRecentAddresses(
  scope: AddressScope,
): Promise<SavedAddress[]> {
  const query = new URLSearchParams({ scope }).toString();
  const { data } = await apiRequest<{ data: ApiSavedAddress[] }>(
    `/addresses?${query}`,
    { method: 'GET' },
  );
  return data.map(toSavedAddress);
}

/** Save a selected address within a mode; returns the updated recent list. */
export async function saveAddress(
  input: AddressSelection,
  scope: AddressScope,
): Promise<SavedAddress[]> {
  const { data } = await apiRequest<{ data: ApiSavedAddress[] }>('/addresses', {
    method: 'POST',
    body: { ...input, scope },
  });
  return data.map(toSavedAddress);
}
