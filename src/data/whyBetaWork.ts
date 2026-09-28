import type { ImageSourcePropType } from 'react-native';

export type PromoSlide = Readonly<{
  id: string;
  headline: string;
  body: string;
  image: ImageSourcePropType;
}>;

export const WHY_BETA_WORK_SLIDES: readonly PromoSlide[] = [
  {
    id: 'real-people',
    headline: 'Every booking supports real people.',
    body: 'From tailors to technicians, your trust helps artisans grow their craft and earn with dignity.',
    image: require('../../assets/images/why-betawork/supports-real-people.jpg'),
  },
  {
    id: 'verified',
    headline: 'Only verified professionals, always.',
    body: 'Every artisan on Beta Work! is thoroughly verified, ensuring you can hire with confidence.',
    image: require('../../assets/images/why-betawork/verified-professionals.jpg'),
  },
  {
    id: 'minutes',
    headline: 'Find the right help in minutes.',
    body: 'From handmade craft to car repairs, get matched to the best artisan near you, stress-free.',
    image: require('../../assets/images/why-betawork/right-help-in-minutes.jpg'),
  },
];
