import type { ImageSourcePropType } from 'react-native';

export type ArtisanJobStatus =
  | 'pending'
  | 'accepted'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export type JobFilter = 'all' | 'pending' | 'ongoing' | 'completed' | 'cancelled';

export type ArtisanJob = Readonly<{
  id: string;
  trade: string;
  clientName: string;
  avatar: ImageSourcePropType;
  distance: string;
  status: ArtisanJobStatus;
  dateTime: string;
  location: string;
  service: string;
  /** Contact details shown on the job detail screen. */
  client: {
    name: string;
    address: string;
    phone: string;
    landmark: string;
  };
  jobDescription: string;
  budget: string;
  messageToArtisan: string;
}>;

export const JOB_FILTERS: ReadonlyArray<{ id: JobFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const JOB_STATUS_LABELS: Record<ArtisanJobStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const JOB_STATUS_COLORS: Record<ArtisanJobStatus, string> = {
  pending: '#E8976D',
  accepted: '#168C56',
  ongoing: '#D77D36',
  completed: '#0F6743',
  cancelled: '#C44534',
};

/** Muted status tone used for the "Status:" line inside the request-details card. */
export const JOB_STATUS_TEXT_COLORS: Record<ArtisanJobStatus, string> = {
  pending: '#C99A2E',
  accepted: '#168C56',
  ongoing: '#D77D36',
  completed: '#0F6743',
  cancelled: '#C44534',
};

/** Soft chip fill used under "Status:" in the request-details card. */
export const JOB_STATUS_CHIP_COLORS: Record<ArtisanJobStatus, string> = {
  pending: '#FEF9C2',
  accepted: '#DCFCE7',
  ongoing: '#FEECDC',
  completed: '#DCFCE7',
  cancelled: '#FEE2E2',
};

export function filterJobs(
  jobs: readonly ArtisanJob[],
  filter: JobFilter,
): readonly ArtisanJob[] {
  if (filter === 'all') {
    return jobs;
  }
  if (filter === 'ongoing') {
    // Accepted jobs are in-progress, so they show under the Ongoing filter.
    return jobs.filter(
      item => item.status === 'ongoing' || item.status === 'accepted',
    );
  }
  return jobs.filter(item => item.status === filter);
}
