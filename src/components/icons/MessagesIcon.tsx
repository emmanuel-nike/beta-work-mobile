import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { IconColorProps } from './types';

export function MessagesIcon({ color = dashboardColors.white }: IconColorProps) {
  return (
    <Svg fill="none" height={22} viewBox="0 0 22 22" width={22}>
      <Path
        d="M18.333 10.083C18.333 14.234 14.692 17.417 10.083 17.417C9.075 17.417 8.104 17.256 7.208 16.963L3.667 18.333L5.037 14.792C4.327 13.552 3.917 12.113 3.917 10.583C3.917 6.432 7.558 3.25 12.167 3.25H13.75C16.649 3.25 18.333 6.432 18.333 10.083Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
