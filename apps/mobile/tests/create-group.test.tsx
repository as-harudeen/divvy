import '@testing-library/react-native/extend-expect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Person } from '@repo/types';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type React from 'react';

import { useAppStore } from '../src/stores/app';
import { useGroupsStore } from '../src/stores/groups';
import { usePeopleStore } from '../src/stores/people';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockNanoid = jest.fn<string, []>();

jest.mock('nanoid/non-secure', () => ({
  nanoid: () => mockNanoid(),
}));

type MockBottomSheetModalHandle = {
  present: () => void;
  dismiss: () => void;
};

type MockBottomSheetModalProps = {
  children?: React.ReactNode;
  backdropComponent?: (props: Record<string, unknown>) => React.ReactNode;
  onDismiss?: () => void;
};

type MockBottomSheetViewProps = {
  children?: React.ReactNode;
  testID?: string;
};

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { Pressable, TextInput, View } = require('react-native');

  const BottomSheetModal = React.forwardRef(
    (
      { children, backdropComponent: BackdropComponent, onDismiss }: MockBottomSheetModalProps,
      ref: React.Ref<MockBottomSheetModalHandle>,
    ) => {
      const [presented, setPresented] = React.useState(false);

      React.useImperativeHandle(ref, () => ({
        present: () => setPresented(true),
        dismiss: () => {
          setPresented(false);
          onDismiss?.();
        },
      }));

      if (!presented) {
        return null;
      }

      return (
        <View testID="mock-bottom-sheet-modal">
          {BackdropComponent?.({})}
          <View testID="mock-bottom-sheet-content">{children}</View>
        </View>
      );
    },
  );

  const BottomSheetBackdrop = ({ onPress }: { onPress?: () => void }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Dismiss add person sheet"
      testID="add-person-backdrop"
      onPress={onPress}
    />
  );

  const BottomSheetView = ({ children, testID }: MockBottomSheetViewProps) => (
    <View testID={testID ?? 'mock-bottom-sheet-view'}>{children}</View>
  );

  const BottomSheetModalProvider = ({ children }: { children?: React.ReactNode }) => (
    <View testID="mock-bottom-sheet-provider">{children}</View>
  );

  const BottomSheetTextInput = (props: React.ComponentProps<typeof TextInput>) => (
    <TextInput {...props} />
  );

  return {
    __esModule: true,
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetTextInput,
    BottomSheetView,
  };
});

jest.mock('expo-router', () => {
  const router = { back: jest.fn(), replace: jest.fn() };
  return {
    useRouter: () => router,
    router,
  };
});

import CreateGroupScreen from '../app/group/new';

const emptyAppState = { activeGroupId: null, userPersonId: null, version: 1 };
const emptyGroupsState = { groups: {}, version: 1 };

