import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function LogoutIcon({ color = '#C44534', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M7.6 6.3V5.4c0-2 .8-2.8 3-2.8h3.1c2.2 0 3 .8 3 2.8v9.2c0 2-.8 2.8-3 2.8h-3.1c-2.2 0-3-.8-3-2.8v-.9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M2.5 10h9.6m0 0L9.7 7.6M12.1 10l-2.4 2.4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
