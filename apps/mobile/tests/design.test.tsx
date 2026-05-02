import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';

jest.mock('@gorhom/bottom-sheet', () => {
  const { View: MockView } = require('react-native');
  const React = require('react');
  return {
    __esModule: true,
    BottomSheetModal: ({ children }: { children: React.ReactNode }) => (
      <MockView testID="bottom-sheet-modal">{children}</MockView>
    ),
    BottomSheetView: ({ children }: { children: React.ReactNode }) => (
      <MockView testID="bottom-sheet-view">{children}</MockView>
    ),
    BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => (
      <MockView testID="provider">{children}</MockView>
    ),
    useBottomSheetModal: () => ({ dismiss: jest.fn() }),
  };
});

import DesignScreen from '../app/_design';

describe('DesignScreen', () => {
  it('renders page heading', () => {
    render(<DesignScreen />);
    expect(screen.getByRole('header', { name: /design system/i })).toBeOnTheScreen();
  });

  it('renders Button variants', () => {
    render(<DesignScreen />);
    expect(screen.getByRole('button', { name: /primary/i })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /secondary/i })).toBeOnTheScreen();
  });

  it('renders Pill variants', () => {
    render(<DesignScreen />);
    expect(screen.getByText('Default')).toBeOnTheScreen();
    expect(screen.getByText('Success')).toBeOnTheScreen();
  });

  it('renders Avatars', () => {
    render(<DesignScreen />);
    expect(screen.getByLabelText('Avatar for Alice')).toBeOnTheScreen();
    expect(screen.getByLabelText('Avatar for Bob')).toBeOnTheScreen();
  });

  it('renders Cards', () => {
    render(<DesignScreen />);
    expect(screen.getByText('Flat card')).toBeOnTheScreen();
    expect(screen.getByText('Elevated card')).toBeOnTheScreen();
    expect(screen.getByText('Outlined card')).toBeOnTheScreen();
  });

  it('renders NumPad digits', () => {
    render(<DesignScreen />);
    expect(screen.getByLabelText('Digit 1')).toBeOnTheScreen();
    expect(screen.getByLabelText('Digit 0')).toBeOnTheScreen();
    expect(screen.getByLabelText('Backspace')).toBeOnTheScreen();
  });

  it('renders BottomSheetTrigger', () => {
    render(<DesignScreen />);
    expect(screen.getByRole('button', { name: /open sheet/i })).toBeOnTheScreen();
  });
});