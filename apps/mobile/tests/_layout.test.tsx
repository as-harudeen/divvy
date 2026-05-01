import '@testing-library/react-native/extend-expect';
import { render } from '@testing-library/react-native';

jest.mock('react-native-url-polyfill/auto', () => ({}));
jest.mock('../src/global.css', () => ({}), { virtual: true });

jest.mock('expo-router', () => ({
  Stack: () => null,
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

import RootLayout from '../app/_layout';

describe('RootLayout', () => {
  it('renders without crash', () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
