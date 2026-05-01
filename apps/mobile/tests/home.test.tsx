import '@testing-library/react-native/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import HomeScreen from '../app/index';

/**
 * Smoke test for the home screen.
 *
 * TDD note: assertions describe the minimum contract — heading, two CTA buttons,
 * and that the buttons fire `Linking.openURL` with the expected destinations.
 */
describe('HomeScreen', () => {
  it('renders the page heading', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('page-heading')).toBeOnTheScreen();
  });

  it('renders the Supabase docs button', () => {
    render(<HomeScreen />);
    expect(screen.getByRole('button', { name: /supabase docs/i })).toBeOnTheScreen();
  });

  it('renders the Expo docs button', () => {
    render(<HomeScreen />);
    expect(screen.getByRole('button', { name: /expo docs/i })).toBeOnTheScreen();
  });

  it('opens the Supabase docs URL when the Supabase button is pressed', () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
    render(<HomeScreen />);
    fireEvent.press(screen.getByRole('button', { name: /supabase docs/i }));
    expect(openURL).toHaveBeenCalledWith('https://supabase.com/docs');
    openURL.mockRestore();
  });
});
