import '@testing-library/react-native/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { BottomSheetTrigger } from './bottom-sheet-trigger';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View: MockView } = require('react-native');
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

describe('BottomSheetTrigger', () => {
  it('renders trigger content', () => {
    render(
      <BottomSheetTrigger triggerLabel="Open Sheet">
        <Text>Sheet content</Text>
      </BottomSheetTrigger>,
    );
    expect(screen.getByText('Open Sheet')).toBeOnTheScreen();
  });

  it('opens the bottom sheet when trigger is pressed', () => {
    render(
      <BottomSheetTrigger triggerLabel="Show Details">
        <Text>Sheet content here</Text>
      </BottomSheetTrigger>,
    );
    fireEvent.press(screen.getByText('Show Details'));
    expect(screen.getByText('Sheet content here')).toBeOnTheScreen();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <BottomSheetTrigger triggerLabel="Open">
        <Text>Content</Text>
      </BottomSheetTrigger>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
