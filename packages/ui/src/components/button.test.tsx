import '@testing-library/react-native/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from './button';

/**
 * TDD contract for Button.
 *
 * These tests define the minimum expected behaviour and lean on accessibility
 * primitives rather than NativeWind class strings — that keeps them stable
 * across NativeWind versions and styling refactors.
 *
 * Write (or update) tests here BEFORE modifying the Button implementation.
 */
describe('Button', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeOnTheScreen();
    });

    it('has displayName set to Button', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onPress when disabled', () => {
      const handlePress = jest.fn();
      render(
        <Button disabled onPress={handlePress}>
          Disabled
        </Button>,
      );
      fireEvent.press(screen.getByRole('button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('is disabled when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('exposes accessibilityState.busy when loading', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ busy: true });
    });

    it('shows a spinner when loading', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByLabelText('Loading')).toBeOnTheScreen();
    });
  });

  describe('interactions', () => {
    it('calls onPress when pressed', () => {
      const handlePress = jest.fn();
      render(<Button onPress={handlePress}>Click</Button>);
      fireEvent.press(screen.getByRole('button'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });
  });
});
