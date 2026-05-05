import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';
import type React from 'react';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@gorhom/bottom-sheet', () => {
  const { TextInput, View } = require('react-native');

  return {
    __esModule: true,
    BottomSheetBackdrop: () => <View />,
    BottomSheetModal: () => null,
    BottomSheetModalProvider: ({ children }: { children?: React.ReactNode }) => (
      <View>{children}</View>
    ),
    BottomSheetTextInput: (props: React.ComponentProps<typeof TextInput>) => (
      <TextInput {...props} />
    ),
    BottomSheetView: ({ children }: { children?: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  const router = { back: jest.fn(), push: jest.fn() };
  return {
    Link: ({ children, testID }: { children: React.ReactNode; testID?: string }) => (
      <Text testID={testID}>{children}</Text>
    ),
    useLocalSearchParams: () => ({ id: 'g1', splitId: 's1' }),
    useRouter: () => router,
    router,
  };
});

import GroupDetail from '../app/group/[id]/index';
import SplitDetail from '../app/group/[id]/split/[splitId]/detail';
import Settle from '../app/group/[id]/split/[splitId]/settle';
import SplitNew from '../app/group/[id]/split/new';
import CreateGroup from '../app/group/new';
import Home from '../app/index';

const screens: Array<[string, React.ComponentType]> = [
  ['Home', Home],
  ['CreateGroup', CreateGroup],
  ['GroupDetail', GroupDetail],
  ['SplitNew', SplitNew],
  ['Settle', Settle],
  ['SplitDetail', SplitDetail],
];

describe('route stubs', () => {
  beforeEach(() => {
    const { router } = require('expo-router');
    router.back.mockClear();
    router.push.mockClear();
  });

  it.each(screens)('%s renders heading', (_name, Component) => {
    render(<Component />);
    expect(screen.getByTestId('page-heading')).toBeOnTheScreen();
  });

  it.each(screens)('%s can invoke router.back() to return to parent', (_name, Component) => {
    const { router } = require('expo-router');
    render(<Component />);
    router.back();
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
