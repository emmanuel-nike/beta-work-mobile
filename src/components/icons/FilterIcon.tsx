import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function FilterIcon({ color = '#0F6743', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <Path
        d="M2 4.5h12M2 8h12M2 11.5h12"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.3}
      />
      <Circle cx={5.5} cy={4.5} fill="#F7F1E6" r={1.7} stroke={color} strokeWidth={1.3} />
      <Circle cx={10.5} cy={11.5} fill="#F7F1E6" r={1.7} stroke={color} strokeWidth={1.3} />
    </Svg>
  );
}
