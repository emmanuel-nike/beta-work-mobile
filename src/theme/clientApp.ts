/**
 * Palette shared by the client-facing tabs (bookings, messaging). These screens
 * sit on the darker `E0D1BC` surface rather than the `F5EDE2` used by onboarding
 * and the dashboard, so they keep their own tokens.
 */
export const appColors = {
  surface: '#E0D1BC',
  header: '#084C30',
  headerButton: 'rgba(216, 199, 173, 0.14)',
  primary: '#0F6743',
  card: 'rgba(232, 223, 210, 0.1)',
  cardBorder: '#CBBBA1',
  divider: '#D8C7AD',
  chipInactive: '#D8C7AD',
  disabled: '#BEB19B',
  danger: '#C44534',
  field: '#F5EDE2',
  textPrimary: '#3A281A',
  textLabel: '#5C3D27',
  textBody: '#411F0C',
  textMuted: '#8B6B4D',
  textFaint: '#A38D75',
  placeholder: '#9E8A72',
  star: '#E9775C',
  white: '#FFFFFF',
} as const;
