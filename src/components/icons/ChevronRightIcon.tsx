import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function ChevronRightIcon({
  color = '#8B6B4D',
  size = 18,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 18 18" width={size}>
      <Path
        d="M6.75 3.75 12 9l-5.25 5.25"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
