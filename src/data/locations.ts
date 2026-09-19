export type SavedAddress = Readonly<{
  id: string;
  /** The address line shown in full. */
  address: string;
  /** Area or landmark shown underneath. */
  area: string;
  /** Compact form used in the dashboard header. */
  label: string;
}>;

export const RECENT_ADDRESSES: readonly SavedAddress[] = [
  {
    id: 'addr-1',
    address: '123 Maple Street, near the Abuja National Mosque,',
    area: 'National Mosque Federal Capital',
    label: 'Maple Street, Abuja',
  },
  {
    id: 'addr-2',
    address: '456 Elm Avenue, opposite the Unity Fountain,',
    area: 'Unity Fountain District, Abuja',
    label: 'Unity Fountain, Abuja',
  },
  {
    id: 'addr-3',
    address: '789 Pine Road, adjacent to Jabi Lake Mall,',
    area: 'Jabi Lake Area, Abuja',
    label: 'Jabi Lake, Abuja',
  },
];

export const DEFAULT_LOCATION_LABEL = 'Maitaima, Abuja';
