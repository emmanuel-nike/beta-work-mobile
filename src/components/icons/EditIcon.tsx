import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function EditIcon({ color = '#0F6743', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <Path
        d="M8.7 2H6C3.3 2 2 3.3 2 6v4c0 2.7 1.3 4 4 4h4c2.7 0 4-1.3 4-4V7.3"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
      />
      <Path
        d="M11.1 2.4 6.3 7.2c-.2.2-.4.5-.4.8l-.2 1.4c-.1.5.3.9.8.8l1.4-.2c.3 0 .6-.2.8-.4l4.8-4.8c.6-.6.9-1.4 0-2.3-.9-.9-1.7-.6-2.4-.1Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
      />
    </Svg>
  );
}
