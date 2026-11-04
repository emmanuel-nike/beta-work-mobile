import { useEffect } from 'react';
import type { ImageSourcePropType } from 'react-native';

import { findArtisan, getArtisanProfile } from '../../data/artisanProfiles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadArtisanDetail,
  selectArtisanById,
  selectArtisanDetail,
} from '../../store/slices/artisansSlice';

export type BookingArtisan = Readonly<{
  id: string;
  name: string;
  headline: string;
  area: string;
  rating: number;
  reviews: number;
  image: ImageSourcePropType;
  /** Names of the services this artisan offers, for the booking picker. */
  services: readonly string[];
}>;

/**
 * Resolve the artisan being booked by id: a local catalogue entry, or one
 * fetched from the API and cached in the store (dashboard rail / All artisans).
 */
export function useBookingArtisan(id: string): BookingArtisan | null {
  const dispatch = useAppDispatch();
  const isRemote = /^\d+$/.test(id);
  const detail = useAppSelector(state => selectArtisanDetail(state, id));
  const fetched = useAppSelector(state => selectArtisanById(state, id));

  useEffect(() => {
    if (isRemote && !detail) {
      dispatch(loadArtisanDetail(id));
    }
  }, [detail, dispatch, id, isRemote]);

  if (detail) {
    return {
      id,
      name: detail.name,
      headline: detail.headline,
      area: detail.area,
      rating: detail.rating,
      reviews: detail.reviews,
      image: detail.image,
      services: detail.services.map(service => service.name),
    };
  }

  if (isRemote) {
    if (!fetched) {
      return null;
    }
    return {
      id,
      name: fetched.name,
      headline: fetched.trade,
      area: '',
      rating: fetched.rating,
      reviews: fetched.reviews,
      image: fetched.image,
      // Full services arrive with the detail fetch; fall back to the trade.
      services: fetched.trade ? [fetched.trade] : [],
    };
  }

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
    services: profile.services.map(service => service.name),
  };
}
