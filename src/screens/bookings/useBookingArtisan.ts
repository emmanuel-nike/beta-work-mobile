import type { ImageSourcePropType } from 'react-native';

import { findArtisan, getArtisanProfile } from '../../data/artisanProfiles';
import { useAppSelector } from '../../store/hooks';
import { selectArtisanById } from '../../store/slices/artisansSlice';

export type BookingArtisan = Readonly<{
  id: string;
  name: string;
  headline: string;
  area: string;
  rating: number;
  reviews: number;
  image: ImageSourcePropType;
}>;

/**
 * Resolve the artisan being booked by id: a local catalogue entry, or one
 * fetched from the API and cached in the store (dashboard rail / All artisans).
 */
export function useBookingArtisan(id: string): BookingArtisan | null {
  const fetched = useAppSelector(state => selectArtisanById(state, id));
  const artisan = findArtisan(id) ?? fetched;
  if (!artisan) {
    return null;
  }

  const profile = getArtisanProfile(artisan);
  return {
    id,
    name: artisan.name,
    headline: profile.headline,
    area: profile.area,
    rating: artisan.rating,
    reviews: artisan.reviews,
    image: artisan.image,
  };
}
