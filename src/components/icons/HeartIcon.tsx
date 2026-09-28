import Svg, { Path } from 'react-native-svg';

const HEART_PATH =
  'M12 20.5c-.4 0-.8-.14-1.1-.42C7.1 16.77 2 12.5 2 8.4 2 5.4 4.3 3 7.2 3 9 3 10.7 3.9 12 5.5 13.3 3.9 15 3 16.8 3 19.7 3 22 5.4 22 8.4c0 4.1-5.1 8.37-8.9 11.68-.3.28-.7.42-1.1.42Z';

type HeartIconProps = Readonly<{
  color?: string;
  size?: number;
  filled?: boolean;
}>;

export function HeartIcon({
  color = '#E9775C',
  size = 18,
  filled = false,
}: HeartIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d={HEART_PATH}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={filled ? 0 : 1.8}
      />
    </Svg>
  );
}
