import '@testing-library/react-native/extend-expect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Group, Person, Split } from '@repo/types';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAppStore } from '../src/stores/app';
import { useGroupsStore } from '../src/stores/groups';
import { usePeopleStore } from '../src/stores/people';
import { useSplitsStore } from '../src/stores/splits';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockRouter = { back: jest.fn(), push: jest.fn() };
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
  'person-alex': {
    id: 'person-alex',
    name: 'Alex',
    avatarColor: '#7C3AED',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  'person-maya': {
    id: 'person-maya',
    name: 'Maya',
    avatarColor: '#DC2626',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

const group: Group = {
  id: 'group-brunch',
  name: 'Saturday brunch',
  memberIds: ['person-you', 'person-alex', 'person-maya'],
  createdAt: '2026-01-01T00:00:00.000Z',
  lastActivityAt: '2026-01-03T00:00:00.000Z',
  status: 'active',
};

function makeSplit(overrides: Partial<Split> & Pick<Split, 'id'>): Split {
  return {
    groupId: 'group-brunch',
    label: 'Brunch',
    totalCents: 4000,
    payerId: 'person-you',
    createdAt: '2026-01-03T13:42:00.000Z',
    shares: {
      'person-you': 2000,
      'person-alex': 2000,
    },
    settlementStatus: 'open',
    transfers: [{ from: 'person-alex', to: 'person-you', cents: 2000 }],
    ...overrides,
  };
}

function seedGroupDetail({
  splits,
  groupStatus = 'active',
}: {
  splits: Split[];
  groupStatus?: Group['status'];
}) {
  usePeopleStore.setState({ people, version: 1 });
  useGroupsStore.setState({
    groups: {
      [group.id]: {
        ...group,
        status: groupStatus,
      },
    },
    version: 1,
  });
  useSplitsStore.setState({
    splits: Object.fromEntries(splits.map((split) => [split.id, split])),
    version: 1,
  });
  useAppStore.setState({ activeGroupId: group.id, userPersonId: 'person-you', version: 1 });
  mockRouteParams = { id: group.id };
}

describe('GroupDetailScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    mockRouter.back.mockClear();
    mockRouter.push.mockClear();
    mockRouteParams = { id: group.id };
    useAppStore.setState(emptyAppState);
    useGroupsStore.setState(emptyGroupsState);
    usePeopleStore.setState(emptyPeopleState);
    useSplitsStore.setState(emptySplitsState);
  });

  it('renders the navigation header and member row affordances', () => {
    seedGroupDetail({ splits: [] });

    render(<GroupDetailScreen />);

    expect(screen.getByTestId('group-detail-screen')).toHaveProp(
      'className',
      expect.stringContaining('bg-[#F3F3F8]'),
    );
    expect(screen.getByTestId('page-heading')).toHaveTextContent('Saturday brunch');
    expect(screen.getByTestId('page-heading')).toHaveProp(
      'className',
      expect.stringContaining('text-xs'),
    );
    expect(screen.getByTestId('group-header-back-arrow')).toHaveTextContent('←');
    expect(screen.getByTestId('group-header-back-label')).toHaveTextContent('Groups');
    expect(screen.getByRole('button', { name: 'Edit Saturday brunch' })).toHaveTextContent('Edit');
    expect(screen.getByTestId('member-avatar-label-person-you')).toHaveTextContent('You');
    expect(screen.getByTestId('member-avatar-label-person-alex')).toHaveTextContent('Alex');
    expect(screen.getByTestId('member-avatar-label-person-maya')).toHaveTextContent('Maya');
    expect(screen.getByTestId('member-add-label')).toHaveTextContent('Add');
    expect(screen.getByTestId('member-row-scroll')).toHaveProp('horizontal', true);
    expect(screen.getByTestId('member-row-scroll')).toHaveProp(
      'showsHorizontalScrollIndicator',
      false,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Back to groups' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it.each([
    [
      'creditor',
      [makeSplit({ id: 'split-creditor' })],
      'You are owed $20.00',
      'YOU ARE OWED',
      '$20.00',
    ],
    [
      'debtor',
      [
        makeSplit({
          id: 'split-debtor',
          totalCents: 6000,
          payerId: 'person-maya',
          shares: {
            'person-you': 3000,
            'person-maya': 3000,
          },
          transfers: [{ from: 'person-you', to: 'person-maya', cents: 3000 }],
        }),
      ],
      'You owe $30.00',
      'YOU OWE',
      '$30.00',
    ],
    [
      'balanced',
      [
        makeSplit({
          id: 'split-balanced',
          totalCents: 1000,
          shares: {
            'person-you': 1000,
          },
          settlementStatus: 'settled',
          transfers: [],
        }),
      ],
      'Settled',
      'SETTLED',
      '$0.00',
    ],
  ])(
    'shows the correct balance card when the user is %s',
    (_case, splits, label, status, amount) => {
      seedGroupDetail({ splits });

      render(<GroupDetailScreen />);

      expect(screen.getByTestId('balance-card')).toHaveProp('accessibilityLabel', label);
      expect(screen.getByTestId('balance-card')).toHaveProp(
        'className',
        expect.stringContaining('py-3'),
      );
      expect(screen.getByTestId('balance-status')).toHaveTextContent(status);
      expect(screen.getByTestId('balance-amount')).toHaveTextContent(amount);
      expect(screen.getByTestId('balance-amount')).toHaveProp(
        'className',
        expect.stringContaining('text-xl'),
      );
      expect(screen.getByText('View balances')).toBeOnTheScreen();
      expect(screen.getByTestId('view-balances-arrow-icon')).toHaveTextContent('→');
      expect(screen.queryByText('View balances ->')).not.toBeOnTheScreen();
      expect(screen.queryByText('All members')).not.toBeOnTheScreen();
    },
  );

  it('uses the red balance treatment when the current user owes money', () => {
    seedGroupDetail({
      splits: [
        makeSplit({
          id: 'split-debtor',
          totalCents: 6000,
          payerId: 'person-maya',
          shares: {
            'person-you': 3000,
            'person-maya': 3000,
          },
          transfers: [{ from: 'person-you', to: 'person-maya', cents: 3000 }],
        }),
      ],
    });

    render(<GroupDetailScreen />);

    expect(screen.getByTestId('balance-card')).toHaveProp(
      'className',
      expect.stringContaining('bg-red-50'),
    );
  });

  it('filters the balance context when a member avatar is tapped', () => {
    seedGroupDetail({
      splits: [
        makeSplit({ id: 'split-alex' }),
        makeSplit({
          id: 'split-maya',
          totalCents: 6000,
          payerId: 'person-maya',
          shares: {
            'person-you': 3000,
            'person-maya': 3000,
          },
          transfers: [{ from: 'person-you', to: 'person-maya', cents: 3000 }],
        }),
      ],
    });

    render(<GroupDetailScreen />);

    expect(screen.getByTestId('balance-card')).toHaveProp('accessibilityLabel', 'You owe $10.00');

    fireEvent.press(screen.getByTestId('member-avatar-person-alex'));

    expect(screen.getByTestId('member-avatar-person-alex')).toHaveProp('accessibilityState', {
      selected: true,
    });
    expect(screen.getByTestId('balance-context')).toHaveTextContent('Filtered to Alex');
    expect(screen.getByTestId('balance-card')).toHaveProp(
      'accessibilityLabel',
      'You are owed $20.00',
    );
  });

  it('shows the empty split state copy', () => {
    seedGroupDetail({ splits: [] });

    render(<GroupDetailScreen />);

    expect(screen.getByText('Add your first split')).toBeOnTheScreen();
  });

  it('renders split rows newest first with matching settled and open status treatments', () => {
    seedGroupDetail({
      splits: [
        makeSplit({
          id: 'split-open',
          label: 'Brunch - Tartine',
          createdAt: '2026-01-03T13:42:00.000Z',
          settlementStatus: 'open',
        }),
        makeSplit({
          id: 'split-settled',
          label: 'Coffee run',
          createdAt: '2026-01-03T10:08:00.000Z',
          totalCents: 1875,
          shares: {
            'person-you': 1875,
          },
          settlementStatus: 'settled',
          transfers: [],
        }),
      ],
    });

    render(<GroupDetailScreen />);

    expect(screen.getByTestId('split-feed')).toHaveProp(
      'accessibilityLabel',
      'Splits: Brunch - Tartine, Coffee run',
    );
    expect(screen.getByTestId('split-row-amount-split-open')).toHaveTextContent('$40.00');
    expect(screen.getByTestId('split-row-split-open')).toHaveProp(
      'className',
      expect.stringContaining('min-h-[76px]'),
    );
    expect(screen.getByTestId('split-row-split-open')).toHaveProp(
      'className',
      expect.stringContaining('rounded-[20px]'),
    );
    expect(screen.getByTestId('split-row-split-open')).toHaveProp(
      'className',
      expect.stringContaining('border-[#E5E7EB]'),
    );
    expect(screen.getByTestId('split-row-title-split-open')).toHaveTextContent('Brunch - Tartine');
    expect(screen.getByTestId('split-row-title-split-open')).toHaveProp(
      'className',
      expect.stringContaining('text-base'),
    );
    expect(screen.getByTestId('split-row-time-split-open')).toHaveProp(
      'className',
      expect.stringContaining('text-sm'),
    );
    expect(screen.getByTestId('split-row-amount-split-open')).toHaveProp(
      'className',
      expect.stringContaining('text-base'),
    );
    expect(screen.getByTestId('split-row-status-mark-split-open')).toHaveProp(
      'className',
      expect.stringContaining('h-2 w-2 rounded-full bg-warning'),
    );
    expect(screen.getByTestId('split-row-status-split-open')).toHaveProp(
      'className',
      expect.stringContaining('bg-warning-light'),
    );
    expect(screen.getByTestId('split-row-status-split-open')).toHaveProp(
      'className',
      expect.stringContaining('h-11 w-11'),
    );
    expect(screen.queryByTestId('split-row-status-label-split-open')).not.toBeOnTheScreen();
    expect(screen.getByTestId('split-row-status-mark-split-settled')).toHaveTextContent('✓');
    expect(screen.getByTestId('split-row-status-mark-split-settled')).toHaveProp(
      'className',
      expect.stringContaining('text-success'),
    );
    expect(screen.getByTestId('split-row-status-split-settled')).toHaveProp(
      'className',
      expect.stringContaining('bg-success-light'),
    );
    expect(screen.queryByTestId('split-row-status-label-split-settled')).not.toBeOnTheScreen();
  });

  it('updates balance and recomputes group status when splits change', async () => {
    seedGroupDetail({ splits: [], groupStatus: 'active' });
    render(<GroupDetailScreen />);

    let createdSplit: Split | undefined;
    act(() => {
      createdSplit = useSplitsStore.getState().createSplit({
        groupId: group.id,
        label: 'Groceries',
        totalCents: 4000,
        payerId: 'person-you',
        shares: {
          'person-you': 2000,
          'person-alex': 2000,
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance-card')).toHaveProp(
        'accessibilityLabel',
        'You are owed $20.00',
      );
    });
    expect(useGroupsStore.getState().groups[group.id]?.status).toBe('active');

    const transfer = createdSplit?.transfers?.[0];
    if (createdSplit === undefined || transfer === undefined) {
      throw new Error('Expected the created split to have a payable transfer');
    }
    const splitToSettle = createdSplit;

    act(() => {
      useSplitsStore.getState().markTransferPaid(splitToSettle.id, {
        ...transfer,
        paidAt: '2026-01-04T00:00:00.000Z',
      });
    });

    await waitFor(() => {
      expect(useGroupsStore.getState().groups[group.id]?.status).toBe('settled');
    });
  });

  it('navigates from split rows and the new split CTA', () => {
    seedGroupDetail({ splits: [makeSplit({ id: 'split-open' })] });
    render(<GroupDetailScreen />);

    fireEvent.press(screen.getByTestId('split-row-split-open'));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/group/[id]/split/[splitId]/settle',
      params: { id: group.id, splitId: 'split-open' },
    });

    fireEvent.press(screen.getByTestId('new-split-button'));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/group/[id]/split/new',
      params: { id: group.id },
    });
  });
});
