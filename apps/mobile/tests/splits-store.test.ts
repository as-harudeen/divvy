import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Split } from '@repo/types';

import { SPLITS_STORE_NAME, useSplitsStore } from '../src/stores/splits';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const emptySplitsState = { splits: {}, version: 1 };

describe('splits store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useSplitsStore.setState(emptySplitsState);
  });

  it("throws when shares don't sum to totalCents", () => {
    expect(() =>
      useSplitsStore.getState().createSplit({
        groupId: 'group-1',
        label: 'Broken',
        totalCents: 1000,
        payerId: 'person-a',
        shares: {
          'person-a': 400,
          'person-b': 400,
        },
      }),
    ).toThrow('shares must sum to totalCents');
  });

  it('creates splits, computes transfers, and marks transfers paid', () => {
    const split = useSplitsStore.getState().createSplit({
      groupId: 'group-1',
      label: 'Lunch',
      totalCents: 3000,
      payerId: 'person-a',
      shares: {
        'person-a': 1000,
        'person-b': 1000,
        'person-c': 1000,
      },
    });

    expect(split.transfers).toEqual([
      { from: 'person-b', to: 'person-a', cents: 1000 },
      { from: 'person-c', to: 'person-a', cents: 1000 },
    ]);

    useSplitsStore.getState().markTransferPaid(split.id, {
      from: 'person-b',
      to: 'person-a',
      cents: 1000,
      paidAt: '2026-01-01T00:00:00.000Z',
    });
    const settledSplit = useSplitsStore.getState().markTransferPaid(split.id, {
      from: 'person-c',
      to: 'person-a',
      cents: 1000,
      paidAt: '2026-01-02T00:00:00.000Z',
    });

    expect(settledSplit?.settlementStatus).toBe('settled');
    expect(settledSplit?.transfers).toEqual([
      {
        from: 'person-b',
        to: 'person-a',
        cents: 1000,
        paidAt: '2026-01-01T00:00:00.000Z',
      },
      {
        from: 'person-c',
        to: 'person-a',
        cents: 1000,
        paidAt: '2026-01-02T00:00:00.000Z',
      },
    ]);
  });

  it('settles immediately when a split creates no transfers', () => {
    const split = useSplitsStore.getState().createSplit({
      groupId: 'group-1',
      label: 'Solo lunch',
      totalCents: 1000,
      payerId: 'person-a',
      shares: { 'person-a': 1000 },
    });

    expect(split.transfers).toEqual([]);
    expect(split.settlementStatus).toBe('settled');
  });

  it('selects splits by group ordered by creation time', () => {
    const newer = useSplitsStore.getState().createSplit({
      groupId: 'group-1',
      label: 'Newer',
      totalCents: 1000,
      payerId: 'person-a',
      createdAt: '2026-01-02T00:00:00.000Z',
      shares: { 'person-a': 1000 },
    });
    const older = useSplitsStore.getState().createSplit({
      groupId: 'group-1',
      label: 'Older',
      totalCents: 1000,
      payerId: 'person-a',
      createdAt: '2026-01-01T00:00:00.000Z',
      shares: { 'person-a': 1000 },
    });
    useSplitsStore.getState().createSplit({
      groupId: 'group-2',
      label: 'Other group',
      totalCents: 1000,
      payerId: 'person-a',
      shares: { 'person-a': 1000 },
    });

    expect(useSplitsStore.getState().selectByGroup('group-1')).toEqual<Split[]>([older, newer]);
  });

  it('round-trips splits through AsyncStorage rehydration', async () => {
    const split = useSplitsStore.getState().createSplit({
      groupId: 'group-1',
      label: 'Saved split',
      totalCents: 1000,
      payerId: 'person-a',
      shares: { 'person-a': 1000 },
    });

    const persistedSplits = await AsyncStorage.getItem(SPLITS_STORE_NAME);
    expect(persistedSplits).toContain(split.id);

    useSplitsStore.setState(emptySplitsState);
    if (persistedSplits !== null) {
      await AsyncStorage.setItem(SPLITS_STORE_NAME, persistedSplits);
    }

    await useSplitsStore.persist.rehydrate();

    expect(useSplitsStore.getState().splits[split.id]).toEqual(split);
  });
});
