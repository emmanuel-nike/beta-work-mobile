/**
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import App from '../App';
import { SignInFlow } from '../src/screens/SignInFlow';
import { SignupFlow } from '../src/screens/SignupFlow';
import { store } from '../src/store';
import type { PreAuthStackParamList } from '../src/navigation/types';

jest.useFakeTimers();

const Stack = createNativeStackNavigator<PreAuthStackParamList>();

function renderPreAuthScreen(
  name: keyof PreAuthStackParamList,
  Component: React.ComponentType,
) {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Component} name={name} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

test('renders correctly', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    jest.advanceTimersByTime(1800);
  });

  expect(renderer.toJSON()).not.toBeNull();
  await ReactTestRenderer.act(() => renderer.unmount());
});

test('renders the signup flow', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      renderPreAuthScreen('Signup', SignupFlow),
    );
  });

  expect(
    renderer.root.findByProps({ children: 'Create your account' }),
  ).toBeTruthy();
  await ReactTestRenderer.act(() => renderer.unmount());
});

test('renders the sign-in flow', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      renderPreAuthScreen('SignIn', SignInFlow),
    );
  });

  expect(renderer.root.findByProps({ children: 'Welcome back' })).toBeTruthy();
  expect(renderer.root.findByProps({ children: 'Login' })).toBeTruthy();
  await ReactTestRenderer.act(() => renderer.unmount());
});
