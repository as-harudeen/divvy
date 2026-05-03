import AsyncStorage from '@react-native-async-storage/async-storage';

import { GROUPS_STORE_NAME, useGroupsStore } from '../src/stores/groups';
import { useSplitsStore } from '../src/stores/splits';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const emptyGroupsState = { groups: {}, version: 1 };
const emptySplitsState = { splits: {}, version: 1 };

describe('groups store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useGroupsStore.setState(emptyGroupsState);
    useSplitsStore.setState(emptySplitsState);
  });

  it('creates groups and manages unique members', () => {
    const group = useGroupsStore.getState().createGroup({
      name: 'Weekend',
      memberIds: ['person-a'],
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    useGroupsStore.getState().addMember(group.id, 'person-b');
    useGroupsStore.getState().addMember(group.id, 'person-b');
    useGroupsStore.getState().removeMember(group.id, 'person-a');

    expect(useGroupsStore.getState().groups[group.id]).toMatchObject({
      id: group.id,
      name: 'Weekend',
      memberIds: ['person-b'],
      createdAt: '2026-01-01T00:00:00.000Z',
      status: 'active',
    });
  });

  it('recomputes group status from split settlement status', () => {
    const group = useGroupsStore.getState().createGroup({
      name: 'Trip',
      memberIds: ['person-a', 'person-b'],
    });

    useSplitsStore.getState().createSplit({
      groupId: group.id,
      label: 'Lunch',
      totalCents: 2000,
      payerId: 'person-a',
      shares: {
        'person-a': 1000,
        'person-b': 1000,
      },
      settlementStatus: 'open',
    });

    expect(useGroupsStore.getState().recomputeStatus(group.id)).toBe('active');

    const split = useSplitsStore.getState().selectByGroup(group.id)[0];
    expect(split).toBeDefined();

    if (split !== undefined) {
      useSplitsStore.getState().markTransferPaid(split.id, {
        from: 'person-b',
        to: 'person-a',
        cents: 1000,
      });
    }

    expect(useGroupsStore.getState().recomputeStatus(group.id)).toBe('settled');
    expect(useGroupsStore.getState().groups[group.id]?.status).toBe('settled');
  });

  it('treats groups with only no-transfer splits as settled', () => {
    const group = useGroupsStore.getState().createGroup({
      name: 'Solo',
      memberIds: ['person-a'],
    });

    useSplitsStore.getState().createSplit({
      groupId: group.id,
      label: 'Solo lunch',
      totalCents: 1000,
      payerId: 'person-a',
      shares: { 'person-a': 1000 },
    });

    expect(useGroupsStore.getState().recomputeStatus(group.id)).toBe('settled');
  });

  it('round-trips groups through AsyncStorage rehydration', async () => {
    const group = useGroupsStore.getState().createGroup({
      name: 'Saved Group',
      memberIds: ['person-a'],
    });

    const persistedGroups = await AsyncStorage.getItem(GROUPS_STORE_NAME);
    expect(persistedGroups).toContain(group.id);

    useGroupsStore.setState(emptyGroupsState);
    if (persistedGroups !== null) {
      await AsyncStorage.setItem(GROUPS_STORE_NAME, persistedGroups);
    }

    await useGroupsStore.persist.rehydrate();

    expect(useGroupsStore.getState().groups[group.id]).toEqual(group);
  });
});
