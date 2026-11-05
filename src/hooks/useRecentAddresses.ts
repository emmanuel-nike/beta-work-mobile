import { useEffect, useState } from 'react';

import { fetchRecentAddresses } from '../api/addresses';
import type { SavedAddress } from '../data/locations';

/**
 * Loads the user's recent addresses from the API while `active` (e.g. a modal
 * is open). Starts empty and loads on activation; a reload is triggered each
 * time `active` flips to true.
 */
export function useRecentAddresses(active: boolean): readonly SavedAddress[] {
  const [addresses, setAddresses] = useState<readonly SavedAddress[]>([]);

  useEffect(() => {
    if (!active) {
      return;
    }
    let cancelled = false;
    fetchRecentAddresses()
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
  }, [active]);

  return addresses;
}
