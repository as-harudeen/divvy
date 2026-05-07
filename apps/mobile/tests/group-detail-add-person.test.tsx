import '@testing-library/react-native/extend-expect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Group, Person } from '@repo/types';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type React from 'react';

import { useAppStore } from '../src/stores/app';
import { useGroupsStore } from '../src/stores/groups';
import { usePeopleStore } from '../src/stores/people';
import { useSplitsStore } from '../src/stores/splits';

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
  android_keyboardInputMode?: string;
  backdropComponent?: (props: Record<string, unknown>) => React.ReactNode;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: string;
  keyboardBlurBehavior?: string;
  onDismiss?: () => void;
  snapPoints?: string[];
};

type MockBottomSheetViewProps = {
  children?: React.ReactNode;
  testID?: string;
};

type MockBottomSheetFlatListProps = {
  data?: readonly unknown[];
  contentContainerStyle?: unknown;
  keyboardShouldPersistTaps?: string;
  renderItem: ({ item }: { item: unknown }) => React.ReactElement | null;
  keyExtractor?: (item: unknown, index: number) => string;
  showsVerticalScrollIndicator?: boolean;
  style?: unknown;
  testID?: string;
};

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { Pressable, TextInput, View } = require('react-native');

  const BottomSheetModal = React.forwardRef(
    (
      {
        children,
        backdropComponent: BackdropComponent,
        onDismiss,
        ...modalProps
      }: MockBottomSheetModalProps,
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
        <View
          testID="mock-bottom-sheet-modal"
          android_keyboardInputMode={modalProps.android_keyboardInputMode}
          enableDynamicSizing={modalProps.enableDynamicSizing}
          keyboardBehavior={modalProps.keyboardBehavior}
          keyboardBlurBehavior={modalProps.keyboardBlurBehavior}
          snapPoints={modalProps.snapPoints}
        >
          {BackdropComponent?.({})}
          <View testID="mock-bottom-sheet-content">{children}</View>
        </View>
      );
    },
  );

  const BottomSheetBackdrop = ({ onPress }: { onPress?: () => void }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Dismiss add people sheet"
      testID="add-people-backdrop"
      onPress={onPress}
    />
  );

  const BottomSheetView = ({ children, testID }: MockBottomSheetViewProps) => (
    <View testID={testID ?? 'mock-bottom-sheet-view'}>{children}</View>
  );

  const BottomSheetFlatList = ({
    contentContainerStyle,
    data,
    keyboardShouldPersistTaps,
    renderItem,
    keyExtractor,
    showsVerticalScrollIndicator,
    style,
    testID,
  }: MockBottomSheetFlatListProps) => {
    const itemTypes = (data ?? []).map((item) => {
      if (typeof item !== 'object' || item === null || !('type' in item)) {
        return typeof item === 'object' && item !== null && 'person' in item
          ? 'person'
          : 'unknown';
      }

      return String((item as { type: unknown }).type);
    });

    return (
      <View
        testID={testID ?? 'mock-bottom-sheet-flat-list'}
        contentContainerStyle={contentContainerStyle}
        itemTypes={itemTypes}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        style={style}
      >
        {(data ?? []).map((item, index) => (
          <View key={keyExtractor?.(item, index) ?? index}>{renderItem({ item })}</View>
        ))}
      </View>
    );
  };

  const BottomSheetModalProvider = ({ children }: { children?: React.ReactNode }) => (
    <View testID="mock-bottom-sheet-provider">{children}</View>
  );

  const BottomSheetTextInput = (props: React.ComponentProps<typeof TextInput>) => (
    <TextInput {...props} testID={props.testID ?? 'bottom-sheet-text-input'} />
  );

  return {
    __esModule: true,
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetTextInput,
    BottomSheetView,
  };
});

const mockRouter = { push: jest.fn() };
let mockRouteParams = { id: 'group-brunch' };

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockRouteParams,
  useRouter: () => mockRouter,
  router: mockRouter,
}));

import GroupDetailScreen from '../app/group/[id]/index';

const emptyAppState = { activeGroupId: null, userPersonId: null, version: 1 };
const emptyGroupsState = { groups: {}, version: 1 };
const emptyPeopleState = { people: {}, version: 1 };
const emptySplitsState = { splits: {}, version: 1 };

