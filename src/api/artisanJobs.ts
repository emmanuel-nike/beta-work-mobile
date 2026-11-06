import type { ImageSourcePropType } from 'react-native'

import { toAbsoluteMediaUrl } from '../config/env'
import type { ArtisanJob, ArtisanJobStatus } from '../data/artisanJobs'
import { apiRequest } from './client'

const FALLBACK_AVATAR: ImageSourcePropType = require('../../assets/images/dashboard/image0_1174_145674.png')

const JOB_STATUSES: readonly ArtisanJobStatus[] = [
  'pending',
  'accepted',
  'ongoing',
  'completed',
  'cancelled',
]

/** One job as returned by `GET /api/v1/artisan/jobs`. */
type ApiArtisanJob = Readonly<{
  id: number
  status: string
  trade: string
  service: string
  jobDescription: string | null
  budget: number | null
  messageToArtisan: string | null
  scheduledAt: string | null
  location: string | null
  address: string | null
  distanceKm: number
  client: Readonly<{
    id: number
    name: string | null
    phone: string | null
    address: string | null
    photoUrl?: string | null
  }>
}>

/** Fetch bookings assigned to the authenticated artisan. */
export async function fetchMyJobs(): Promise<ArtisanJob[]> {
  const { data } = await apiRequest<{ data: ApiArtisanJob[] }>('/artisan/jobs', {
    method: 'GET',
  })
  return data.map(toArtisanJob)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDateTime(iso: string | null): string {
  if (!iso) {
    return ''
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  const hours24 = date.getHours()
  const meridiem = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${MONTHS[date.getMonth()]} ${date.getDate()} • ${hours12}:${minutes} ${meridiem}`
}

function formatBudget(amount: number | null): string {
  if (amount === null || amount === undefined) {
    return ''
  }
  return `₦${amount.toLocaleString('en-NG')}`
}

function toStatus(status: string): ArtisanJobStatus {
  return JOB_STATUSES.includes(status as ArtisanJobStatus)
    ? (status as ArtisanJobStatus)
    : 'pending'
}

function toArtisanJob(api: ApiArtisanJob): ArtisanJob {
  const photo = toAbsoluteMediaUrl(api.client.photoUrl ?? null)
  const name = api.client.name ?? 'Client'

  return {
    id: String(api.id),
    trade: api.trade,
    clientName: name,
    avatar: photo ? { uri: photo } : FALLBACK_AVATAR,
    distance: `${api.distanceKm} km away`,
    status: toStatus(api.status),
    dateTime: formatDateTime(api.scheduledAt),
    location: api.location ?? api.address ?? '',
    service: api.service,
    client: {
      name,
      address: api.client.address ?? api.address ?? '',
      phone: api.client.phone ?? '',
      landmark: '',
    },
    jobDescription: api.jobDescription ?? '',
    budget: formatBudget(api.budget),
    messageToArtisan: api.messageToArtisan ?? '',
  }
}
