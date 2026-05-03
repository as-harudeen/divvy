import type { Group, GroupId, Person, PersonId, Split, SplitId } from '@repo/types';

export const DEV_PERSON_IDS = {
  you: 'person-you',
  maya: 'person-maya',
  sam: 'person-sam',
  noor: 'person-noor',
} satisfies Record<string, PersonId>;

export const DEV_GROUP_IDS = {
  apartment: 'group-apartment',
  trip: 'group-trip',
} satisfies Record<string, GroupId>;

export const DEV_SPLIT_IDS = {
  groceries: 'split-groceries',
  dinner: 'split-dinner',
  rideshare: 'split-rideshare',
} satisfies Record<string, SplitId>;

const seedCreatedAt = '2026-01-01T00:00:00.000Z';

export const DEV_PEOPLE: Record<PersonId, Person> = {
  [DEV_PERSON_IDS.you]: {
    id: DEV_PERSON_IDS.you,
    name: 'You',
    avatarColor: '#2563EB',
    createdAt: seedCreatedAt,
  },
  [DEV_PERSON_IDS.maya]: {
    id: DEV_PERSON_IDS.maya,
    name: 'Maya',
    avatarColor: '#DC2626',
    createdAt: seedCreatedAt,
  },
  [DEV_PERSON_IDS.sam]: {
    id: DEV_PERSON_IDS.sam,
    name: 'Sam',
    avatarColor: '#16A34A',
    createdAt: seedCreatedAt,
  },
  [DEV_PERSON_IDS.noor]: {
    id: DEV_PERSON_IDS.noor,
    name: 'Noor',
    avatarColor: '#9333EA',
    createdAt: seedCreatedAt,
  },
};

export const DEV_GROUPS: Record<GroupId, Group> = {
  [DEV_GROUP_IDS.apartment]: {
    id: DEV_GROUP_IDS.apartment,
    name: 'Apartment',
    memberIds: [DEV_PERSON_IDS.you, DEV_PERSON_IDS.maya],
    createdAt: seedCreatedAt,
    lastActivityAt: '2026-01-03T00:00:00.000Z',
    status: 'active',
  },
  [DEV_GROUP_IDS.trip]: {
    id: DEV_GROUP_IDS.trip,
    name: 'Weekend Trip',
    memberIds: [DEV_PERSON_IDS.you, DEV_PERSON_IDS.sam, DEV_PERSON_IDS.noor],
    createdAt: seedCreatedAt,
    lastActivityAt: '2026-01-04T00:00:00.000Z',
    status: 'active',
  },
};

export const DEV_SPLITS: Record<SplitId, Split> = {
  [DEV_SPLIT_IDS.groceries]: {
    id: DEV_SPLIT_IDS.groceries,
    groupId: DEV_GROUP_IDS.apartment,
    label: 'Groceries',
    totalCents: 4200,
    payerId: DEV_PERSON_IDS.you,
    createdAt: '2026-01-02T00:00:00.000Z',
    shares: {
      [DEV_PERSON_IDS.you]: 2100,
      [DEV_PERSON_IDS.maya]: 2100,
    },
    settlementStatus: 'open',
    transfers: [{ from: DEV_PERSON_IDS.maya, to: DEV_PERSON_IDS.you, cents: 2100 }],
  },
  [DEV_SPLIT_IDS.dinner]: {
    id: DEV_SPLIT_IDS.dinner,
    groupId: DEV_GROUP_IDS.trip,
    label: 'Dinner',
    totalCents: 6000,
    payerId: DEV_PERSON_IDS.sam,
    createdAt: '2026-01-03T00:00:00.000Z',
    shares: {
      [DEV_PERSON_IDS.you]: 2000,
      [DEV_PERSON_IDS.sam]: 2000,
      [DEV_PERSON_IDS.noor]: 2000,
    },
    settlementStatus: 'open',
    transfers: [
      { from: DEV_PERSON_IDS.you, to: DEV_PERSON_IDS.sam, cents: 2000 },
      { from: DEV_PERSON_IDS.noor, to: DEV_PERSON_IDS.sam, cents: 2000 },
    ],
  },
  [DEV_SPLIT_IDS.rideshare]: {
    id: DEV_SPLIT_IDS.rideshare,
    groupId: DEV_GROUP_IDS.trip,
    label: 'Rideshare',
    totalCents: 1800,
    payerId: DEV_PERSON_IDS.noor,
    createdAt: '2026-01-04T00:00:00.000Z',
    shares: {
      [DEV_PERSON_IDS.you]: 600,
      [DEV_PERSON_IDS.sam]: 600,
      [DEV_PERSON_IDS.noor]: 600,
    },
    settlementStatus: 'open',
    transfers: [
      { from: DEV_PERSON_IDS.you, to: DEV_PERSON_IDS.noor, cents: 600 },
      { from: DEV_PERSON_IDS.sam, to: DEV_PERSON_IDS.noor, cents: 600 },
    ],
  },
};
