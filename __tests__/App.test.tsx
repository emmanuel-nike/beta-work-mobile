/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { SignInFlow } from '../src/screens/SignInFlow';
import { SignupFlow } from '../src/screens/SignupFlow';

jest.useFakeTimers();

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
    renderer = ReactTestRenderer.create(<SignupFlow />);
  });

  expect(
    renderer.root.findByProps({ children: 'Create your account' }),
  ).toBeTruthy();
  await ReactTestRenderer.act(() => renderer.unmount());
});

test('renders the sign-in flow', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<SignInFlow />);
  });

  expect(renderer.root.findByProps({ children: 'Welcome back' })).toBeTruthy();
  expect(renderer.root.findByProps({ children: 'Login' })).toBeTruthy();
  await ReactTestRenderer.act(() => renderer.unmount());
});
