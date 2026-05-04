import '@testing-library/react-native/extend-expect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Group, Person, Split } from '@repo/types';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { useAppStore } from '../src/stores/app';
import { useGroupsStore } from '../src/stores/groups';
import { usePeopleStore } from '../src/stores/people';
import { useSplitsStore } from '../src/stores/splits';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  const router = { push: jest.fn() };
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
    useRouter: () => router,
    router,
  };
});

import HomeScreen from '../app/index';

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
};

const groups: Record<string, Group> = {
  'group-older': {
    id: 'group-older',
    name: 'Apartment',
    memberIds: ['person-you', 'person-maya'],
    createdAt: '2026-01-01T00:00:00.000Z',
    lastActivityAt: '2026-01-02T00:00:00.000Z',
    status: 'active',
  },
  'group-newer': {
    id: 'group-newer',
    name: 'Weekend Trip',
    memberIds: ['person-you'],
    createdAt: '2026-01-01T00:00:00.000Z',
    lastActivityAt: '2026-01-04T00:00:00.000Z',
    status: 'settled',
  },
};

const splits: Record<string, Split> = {
  'split-apartment': {
    id: 'split-apartment',
    groupId: 'group-older',
    label: 'Groceries',
    totalCents: 4200,
    payerId: 'person-you',
    createdAt: '2026-01-02T00:00:00.000Z',
    shares: {
      'person-you': 2100,
      'person-maya': 2100,
    },
    settlementStatus: 'open',
    transfers: [{ from: 'person-maya', to: 'person-you', cents: 2100 }],
  },
  'split-trip': {
    id: 'split-trip',
    groupId: 'group-newer',
    label: 'Hotel',
    totalCents: 41280,
    payerId: 'person-you',
    createdAt: '2026-01-04T00:00:00.000Z',
    shares: {
      'person-you': 41280,
    },
    settlementStatus: 'settled',
    transfers: [],
  },
};

function seedHomeState(activeGroupId: string | null = 'group-older') {
  usePeopleStore.setState({ people, version: 1 });
  useGroupsStore.setState({ groups, version: 1 });
  useSplitsStore.setState({ splits, version: 1 });
  useAppStore.setState({ activeGroupId, userPersonId: 'person-you', version: 1 });
}

describe('HomeScreen', () => {
  beforeEach(async () => {
    const { router } = require('expo-router');
    await AsyncStorage.clear();
    router.push.mockClear();
    useAppStore.setState(emptyAppState);
    useGroupsStore.setState(emptyGroupsState);
    usePeopleStore.setState(emptyPeopleState);
    useSplitsStore.setState(emptySplitsState);
  });

  it('renders the branded empty-state heading', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('page-heading')).toHaveTextContent('Welcome to Divvy');
    expect(screen.getByText(/split bills with friends in seconds/i)).toBeOnTheScreen();
  });

  it('renders the compact mockup header chrome', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('brand-wordmark-header')).toHaveProp(
      'className',
      expect.stringContaining('h-6 w-20'),
    );
    expect(screen.queryByTestId('brand-mark-header')).not.toBeOnTheScreen();
    expect(screen.getByTestId('user-initial')).toHaveProp(
      'className',
      expect.stringContaining('h-6 w-6'),
    );
  });

  it('renders a create group action in the empty state', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('create-group-link')).toHaveTextContent('+ Create your first group');
  });

  it('renders the mockup empty state when there are no groups', () => {
    render(<HomeScreen />);

    expect(screen.getByText('No groups yet')).toBeOnTheScreen();
    expect(screen.getByText('Name a group')).toBeOnTheScreen();
    expect(screen.getByText('Add a few people')).toBeOnTheScreen();
    expect(screen.getByText('Split your first bill')).toBeOnTheScreen();
    expect(screen.getByText('No login - No phone numbers - Just names')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /create your first group/i })).toBeOnTheScreen();
  });

  it('navigates to create group from the empty state CTA', () => {
    const { router } = require('expo-router');

    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('create-group-link'));

    expect(router.push).toHaveBeenCalledWith('/group/new');
  });

  it('navigates to create group from the inline create row', () => {
    const { router } = require('expo-router');
    seedHomeState();

    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('group-list-create-row'));

    expect(router.push).toHaveBeenCalledWith('/group/new');
  });

  it('renders the populated mockup heading and bottom actions', () => {
    seedHomeState('group-older');

    render(<HomeScreen />);

    expect(screen.getByTestId('page-heading')).toHaveTextContent('Your groups');
    expect(screen.getByText('2 active - tap to open or split')).toBeOnTheScreen();
    expect(screen.getByText('+ Create new group')).toBeOnTheScreen();
    expect(screen.getByText('SPLITTING UNDER')).toBeOnTheScreen();
    expect(screen.getByText('Apartment - 2 people')).toBeOnTheScreen();
    expect(screen.getByText('Change')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /new split/i })).toBeOnTheScreen();
  });

  it('starts a split for the active group from the bottom CTA', () => {
    const { router } = require('expo-router');
    seedHomeState('group-older');

    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('new-split-button'));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/group/[id]/split/new',
      params: { id: 'group-older' },
    });
  });

  it('renders groups sorted by last activity descending', () => {
    seedHomeState();

    render(<HomeScreen />);

    expect(screen.getByTestId('group-list')).toHaveProp(
      'accessibilityLabel',
      'Groups: Weekend Trip, Apartment',
    );
  });

  it('renders the active group context strip and opens the active group', () => {
    const { router } = require('expo-router');
    seedHomeState('group-older');

    render(<HomeScreen />);
    expect(screen.getByText('SPLITTING UNDER')).toBeOnTheScreen();
    expect(screen.getByText('Apartment - 2 people')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('active-group-strip'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/group/[id]',
      params: { id: 'group-older' },
    });
  });

  it('falls back to the most recent group when no active group is set', () => {
    seedHomeState(null);

    render(<HomeScreen />);

    expect(screen.getByText('Weekend Trip - 1 person')).toBeOnTheScreen();
    expect(screen.getByTestId('group-card-group-newer')).toHaveProp('accessibilityState', {
      selected: true,
    });
  });

  it('sets the active group and opens detail when a card is tapped', () => {
    const { router } = require('expo-router');
    seedHomeState('group-older');

    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('group-card-group-newer'));

    expect(useAppStore.getState().activeGroupId).toBe('group-newer');
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/group/[id]',
      params: { id: 'group-newer' },
    });
  });
});
