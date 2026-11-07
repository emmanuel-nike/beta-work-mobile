import { useEffect, useState } from 'react';

import { fetchRecentAddresses } from '../api/addresses';
import type { AddressScope, SavedAddress } from '../data/locations';

/**
 * Loads the user's recent addresses for a mode while `active` (e.g. a modal is
 * open). Starts empty and loads on activation; reloads when `active` flips to
 * true or the scope changes.
 */
export function useRecentAddresses(
  active: boolean,
  scope: AddressScope,
): readonly SavedAddress[] {
  const [addresses, setAddresses] = useState<readonly SavedAddress[]>([]);

  useEffect(() => {
    if (!active) {
      return;
    }
    let cancelled = false;
    fetchRecentAddresses(scope)
      .then(list => {
        if (!cancelled) {
          setAddresses(list);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAddresses([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [active, scope]);

  return addresses;
}
