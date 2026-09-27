import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

/** Small briefcase shown beside an artisan's completed-job count. */
export function JobsCompletedIcon({
  color = '#736051',
  size = 13,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <Path
        d="M5.3 14h5.4c2.2 0 2.6-.9 2.7-1.9l.4-4.3c.1-1.3-.2-2.4-2.5-2.4H4.7c-2.3 0-2.6 1.1-2.5 2.4l.4 4.3C2.7 13.1 3.1 14 5.3 14Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      <Path
        d="M5.3 5.3V4.9c0-1 0-1.8 1.7-1.8h2c1.7 0 1.7.8 1.7 1.8v.4M9.3 8.7v.5c0 .01 0 .01 0 0a1.3 1.3 0 0 1-2.6 0v-.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      <Path
        d="M13.7 7.3A11 11 0 0 1 8 9.2 11 11 0 0 1 2.3 7.4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
    </Svg>
  );
}
