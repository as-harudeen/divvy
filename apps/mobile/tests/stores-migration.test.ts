import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Group, Split } from '@repo/types';

import { APP_STORE_NAME, useAppStore } from '../src/stores/app';
import { GROUPS_STORE_NAME, useGroupsStore } from '../src/stores/groups';
import { SPLITS_STORE_NAME, useSplitsStore } from '../src/stores/splits';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const emptyAppState = { activeGroupId: null, userPersonId: null, version: 1 };
const emptyGroupsState = { groups: {}, version: 1 };
const emptySplitsState = { splits: {}, version: 1 };

describe('store migrations', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAppStore.setState(emptyAppState);
    useGroupsStore.setState(emptyGroupsState);
    useSplitsStore.setState(emptySplitsState);
  });

  it('loads version 0 app data into the version 1 store', async () => {
    await AsyncStorage.setItem(
      APP_STORE_NAME,
      JSON.stringify({
        state: {
          activeGroupId: 'group-legacy',
          userPersonId: 'person-legacy',
          version: 0,
        },
        version: 0,
      }),
    );

    await useAppStore.persist.rehydrate();

    expect(useAppStore.getState()).toMatchObject({
      activeGroupId: 'group-legacy',
      userPersonId: 'person-legacy',
      version: 1,
    });
  });

  it('loads version 0 group data into the version 1 store', async () => {
    const legacyGroup: Group = {
      id: 'group-legacy',
      name: 'Legacy Group',
      memberIds: ['person-a', 'person-b'],
      createdAt: '2026-01-01T00:00:00.000Z',
      lastActivityAt: '2026-01-02T00:00:00.000Z',
      status: 'active',
    };

    await AsyncStorage.setItem(
      GROUPS_STORE_NAME,
      JSON.stringify({
        state: {
          groups: {
            [legacyGroup.id]: legacyGroup,
          },
          version: 0,
        },
        version: 0,
      }),
    );

    await useGroupsStore.persist.rehydrate();

    expect(useGroupsStore.getState().version).toBe(1);
    expect(useGroupsStore.getState().groups[legacyGroup.id]).toEqual(legacyGroup);
  });

  it('loads version 0 split data into the version 1 store', async () => {
    const legacySplit: Split = {
      id: 'split-legacy',
      groupId: 'group-legacy',
      label: 'Legacy Split',
      totalCents: 2000,
      payerId: 'person-a',
      createdAt: '2026-01-01T00:00:00.000Z',
      shares: {
        'person-a': 1000,
        'person-b': 1000,
      },
      settlementStatus: 'open',
      transfers: [{ from: 'person-b', to: 'person-a', cents: 1000 }],
    };

    await AsyncStorage.setItem(
      SPLITS_STORE_NAME,
      JSON.stringify({
        state: {
          splits: {
            [legacySplit.id]: legacySplit,
          },
          version: 0,
        },
        version: 0,
      }),
    );

    await useSplitsStore.persist.rehydrate();

    expect(useSplitsStore.getState().version).toBe(1);
    expect(useSplitsStore.getState().splits[legacySplit.id]).toEqual(legacySplit);
  });
});
