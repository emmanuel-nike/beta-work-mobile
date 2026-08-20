import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { IconColorProps } from './types';

export function HomeIcon({ color = dashboardColors.white }: IconColorProps) {
  return (
    <Svg fill="none" height={22} viewBox="0 0 22 22" width={22}>
      <Path
        d="M3.667 8.25L11 2.75L18.333 8.25V17.417C18.333 17.819 18.174 18.205 17.892 18.487C17.611 18.768 17.225 18.927 16.823 18.927H5.177C4.775 18.927 4.389 18.768 4.108 18.487C3.826 18.205 3.667 17.819 3.667 17.417V8.25Z"
        fill={color}
      />
    </Svg>
  );
}
