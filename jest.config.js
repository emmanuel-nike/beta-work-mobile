module.exports = {
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '^@env$': '<rootDir>/__mocks__/@env.js',
  },
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-redux|@reduxjs|immer)/)',
  ],
};
