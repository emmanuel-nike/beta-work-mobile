import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';
import type { SizedIconProps } from './types';

export function LockIcon({
  color = dashboardColors.accentGold,
  size = 20,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M15.833 8.958H14.583V6.042C14.583 3.737 12.713 1.875 10.417 1.875C8.12 1.875 6.25 3.737 6.25 6.042V8.958H5C4.08 8.958 3.333 9.705 3.333 10.625V16.042C3.333 16.962 4.08 17.708 5 17.708H15.833C16.753 17.708 17.5 16.962 17.5 16.042V10.625C17.5 9.705 16.753 8.958 15.833 8.958ZM7.917 6.042C7.917 4.653 9.028 3.542 10.417 3.542C11.806 3.542 12.917 4.653 12.917 6.042V8.958H7.917V6.042Z"
        fill={color}
      />
    </Svg>
  );
}
