import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function MicIcon({ color = '#4A3A2C', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M10 2.5a2.1 2.1 0 0 0-2.1 2.1v5a2.1 2.1 0 1 0 4.2 0v-5A2.1 2.1 0 0 0 10 2.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <Path
        d="M15 8.75v.833a5 5 0 0 1-10 0V8.75M10 14.583V17.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
