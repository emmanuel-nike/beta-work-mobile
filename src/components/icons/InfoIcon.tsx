import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function InfoIcon({ color = '#0F6743', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Circle cx={10} cy={10} fill={color} r={8.25} />
      <Path
        d="M10 6.25v.417M10 9.167v4.583"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth={1.75}
      />
    </Svg>
  );
}
