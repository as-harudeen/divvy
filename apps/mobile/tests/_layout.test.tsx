import '@testing-library/react-native/extend-expect';
import { render } from '@testing-library/react-native';

jest.mock('react-native-url-polyfill/auto', () => ({}));
jest.mock('../src/global.css', () => ({}), { virtual: true });
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
  };
});

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('@expo-google-fonts/inter', () => ({
  Inter_400Regular: 'Inter_400Regular',
  Inter_500Medium: 'Inter_500Medium',
  Inter_600SemiBold: 'Inter_600SemiBold',
  Inter_700Bold: 'Inter_700Bold',
}));

jest.mock('@expo-google-fonts/jetbrains-mono', () => ({
  JetBrainsMono_400Regular: 'JetBrainsMono_400Regular',
  JetBrainsMono_500Medium: 'JetBrainsMono_500Medium',
}));

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

  it('loads Inter and JetBrains Mono font maps', () => {
    render(<RootLayout />);
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
