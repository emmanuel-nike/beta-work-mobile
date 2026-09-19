import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

/** Shown in place of a profile photo until the user picks one. */
export function AvatarPlaceholderIcon({
  color = '#8B6B4D',
  size = 44,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 48 48" width={size}>
      <Circle cx={24} cy={16} r={8} stroke={color} strokeWidth={2.4} />
      <Path
        d="M9 41.5c0-6.9 6.7-12.5 15-12.5s15 5.6 15 12.5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2.4}
      />
    </Svg>
  );
}
