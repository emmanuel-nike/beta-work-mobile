import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function PlusCircleIcon({ color = '#4A3A2C', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Circle cx={10} cy={10} r={8.25} stroke={color} strokeWidth={1.4} />
      <Path
        d="M10 6.75v6.5M6.75 10h6.5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
