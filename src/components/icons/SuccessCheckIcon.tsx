import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function SuccessCheckIcon({
  color = '#0E774A',
  size = 64,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 64 64" width={size}>
      <Circle cx={32} cy={32} fill={color} fillOpacity={0.1} r={32} />
      <Circle cx={32} cy={32} fill={color} r={21} />
      <Path
        d="M23 32.5 29.5 39 41.5 26.5"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </Svg>
  );
}
