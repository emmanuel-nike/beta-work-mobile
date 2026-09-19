import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function PlusIcon({ color = '#0F6743', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <Path
        d="M8 3.333v9.334M3.333 8h9.334"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
