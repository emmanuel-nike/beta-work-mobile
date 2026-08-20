import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { IconColorProps } from './types';

export function ProfileIcon({ color = dashboardColors.white }: IconColorProps) {
  return (
    <Svg fill="none" height={22} viewBox="0 0 22 22" width={22}>
      <Path
        d="M11 11C13.024 11 14.667 9.357 14.667 7.333C14.667 5.31 13.024 3.667 11 3.667C8.976 3.667 7.333 5.31 7.333 7.333C7.333 9.357 8.976 11 11 11Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M4.812 18.333C5.655 15.674 8.094 13.75 11 13.75C13.906 13.75 16.345 15.674 17.188 18.333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
