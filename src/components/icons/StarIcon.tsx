import Svg, { Path } from 'react-native-svg';

const STAR_PATH =
  'M12 2.5l2.9 5.88 6.49.95-4.7 4.58 1.11 6.46L12 17.33l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.95L12 2.5Z';

type StarIconProps = Readonly<{
  color?: string;
  size?: number;
  filled?: boolean;
}>;

export function StarIcon({
  color = '#E9775C',
  size = 12,
  filled = true,
}: StarIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d={STAR_PATH}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={filled ? 0 : 1.6}
      />
    </Svg>
  );
}
