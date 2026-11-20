import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Notifications: mock the native FCM module and the SSE client so importing the
// app (which wires notifications) does not require native modules under Jest.
jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    requestPermission: jest.fn().mockResolvedValue(1),
    registerDeviceForRemoteMessages: jest.fn().mockResolvedValue(undefined),
    getToken: jest.fn().mockResolvedValue('test-fcm-token'),
    onTokenRefresh: jest.fn().mockReturnValue(() => {}),
    onMessage: jest.fn().mockReturnValue(() => {}),
    onNotificationOpenedApp: jest.fn().mockReturnValue(() => {}),
    getInitialNotification: jest.fn().mockResolvedValue(null),
    setBackgroundMessageHandler: jest.fn(),
  });
  messaging.AuthorizationStatus = { DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2 };
  return { __esModule: true, default: messaging };
});

jest.mock('react-native-sse', () => ({
  __esModule: true,
  default: class MockEventSource {
    addEventListener() {}
    removeEventListener() {}
    close() {}
  },
}));

jest.mock('@adonisjs/transmit-client', () => ({
  Transmit: class MockTransmit {
    subscription() {
      return {
        create: jest.fn().mockResolvedValue(undefined),
        onMessage: jest.fn(),
        delete: jest.fn(),
      };
    }
    close() {}
  },
  Subscription: class MockSubscription {},
}));

// The following pull in native modules unavailable under Jest; stub them so
// rendering the full app tree works.
jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    requestAuthorization: jest.fn(),
    setRNConfiguration: jest.fn(),
  },
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: () => null,
}));
