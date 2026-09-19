import Svg, { Path } from 'react-native-svg';

import type { IconColorProps } from './types';

export function ArrowLeftIcon({ color = '#FFFFFF' }: IconColorProps) {
  return (
    <Svg fill="none" height={18} viewBox="0 0 18 18" width={18}>
      <Path
        d="M7.1775 4.4475L2.625 9L7.1775 13.5525"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth={2}
      />
      <Path
        d="M15.375 9H2.7525"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth={2}
      />
    </Svg>
  );
}
