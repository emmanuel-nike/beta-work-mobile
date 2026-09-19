import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function SendIcon({ color = '#0F6743', size = 18 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M17.5 10 3.2 3.4a.4.4 0 0 0-.55.5L4.6 10l-1.95 6.1a.4.4 0 0 0 .55.5L17.5 10Z"
        fill={color}
      />
      <Path d="M4.6 10h6.6" stroke="#F5EDE2" strokeLinecap="round" strokeWidth={1.2} />
    </Svg>
  );
}
