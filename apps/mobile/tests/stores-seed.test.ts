jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { useAppStore } from '../src/stores/app';
import { useGroupsStore } from '../src/stores/groups';
import { usePeopleStore } from '../src/stores/people';
import { DEV_GROUP_IDS, DEV_PERSON_IDS } from '../src/stores/seed';
import { useSplitsStore } from '../src/stores/splits';

describe('dev store seed data', () => {
  it('seeds people, groups, splits, and app defaults in dev builds', () => {
    expect(__DEV__).toBe(true);

    expect(Object.values(usePeopleStore.getState().people)).toHaveLength(4);
    expect(Object.values(useGroupsStore.getState().groups)).toHaveLength(2);
    expect(Object.values(useSplitsStore.getState().splits)).toHaveLength(3);
    expect(useAppStore.getState()).toMatchObject({
      activeGroupId: DEV_GROUP_IDS.apartment,
      userPersonId: DEV_PERSON_IDS.you,
      version: 1,
    });

    for (const split of Object.values(useSplitsStore.getState().splits)) {
      const sharesTotal = Object.values(split.shares).reduce((total, share) => total + share, 0);
      expect(sharesTotal).toBe(split.totalCents);
    }
  });
});
