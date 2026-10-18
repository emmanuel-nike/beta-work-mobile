import type {
  PortfolioForm,
  ServicePrice,
  WeeklySchedule,
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
      keepImages.push(uri);
    }
  });
  // Tell the server which already-hosted portfolio images to retain.
  body.append('keepPortfolioImages', JSON.stringify(keepImages));

  return apiRequest<ArtisanProfileResponse>('/artisan/portfolio', {
    method: 'PUT',
    formData: body,
  });
}