const people: Record<string, Person> = {
  'person-you': {
    id: 'person-you',
    name: 'You',
    avatarColor: '#2563EB',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-alex': {
    id: 'person-alex',
    name: 'Alex',
    avatarColor: '#A78BFA',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-maya': {
    id: 'person-maya',
    name: 'Maya',
    avatarColor: '#DC2626',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

function renderCreateGroup() {
  usePeopleStore.setState({ people, version: 1 });
  useGroupsStore.setState(emptyGroupsState);
  useAppStore.setState({ activeGroupId: null, userPersonId: 'person-you', version: 1 });

  return render(<CreateGroupScreen />);
}

describe('CreateGroupScreen', () => {
  beforeEach(async () => {
    const { router } = require('expo-router');
    await AsyncStorage.clear();
    router.back.mockClear();
    router.replace.mockClear();
    mockNanoid.mockReset();
    mockNanoid.mockReturnValue('generated-id');
    useAppStore.setState(emptyAppState);
    useGroupsStore.setState(emptyGroupsState);
    usePeopleStore.setState({ people: {}, version: 1 });
  });

  it('keeps save disabled until the trimmed name and at least one member are present', () => {
    renderCreateGroup();

    const saveButton = screen.getByTestId('create-group-save-button');
    const nameInput = screen.getByLabelText('Group name');

    expect(saveButton).toHaveProp('accessibilityState', { disabled: true });

    fireEvent.changeText(nameInput, '   ');
    expect(saveButton).toHaveProp('accessibilityState', { disabled: true });

    fireEvent.changeText(nameInput, '  Saturday brunch  ');
    expect(saveButton).toHaveProp('accessibilityState', { disabled: false });

    fireEvent.press(screen.getByTestId('member-pill-remove-person-you'));
    expect(saveButton).toHaveProp('accessibilityState', { disabled: true });
    expect(screen.getByTestId('recent-person-person-you')).toHaveProp('accessibilityState', {
      disabled: false,
    });
  });

  it('dims an added recent and prevents adding the same person twice', () => {
    renderCreateGroup();

    fireEvent.press(screen.getByTestId('recent-person-person-alex'));

    expect(screen.getByTestId('member-pill-person-alex')).toBeOnTheScreen();
    expect(screen.getByTestId('recent-person-person-alex')).toHaveProp('accessibilityState', {
      disabled: true,
    });
    expect(screen.getByTestId('recent-person-person-alex')).toHaveProp(
      'className',
      expect.stringContaining('opacity-[0.35]'),
    );

    fireEvent.press(screen.getByTestId('recent-person-person-alex'));
    expect(screen.getAllByText('Alex')).toHaveLength(2);
  });

  it('returns removed pills to the selectable recents list', () => {
    renderCreateGroup();

    fireEvent.press(screen.getByTestId('recent-person-person-alex'));
    fireEvent.press(screen.getByTestId('member-pill-remove-person-alex'));

    expect(screen.queryByTestId('member-pill-person-alex')).not.toBeOnTheScreen();
    expect(screen.getByTestId('recent-person-person-alex')).toHaveProp('accessibilityState', {
      disabled: false,
    });
    expect(screen.getByTestId('recent-person-person-alex')).not.toHaveProp(
      'className',
      expect.stringContaining('opacity-[0.35]'),
    );
  });

  it('updates the member counter as members are added and removed', () => {
    renderCreateGroup();

    expect(screen.getByTestId('member-count')).toHaveTextContent('1 member');

    fireEvent.press(screen.getByTestId('recent-person-person-alex'));
    expect(screen.getByTestId('member-count')).toHaveTextContent('2 members');

    fireEvent.press(screen.getByTestId('member-pill-remove-person-alex'));
    expect(screen.getByTestId('member-count')).toHaveTextContent('1 member');
  });

  it('opens the add person sheet from the add person button', () => {
    renderCreateGroup();

    fireEvent.press(screen.getByTestId('add-person-button'));

    expect(screen.getByTestId('add-person-sheet')).toBeOnTheScreen();
    expect(screen.getByText('Add person')).toBeOnTheScreen();
  });

  it('auto-adds a newly created person to the current group form', () => {
    mockNanoid.mockReturnValue('person-riley');
    renderCreateGroup();

    fireEvent.press(screen.getByTestId('add-person-button'));
    fireEvent.changeText(screen.getByLabelText('First name'), 'Riley');
    fireEvent.press(screen.getByLabelText('Add to group'));

    expect(screen.getByTestId('member-pill-person-riley')).toBeOnTheScreen();
    expect(screen.getByTestId('member-count')).toHaveTextContent('2 members');
  });

  it('creates the group, sets it active, and replaces with the group detail route', () => {
    const { router } = require('expo-router');
    renderCreateGroup();

    fireEvent.changeText(screen.getByLabelText('Group name'), '  Saturday brunch  ');
    fireEvent.press(screen.getByTestId('recent-person-person-alex'));
    fireEvent.press(screen.getByTestId('create-group-save-button'));

    const [group] = Object.values(useGroupsStore.getState().groups);

    expect(group).toMatchObject({
      name: 'Saturday brunch',
      memberIds: ['person-you', 'person-alex'],
      status: 'active',
    });
    expect(useAppStore.getState().activeGroupId).toBe(group?.id);
    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/group/[id]',
      params: { id: group?.id },
    });
  });
});