const people: Record<string, Person> = {
  'person-you': {
    id: 'person-you',
    name: 'You',
    avatarColor: '#2563EB',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-maya': {
    id: 'person-maya',
    name: 'Maya',
    avatarColor: '#DC2626',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-riya': {
    id: 'person-riya',
    name: 'Riya',
    avatarColor: '#CA8A04',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-theo': {
    id: 'person-theo',
    name: 'Theo',
    avatarColor: '#9333EA',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-sam': {
    id: 'person-sam',
    name: 'Sam',
    avatarColor: '#EA580C',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-noor': {
    id: 'person-noor',
    name: 'Noor',
    avatarColor: '#0891B2',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

const currentGroup: Group = {
  id: 'group-brunch',
  name: 'Saturday brunch',
  memberIds: ['person-you', 'person-maya'],
  createdAt: '2026-05-01T00:00:00.000Z',
  lastActivityAt: '2026-05-05T00:00:00.000Z',
  status: 'active',
};

const lakeGroup: Group = {
  id: 'group-lake',
  name: 'Lake trip',
  memberIds: ['person-riya', 'person-theo'],
  createdAt: '2026-04-01T00:00:00.000Z',
  lastActivityAt: '2026-05-03T00:00:00.000Z',
  status: 'active',
};

const officeGroup: Group = {
  id: 'group-office',
  name: 'Office lunch',
  memberIds: ['person-sam', 'person-noor'],
  createdAt: '2026-04-01T00:00:00.000Z',
  lastActivityAt: '2026-04-29T00:00:00.000Z',
  status: 'active',
};

function seedGroupDetail() {
  usePeopleStore.setState({ people, version: 1 });
  useGroupsStore.setState({
    groups: {
      [currentGroup.id]: currentGroup,
      [lakeGroup.id]: lakeGroup,
      [officeGroup.id]: officeGroup,
    },
    version: 1,
  });
  useSplitsStore.setState(emptySplitsState);
  useAppStore.setState({
    activeGroupId: currentGroup.id,
    userPersonId: 'person-you',
    version: 1,
  });
  mockRouteParams = { id: currentGroup.id };
}

function renderAddPeopleSheet() {
  seedGroupDetail();
  render(<GroupDetailScreen />);

  fireEvent.press(screen.getByTestId('member-add-button'));
}

describe('GroupDetail AddPeopleSheet', () => {
  beforeEach(async () => {
    jest.useFakeTimers({ now: new Date('2026-05-06T12:00:00.000Z') });
    await AsyncStorage.clear();
    mockNanoid.mockReset();
    mockNanoid.mockReturnValue('person-ril');
    mockRouter.push.mockClear();
    mockRouteParams = { id: currentGroup.id };
    useAppStore.setState(emptyAppState);
    useGroupsStore.setState(emptyGroupsState);
    usePeopleStore.setState(emptyPeopleState);
    useSplitsStore.setState(emptySplitsState);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens from the add member slot and enables Add (n) only after selection', () => {
    renderAddPeopleSheet();

    expect(screen.getByTestId('add-people-sheet')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-confirm-button')).toHaveTextContent('Add (0)');
    expect(screen.getByTestId('add-people-confirm-button')).toHaveProp('accessibilityState', {
      disabled: true,
    });
    expect(screen.getByTestId('add-people-confirm-label')).toHaveProp(
      'className',
      expect.stringContaining('text-slate-400'),
    );
    expect(screen.getByTestId('add-people-section-count')).toHaveTextContent('6 people');
    expect(screen.getByTestId('add-people-row-context-person-riya')).toHaveTextContent(
      'Lake trip · 3d ago',
    );

    fireEvent.press(screen.getByTestId('add-people-row-person-riya'));

    expect(screen.getByTestId('add-people-confirm-button')).toHaveTextContent('Add (1)');
    expect(screen.getByTestId('add-people-confirm-button')).toHaveProp('accessibilityState', {
      disabled: false,
    });
    expect(screen.getByTestId('add-people-confirm-label')).toHaveProp(
      'className',
      expect.stringContaining('text-blue-600'),
    );
    expect(screen.getByTestId('member-pill-person-riya')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-row-person-riya')).toHaveProp('accessibilityState', {
      disabled: false,
      selected: true,
    });
    expect(screen.getByTestId('add-people-row-check-person-riya')).toHaveTextContent('✓');

    fireEvent.press(screen.getByTestId('member-pill-remove-person-riya'));

    expect(screen.queryByTestId('member-pill-person-riya')).not.toBeOnTheScreen();
    expect(screen.getByTestId('add-people-confirm-button')).toHaveTextContent('Add (0)');
  });

  it('keeps the people listing as the flexible scroll area below pinned controls', () => {
    renderAddPeopleSheet();

    expect(screen.getByTestId('mock-bottom-sheet-modal')).toHaveProp('enableDynamicSizing', false);
    expect(screen.getByTestId('add-people-sheet')).toHaveProp(
      'style',
      expect.objectContaining({ flex: 1 }),
    );
    expect(screen.getByTestId('add-people-selected-pill-strip')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-search-input')).toBeOnTheScreen();
    expect(screen.getByText('FROM YOUR GROUPS')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-results-list')).toHaveProp('itemTypes', [
      'person',
      'person',
      'person',
      'person',
      'person',
      'person',
    ]);
    expect(screen.getByTestId('add-people-results-list')).toHaveProp(
      'style',
      expect.objectContaining({ flex: 1 }),
    );
    expect(screen.getByTestId('add-people-results-list')).toHaveProp(
      'keyboardShouldPersistTaps',
      'handled',
    );
    expect(screen.getByTestId('add-people-results-list')).toHaveProp(
      'showsVerticalScrollIndicator',
      false,
    );
  });

  it('keeps the sheet pinned at the top when the keyboard closes', () => {
    renderAddPeopleSheet();

    const modal = screen.getByTestId('mock-bottom-sheet-modal');
    const searchInput = screen.getByTestId('add-people-search-input');

    expect(modal).toHaveProp('keyboardBehavior', 'interactive');
    expect(modal).toHaveProp('android_keyboardInputMode', 'adjustPan');
    expect(modal).toHaveProp('snapPoints', ['92%']);

    fireEvent(searchInput, 'focus');
    expect(modal).toHaveProp('snapPoints', ['62%']);

    fireEvent(searchInput, 'blur');
    expect(modal).toHaveProp('keyboardBlurBehavior', 'none');
    expect(modal).toHaveProp('snapPoints', ['92%']);
  });

  it('shows current group members as locked rows that cannot be selected', () => {
    renderAddPeopleSheet();

    expect(screen.getByTestId('add-people-in-group-tag-person-you')).toHaveTextContent('In group');
    expect(screen.getByTestId('add-people-row-person-you')).toHaveProp('accessibilityState', {
      disabled: true,
      selected: false,
    });

    fireEvent.press(screen.getByTestId('add-people-row-person-you'));

    expect(screen.queryByTestId('member-pill-person-you')).not.toBeOnTheScreen();
    expect(screen.getByTestId('add-people-confirm-button')).toHaveTextContent('Add (0)');
  });

  it('filters matches case-insensitively and hides create on an exact match', () => {
    renderAddPeopleSheet();

    fireEvent.changeText(screen.getByTestId('add-people-search-input'), 'RI');

    expect(screen.getByText('CREATE NEW')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-create-title')).toHaveTextContent('Create "RI"');
    expect(screen.getByText('MATCHES')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-results-list')).toHaveProp('itemTypes', ['person']);
    expect(screen.getByTestId('add-people-row-person-riya')).toBeOnTheScreen();
    expect(screen.queryByTestId('add-people-row-person-sam')).not.toBeOnTheScreen();
    expect(screen.getByTestId('add-people-row-name-prefix-person-riya')).toHaveTextContent('Ri');
    expect(screen.getByTestId('add-people-row-name-prefix-person-riya')).toHaveProp(
      'className',
      expect.stringContaining('text-blue-600'),
    );

    fireEvent.changeText(screen.getByTestId('add-people-search-input'), ' riya ');

    expect(screen.queryByText('CREATE NEW')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('add-people-create-row')).not.toBeOnTheScreen();
    expect(screen.getByTestId('add-people-row-person-riya')).toBeOnTheScreen();
  });

  it('creates a new person inline, auto-selects them, and clears search', () => {
    renderAddPeopleSheet();

    fireEvent.changeText(screen.getByTestId('add-people-search-input'), '  Ril  ');
    fireEvent.press(screen.getByTestId('add-people-create-row'));

    const storedPerson = usePeopleStore.getState().people['person-ril'];

    expect(storedPerson).toMatchObject({
      id: 'person-ril',
      name: 'Ril',
    });
    expect(screen.getByTestId('member-pill-person-ril')).toBeOnTheScreen();
    expect(screen.getByTestId('add-people-search-input')).toHaveProp('value', '');
    expect(screen.getByTestId('add-people-confirm-button')).toHaveTextContent('Add (1)');
  });

  it('adds every selected person to the current group and dismisses on confirm', () => {
    renderAddPeopleSheet();

    fireEvent.press(screen.getByTestId('add-people-row-person-riya'));
    fireEvent.press(screen.getByTestId('add-people-row-person-theo'));
    fireEvent.press(screen.getByTestId('add-people-confirm-button'));

    expect(useGroupsStore.getState().groups[currentGroup.id]?.memberIds).toEqual([
      'person-you',
      'person-maya',
      'person-riya',
      'person-theo',
    ]);
    expect(screen.queryByTestId('add-people-sheet')).not.toBeOnTheScreen();
  });

  it('dismisses from Cancel without writing selected people', () => {
    renderAddPeopleSheet();

    fireEvent.press(screen.getByTestId('add-people-row-person-riya'));
    fireEvent.press(screen.getByTestId('add-people-cancel-button'));

    expect(useGroupsStore.getState().groups[currentGroup.id]?.memberIds).toEqual([
      'person-you',
      'person-maya',
    ]);
    expect(screen.queryByTestId('add-people-sheet')).not.toBeOnTheScreen();
  });

  it('opens the same add people sheet from the Edit action', () => {
    seedGroupDetail();
    render(<GroupDetailScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Edit Saturday brunch' }));

    expect(screen.getByTestId('add-people-sheet')).toBeOnTheScreen();
  });
});
