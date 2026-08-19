module.exports = {
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '^@env$': '<rootDir>/__mocks__/@env.js',
  },
  preset: 'react-native',
};
