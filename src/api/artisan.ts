import { toAbsoluteMediaUrl, toRelativeMediaPath } from '../config/env';
import {
  WEEKDAYS,
  createDefaultPortfolioForm,
  createServiceRow,
  type PortfolioForm,
  type ServicePrice,
  type WeeklySchedule,
} from '../data/artisanPortfolio';
import { apiRequest } from './client';

export type ServicePricePayload = Readonly<{
  service: string;
  minPrice: number | null;
  maxPrice: number | null;
}>;

export type ArtisanProfileData = Readonly<{
  id: number;
  trade: string;
  bio: string | null;
  yearsOfExperience: number;
  isAvailable: boolean;
  photoUrl: string | null;
  certificateUrl: string | null;
  additionalServices: string[] | null;
  languages: string[] | null;
  portfolioImages: string[] | null;
  servicePricing: ServicePricePayload[] | null;
  minimumLeadTimeHours: number | null;
  weeklySchedule: WeeklySchedule | null;
  verificationStatus: string;
}>;

export type ArtisanProfileResponse = Readonly<{
  artisanProfile: ArtisanProfileData;
}>;

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

function fileFromUri(uri: string, field: string) {
  const extension = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const type = IMAGE_MIME_BY_EXT[extension] ?? 'image/jpeg';
  const name = `${field}.${extension in IMAGE_MIME_BY_EXT ? extension : 'jpg'}`;
  // React Native's FormData accepts this { uri, name, type } shape for files.
  return { uri, name, type } as unknown as Blob;
}

/** A local uri (file://, content://, ph://) still needs uploading. */
function isLocalUri(uri: string): boolean {
  return !/^https?:\/\//i.test(uri);
}

function toNumberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function toServicePricing(rows: readonly ServicePrice[]): ServicePricePayload[] {
  return rows
    .filter(row => row.service.trim().length > 0)
    .map(row => ({
      service: row.service.trim(),
      minPrice: toNumberOrNull(row.minPrice),
      maxPrice: toNumberOrNull(row.maxPrice),
    }));
}

/**
 * Build the multipart payload for the portfolio update and send it. Local image
 * uris are uploaded as files; remote (already-hosted) ones are passed back by
 * url so re-submitting an existing portfolio keeps them.
 */
export async function updateArtisanPortfolio(form: PortfolioForm) {
  const body = new FormData();

  body.append('trade', form.primarySkill.trim());
  body.append('yearsOfExperience', String(toNumberOrNull(form.yearsOfExperience) ?? 0));
  body.append('bio', form.bio.trim());
  body.append('isAvailable', form.isAvailable ? 'true' : 'false');

  const leadTime = toNumberOrNull(form.minimumLeadTimeHours);
  if (leadTime !== null) {
    body.append('minimumLeadTimeHours', String(leadTime));
  }

  body.append('additionalServices', JSON.stringify(form.otherServices));
  body.append('languages', JSON.stringify(form.languages));
  body.append('servicePricing', JSON.stringify(toServicePricing(form.servicePricing)));
  body.append('weeklySchedule', JSON.stringify(form.weeklySchedule));

  if (form.photoUri && isLocalUri(form.photoUri)) {
    body.append('photo', fileFromUri(form.photoUri, 'photo'));
  }

  if (form.certificateUri && isLocalUri(form.certificateUri)) {
    body.append('certificate', fileFromUri(form.certificateUri, 'certificate'));
  }

  const keepImages: string[] = [];
  form.portfolioImages.forEach((uri, index) => {
    if (isLocalUri(uri)) {
      body.append('portfolioImages', fileFromUri(uri, `portfolio-${index}`));
    } else {
      // Send the stored (relative) path so it matches what the server kept,
      // otherwise it would treat the originals as removed and delete them.
      keepImages.push(toRelativeMediaPath(uri));
    }
  });
  // Tell the server which already-hosted portfolio images to retain.
  body.append('keepPortfolioImages', JSON.stringify(keepImages));

  return apiRequest<ArtisanProfileResponse>('/artisan/portfolio', {
    method: 'PUT',
    formData: body,
  });
}

/** Fetch the authenticated artisan's saved profile, or null if none exists. */
export async function fetchArtisanProfile(): Promise<ArtisanProfileData | null> {
  const { artisanProfile } = await apiRequest<ArtisanProfileResponse>(
    '/artisan/profile',
    { method: 'GET' },
  );
  return artisanProfile ?? null;
}

/**
 * Map a saved profile onto the wizard's form shape so "Update your portfolio"
 * opens pre-filled. Stored media paths become absolute urls, which the submit
 * flow treats as already-hosted (kept, not re-uploaded).
 */
export function portfolioFormFromProfile(
  profile: ArtisanProfileData,
): PortfolioForm {
  const base = createDefaultPortfolioForm();

  const servicePricing: ServicePrice[] =
    profile.servicePricing && profile.servicePricing.length > 0
      ? profile.servicePricing.map(row => ({
          ...createServiceRow(),
          service: row.service ?? '',
          minPrice: row.minPrice != null ? String(row.minPrice) : '',
          maxPrice: row.maxPrice != null ? String(row.maxPrice) : '',
        }))
      : base.servicePricing;

  // Merge saved days onto the default week so every weekday stays present.
  const weeklySchedule = { ...base.weeklySchedule };
  if (profile.weeklySchedule) {
    for (const day of WEEKDAYS) {
      const saved = profile.weeklySchedule[day];
      if (saved) {
        weeklySchedule[day] = {
          enabled: Boolean(saved.enabled),
          start: saved.start ?? '',
          end: saved.end ?? '',
        };
      }
    }
  }

  return {
    ...base,
    photoUri: toAbsoluteMediaUrl(profile.photoUrl),
    primarySkill: profile.trade ?? '',
    otherServices: profile.additionalServices ?? [],
    yearsOfExperience:
      profile.yearsOfExperience != null ? String(profile.yearsOfExperience) : '',
    certificateUri: toAbsoluteMediaUrl(profile.certificateUrl),
    bio: profile.bio ?? '',
    languages: profile.languages ?? [],
    portfolioImages: (profile.portfolioImages ?? [])
      .map(url => toAbsoluteMediaUrl(url))
      .filter((url): url is string => Boolean(url)),
    servicePricing,
    isAvailable: profile.isAvailable ?? true,
    minimumLeadTimeHours:
      profile.minimumLeadTimeHours != null
        ? String(profile.minimumLeadTimeHours)
        : '',
    weeklySchedule,
  };
}
