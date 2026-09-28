import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function PhoneCallIcon({ color = '#9C7E61', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M18.3 15.27v1.53a1.5 1.5 0 0 1-1.64 1.5 14.85 14.85 0 0 1-6.47-2.3 14.6 14.6 0 0 1-4.5-4.5A14.85 14.85 0 0 1 3.4 5a1.5 1.5 0 0 1 1.49-1.64h1.53a1.5 1.5 0 0 1 1.5 1.29c.1.72.27 1.43.52 2.1a1.5 1.5 0 0 1-.34 1.58l-.65.65a12 12 0 0 0 4.5 4.5l.65-.65a1.5 1.5 0 0 1 1.58-.34c.67.25 1.38.42 2.1.52a1.5 1.5 0 0 1 1.3 1.52Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
