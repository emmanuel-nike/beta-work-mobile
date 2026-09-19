import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function EmojiIcon({ color = '#4A3A2C', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Circle cx={10} cy={10} r={8.25} stroke={color} strokeWidth={1.4} />
      <Path
        d="M6.9 11.8a3.7 3.7 0 0 0 6.2 0"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.4}
      />
      <Circle cx={7.4} cy={8} fill={color} r={1} />
      <Circle cx={12.6} cy={8} fill={color} r={1} />
    </Svg>
  );
}
