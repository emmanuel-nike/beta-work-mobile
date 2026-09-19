import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function TrashIcon({ color = '#C44534', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M17.5 4.6c-2.8-.3-5.6-.4-8.4-.4-1.6 0-3.3.1-5 .3l-1.7.1M7.1 3.7l.2-1.1c.1-.7.2-1.3 1.5-1.3h2.4c1.3 0 1.4.6 1.5 1.3l.2 1.1M15.2 7.2l-.5 8.4c-.1 1.3-.2 2.3-2.5 2.3H7.8c-2.3 0-2.4-1-2.5-2.3l-.5-8.4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
