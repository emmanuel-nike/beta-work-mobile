import { API_BASE_URL as ENV_API_BASE_URL } from '@env'

const trimmed = (ENV_API_BASE_URL || 'https://api.beta-work.com/api/v1').replace(/\/$/, '')

export const API_BASE_URL = trimmed

/** Scheme + host of the API, e.g. "https://api.beta-work.com". */
export const API_ORIGIN = API_BASE_URL.match(/^https?:\/\/[^/]+/)?.[0] ?? API_BASE_URL

/**
 * Resolve a stored media path (e.g. "/api/v1/uploads/artisans/x.jpg") to an
 * absolute URL the <Image> component can load. Already-absolute urls and empty
 * values pass through unchanged.
 */
export function toAbsoluteMediaUrl(path?: string | null): string | null {
  if (!path) {
    return null
  }
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Inverse of {@link toAbsoluteMediaUrl}: strip the scheme + host so a media url
 * matches the relative form the API stores (e.g. "/api/v1/uploads/..."). Needed
 * when telling the server which already-hosted files to keep.
 */
export function toRelativeMediaPath(url: string): string {
  return url.replace(/^https?:\/\/[^/]+/i, '')
}
