import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GroupId, PersonId, SettlementStatus, Split, SplitId, Transfer } from '@repo/types';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { computeNetBalances, settle } from '../lib/settle';
import { DEV_SPLITS } from './seed';

export const SPLITS_STORE_NAME = 'divvy:splits';
export const SPLITS_STORE_VERSION = 1;

interface SplitsData {
  splits: Record<SplitId, Split>;
  version: number;
}

interface CreateSplitInput {
  groupId: GroupId;
  label: string;
  totalCents: number;
  payerId: PersonId;
  shares: Record<PersonId, number>;
  id?: SplitId;
  createdAt?: string;
  settlementStatus?: SettlementStatus;
  transfers?: Transfer[];
}

type MarkTransferPaidInput = Omit<Transfer, 'paidAt'> & {
  paidAt?: string;
};

interface SplitsStore extends SplitsData {
  createSplit: (input: CreateSplitInput) => Split;
  markTransferPaid: (splitId: SplitId, transfer: MarkTransferPaidInput) => Split | undefined;
  selectByGroup: (groupId: GroupId) => Split[];
}

function createInitialSplitsData(): SplitsData {
  return {
    splits: __DEV__ ? DEV_SPLITS : {},
    version: SPLITS_STORE_VERSION,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTransfer(value: unknown): value is Transfer {
  return (
    isRecord(value) &&
    typeof value.from === 'string' &&
    typeof value.to === 'string' &&
    typeof value.cents === 'number' &&
    (value.paidAt === undefined || typeof value.paidAt === 'string')
  );
}

function isSplit(value: unknown): value is Split {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.groupId === 'string' &&
    typeof value.label === 'string' &&
    typeof value.totalCents === 'number' &&
    typeof value.payerId === 'string' &&
    typeof value.createdAt === 'string' &&
    isRecord(value.shares) &&
    Object.values(value.shares).every((share) => typeof share === 'number') &&
    (value.settlementStatus === undefined ||
      value.settlementStatus === 'open' ||
      value.settlementStatus === 'settled') &&
    (value.transfers === undefined ||
      (Array.isArray(value.transfers) && value.transfers.every(isTransfer)))
  );
}

function assertSafeCents(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label} must be an integer number of cents`);
  }
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${label} must be a safe integer`);
  }
}

function assertSharesTotal(totalCents: number, shares: Record<PersonId, number>): void {
  assertSafeCents(totalCents, 'totalCents');

  let sharesTotal = 0;
  for (const [personId, shareCents] of Object.entries(shares)) {
    assertSafeCents(shareCents, `share for ${personId}`);
    sharesTotal += shareCents;
    assertSafeCents(sharesTotal, 'shares total');
  }

  if (sharesTotal !== totalCents) {
    throw new RangeError(
      `shares must sum to totalCents: expected ${totalCents}, got ${sharesTotal}`,
    );
  }
}

function splitMatchesTransfer(splitTransfer: Transfer, transfer: MarkTransferPaidInput): boolean {
  return (
    splitTransfer.from === transfer.from &&
    splitTransfer.to === transfer.to &&
    splitTransfer.cents === transfer.cents
  );
}

function hasPendingTransfer(transfers: Transfer[] | undefined): boolean {
  return transfers?.some((transfer) => transfer.paidAt === undefined) ?? false;
}

function migrateSplitsStore(persistedState: unknown): SplitsData {
  if (!isRecord(persistedState) || !isRecord(persistedState.splits)) {
    return createInitialSplitsData();
  }

  const splits: Record<SplitId, Split> = {};
  for (const [id, split] of Object.entries(persistedState.splits)) {
    if (isSplit(split)) {
      splits[id] = split;
    }
  }

  return {
    splits,
    version: SPLITS_STORE_VERSION,
  };
}

function persistSplitsData(state: SplitsStore): SplitsData {
  return {
    splits: state.splits,
    version: state.version,
  };
}

export const useSplitsStore = create<SplitsStore>()(
  persist(
    (set, get) => ({
      ...createInitialSplitsData(),
      createSplit: (input) => {
        assertSharesTotal(input.totalCents, input.shares);

        const settlementStatus: SettlementStatus = input.settlementStatus ?? 'open';
        const splitBase: Split = {
          id: input.id ?? nanoid(),
          groupId: input.groupId,
          label: input.label,
          totalCents: input.totalCents,
          payerId: input.payerId,
          createdAt: input.createdAt ?? new Date().toISOString(),
          shares: input.shares,
          settlementStatus,
        };
        const transfers = input.transfers ?? settle(computeNetBalances([splitBase]));
        const split: Split = {
          ...splitBase,
          transfers,
          settlementStatus: hasPendingTransfer(transfers) ? 'open' : 'settled',
        };

        set((state) => ({
          splits: {
            ...state.splits,
            [split.id]: split,
          },
          version: SPLITS_STORE_VERSION,
        }));

        return split;
      },
      markTransferPaid: (splitId, transfer) => {
        const split = get().splits[splitId];
        if (split === undefined) {
          return undefined;
        }

        const paidAt = transfer.paidAt ?? new Date().toISOString();
        const nextTransfers = (split.transfers ?? []).map((splitTransfer) =>
          splitMatchesTransfer(splitTransfer, transfer)
            ? { ...splitTransfer, paidAt }
            : splitTransfer,
        );
        const nextSplit: Split = {
          ...split,
          transfers: nextTransfers,
          settlementStatus: hasPendingTransfer(nextTransfers) ? 'open' : 'settled',
        };

        set((state) => ({
          splits: {
            ...state.splits,
            [splitId]: nextSplit,
          },
          version: SPLITS_STORE_VERSION,
        }));

        return nextSplit;
      },
      selectByGroup: (groupId) =>
        Object.values(get().splits)
          .filter((split) => split.groupId === groupId)
          .sort(
            (left, right) =>
              left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
          ),
    }),
    {
      name: SPLITS_STORE_NAME,
      storage: createJSONStorage<SplitsData>(() => AsyncStorage),
      version: SPLITS_STORE_VERSION,
      migrate: migrateSplitsStore,
      partialize: persistSplitsData,
    },
  ),
);
