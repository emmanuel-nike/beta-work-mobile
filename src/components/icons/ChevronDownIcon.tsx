import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { SizedIconProps } from './types';

export function ChevronDownIcon({
  color = dashboardColors.white,
  size = 16,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <Path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
