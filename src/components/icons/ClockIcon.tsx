import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function ClockIcon({ color = '#A38D75', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Path
        d="M12 7.5V12l3 2"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
