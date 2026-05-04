import '@testing-library/react-native/extend-expect';
import type { Group, Person } from '@repo/types';
import { render, screen } from '@testing-library/react-native';

import { GroupCard } from '../src/components/groups/GroupCard';

const people: Person[] = [
  {
    id: 'person-you',
    name: 'You',
    avatarColor: '#2563EB',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'person-maya',
    name: 'Maya',
    avatarColor: '#DC2626',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'person-sam',
    name: 'Sam',
    avatarColor: '#16A34A',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

function makeGroup(status: Group['status']): Group {
  return {
    id: `group-${status}`,
    name: status === 'active' ? 'Apartment' : 'Weekend Trip',
    memberIds: people.map((person) => person.id),
    createdAt: '2026-01-01T00:00:00.000Z',
    lastActivityAt: '2026-01-04T00:00:00.000Z',
    status,
  };
}

describe('GroupCard', () => {
  it('attaches the active badge to the card edge', () => {
    const group = makeGroup('active');

    render(
      <GroupCard
        group={group}
        members={people}
        activeGroupId={group.id}
        totalCents={9640}
        lastActivityLabel="Today - 1:42 PM"
      />,
    );

    const activeBadge = screen.getByTestId('group-card-active-badge');

    expect(activeBadge).toHaveProp('className', expect.stringContaining('absolute'));
    expect(activeBadge).toHaveProp('className', expect.stringContaining('top-0'));
    expect(activeBadge).toHaveProp('className', expect.stringContaining('h-5'));
    expect(activeBadge).toHaveProp('className', expect.stringContaining('w-[78px]'));
    expect(activeBadge).toHaveProp('className', expect.stringContaining('items-end'));
    expect(activeBadge).not.toHaveProp('className', expect.stringContaining('-top-2'));
    expect(screen.getByTestId('group-card-frame')).toHaveProp(
      'className',
      expect.stringContaining('pt-2.5'),
    );
    expect(screen.getByRole('button')).toHaveProp('className', expect.stringContaining('py-3'));
    expect(screen.getByRole('button')).not.toHaveProp('className', expect.stringContaining('pt-5'));
  });

  it('right-aligns the group status pill with the amount column', () => {
    render(
      <GroupCard
        group={makeGroup('active')}
        members={people}
        activeGroupId="group-other"
        totalCents={9640}
        lastActivityLabel="Today - 1:42 PM"
      />,
    );

    expect(screen.getByTestId('group-card-status-pill')).toHaveProp(
      'className',
      expect.stringContaining('self-end'),
    );
  });

  it.each([
    ['active open', makeGroup('active'), 'group-active'],
    ['inactive open', makeGroup('active'), 'group-other'],
    ['active settled', makeGroup('settled'), 'group-settled'],
    ['inactive settled', makeGroup('settled'), 'group-other'],
  ])('matches snapshot for %s state', (_label, group, activeGroupId) => {
    const { toJSON } = render(
      <GroupCard
        group={group}
        members={people}
        activeGroupId={activeGroupId}
        totalCents={9640}
        lastActivityLabel="Today - 1:42 PM"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
