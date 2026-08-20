import Svg, { Path } from 'react-native-svg';

import { dashboardColors } from '../../theme/dashboard';

export function ChevronDownIcon() {
  return (
    <Svg fill="none" height={16} viewBox="0 0 16 16" width={16}>
      <Path
        d="M4 6L8 10L12 6"
        stroke={dashboardColors.white}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
