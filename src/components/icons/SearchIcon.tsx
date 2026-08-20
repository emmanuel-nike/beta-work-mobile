import Svg, { Path } from 'react-native-svg';

export function SearchIcon() {
  return (
    <Svg fill="none" height={20} viewBox="0 0 20 20" width={20}>
      <Path
        d="M9.167 15.833C12.848 15.833 15.833 12.848 15.833 9.167C15.833 5.485 12.848 2.5 9.167 2.5C5.485 2.5 2.5 5.485 2.5 9.167C2.5 12.848 5.485 15.833 9.167 15.833Z"
        stroke="rgba(255,255,255,0.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M17.5 17.5L13.875 13.875"
        stroke="rgba(255,255,255,0.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
