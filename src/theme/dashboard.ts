export const dashboardColors = {
  headerGreen: '#0B4D32',
  headerGreenOverlay: 'rgba(11, 77, 50, 0.97)',
  tabBar: '#0F6743',
  surface: '#F5EDE2',
  artisanSurface: '#E0D1BC',
  card: '#F5EDE2',
  cardMuted: '#D8C7AD',
  category: '#DAD3C7',
  accent: '#E57D1F',
  accentGold: '#E5A11F',
  headerOverlay: 'rgba(216, 199, 173, 0.14)',
  headerBorder: 'rgba(255, 255, 255, 0.7)',
  headerSubtitle: 'rgba(255, 255, 255, 0.75)',
  tabInactive: '#DAD3C7',
  progressTrack: '#FAF4EC',
  progressFill: '#118C57',
  promo: '#E4CDAB',
  white: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textPrimary: '#3A281A',
  textSecondary: '#5D4D42',
  textLabel: '#5C3D27',
  textHelper: '#695139',
  star: '#E9775C',
} as const;

export function getTimeGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}
