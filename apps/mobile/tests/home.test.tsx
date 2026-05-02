import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Link: ({
      children,
      href,
      testID,
    }: { children: React.ReactNode; href: string; testID?: string }) => (
      <Text testID={testID} accessibilityRole="link">
        {children} → {href}
      </Text>
    ),
  };
});

import HomeScreen from '../app/index';

describe('HomeScreen', () => {
  it('renders the page heading', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('page-heading')).toBeOnTheScreen();
  });

  it('renders type-safe link to create-group route', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('create-group-link')).toHaveTextContent(/\/group\/new/);
  });
});
