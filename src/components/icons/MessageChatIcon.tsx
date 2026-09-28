import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function MessageChatIcon({ color = '#FFFFFF', size = 18 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M7.08 15.83H6.67c-3.34 0-5-.83-5-5V6.67c0-3.34 1.66-5 5-5h6.66c3.34 0 5 1.66 5 5v4.16c0 3.34-1.66 5-5 5h-.41c-.26 0-.51.12-.67.33l-1.25 1.67c-.55.73-1.45.73-2 0l-1.25-1.67a.87.87 0 0 0-.67-.33Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <Path
        d="M6.66 9.17h6.67"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
