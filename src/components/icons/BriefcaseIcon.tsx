import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { IconColorProps } from './types';

export function BriefcaseIcon({
  color = dashboardColors.tabBar,
}: IconColorProps) {
  return (
    <Svg fill="none" height={28} viewBox="0 0 28 28" width={28}>
      <Path
        d="M8.167 8.167V6.417C8.167 5.655 8.789 5.042 9.542 5.042H18.458C19.211 5.042 19.833 5.655 19.833 6.417V8.167M6.417 8.167H21.583C22.733 8.167 23.667 9.101 23.667 10.25V21.583C23.667 22.733 22.733 23.667 21.583 23.667H6.417C5.267 23.667 4.333 22.733 4.333 21.583V10.25C4.333 9.101 5.267 8.167 6.417 8.167Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
    </Svg>
  );
}
