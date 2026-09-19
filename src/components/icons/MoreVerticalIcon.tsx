import Svg, { Path } from 'react-native-svg';

import type { IconColorProps } from './types';

export function MoreVerticalIcon({ color = '#FFFFFF' }: IconColorProps) {
  return (
    <Svg fill="none" height={20} viewBox="0 0 20 20" width={20}>
      <Path
        d="M10 5.833a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM10 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM10 16.667a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
        fill={color}
      />
    </Svg>
  );
}
