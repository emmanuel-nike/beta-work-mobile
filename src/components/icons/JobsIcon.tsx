import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { IconColorProps } from './types';

export function JobsIcon({ color = dashboardColors.white }: IconColorProps) {
  return (
    <Svg fill="none" height={22} viewBox="0 0 22 22" width={22}>
      <Path
        d="M7.333 6.417V5.042C7.333 4.64 7.492 4.254 7.773 3.973C8.055 3.691 8.441 3.533 8.843 3.533H13.157C13.559 3.533 13.945 3.691 14.227 3.973C14.508 4.254 14.667 4.64 14.667 5.042V6.417M5.958 6.417H16.042C16.866 6.417 17.535 7.086 17.535 7.91V16.76C17.535 17.584 16.866 18.253 16.042 18.253H5.958C5.134 18.253 4.465 17.584 4.465 16.76V7.91C4.465 7.086 5.134 6.417 5.958 6.417Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
