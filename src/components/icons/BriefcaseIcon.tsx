import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { SizedIconProps } from './types';

export function BriefcaseIcon({
  color = dashboardColors.tabBar,
  size = 28,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M13.3337 16.6667V3.33341C13.3337 2.89139 13.1581 2.46746 12.8455 2.1549C12.5329 1.84234 12.109 1.66675 11.667 1.66675H8.33366C7.89163 1.66675 7.46771 1.84234 7.15515 2.1549C6.84259 2.46746 6.66699 2.89139 6.66699 3.33341V16.6667"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16.667 5H3.33366C2.41318 5 1.66699 5.74619 1.66699 6.66667V15C1.66699 15.9205 2.41318 16.6667 3.33366 16.6667H16.667C17.5875 16.6667 18.3337 15.9205 18.3337 15V6.66667C18.3337 5.74619 17.5875 5 16.667 5Z"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
