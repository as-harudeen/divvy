import type { PersonId, Split, Transfer } from '@repo/types';

import { computeNetBalances, settle } from '../src/lib/settle';

const ids = {
  a: 'person-a',
  b: 'person-b',
  c: 'person-c',
  d: 'person-d',
} satisfies Record<string, PersonId>;

function split(overrides: {
  totalCents: number;
  payerId: PersonId;
  shares: Record<PersonId, number>;
}): Split {
  return {
    id: 'split-1',
    groupId: 'group-1',
    label: 'Dinner',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('settlement math', () => {
  it('settles 2 people when A paid $20 for both', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 2000,
        payerId: ids.a,
        shares: {
          [ids.a]: 1000,
          [ids.b]: 1000,
        },
      }),
    ]);

    expect(balances).toEqual({
      [ids.a]: 1000,
      [ids.b]: -1000,
    });
    expect(settle(balances)).toEqual<Transfer[]>([{ from: ids.b, to: ids.a, cents: 1000 }]);
  });

  it('settles a 4-person equal $40 bill paid by A', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 4000,
        payerId: ids.a,
        shares: {
          [ids.a]: 1000,
          [ids.b]: 1000,
          [ids.c]: 1000,
          [ids.d]: 1000,
        },
      }),
    ]);

    expect(settle(balances)).toEqual<Transfer[]>([
      { from: ids.b, to: ids.a, cents: 1000 },
      { from: ids.c, to: ids.a, cents: 1000 },
      { from: ids.d, to: ids.a, cents: 1000 },
    ]);
  });

  it('settles a 4-person bill with one over-payer', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 8000,
        payerId: ids.a,
        shares: {
          [ids.a]: 2000,
          [ids.b]: 2000,
          [ids.c]: 2000,
          [ids.d]: 2000,
        },
      }),
    ]);

    expect(settle(balances)).toEqual<Transfer[]>([
      { from: ids.b, to: ids.a, cents: 2000 },
      { from: ids.c, to: ids.a, cents: 2000 },
      { from: ids.d, to: ids.a, cents: 2000 },
    ]);
  });

  it('settles a 4-person $80 bill with A and B paying different amounts', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 3000,
        payerId: ids.a,
        shares: {
          [ids.a]: 750,
          [ids.b]: 750,
          [ids.c]: 750,
          [ids.d]: 750,
        },
      }),
      split({
        totalCents: 5000,
        payerId: ids.b,
        shares: {
          [ids.a]: 1250,
          [ids.b]: 1250,
          [ids.c]: 1250,
          [ids.d]: 1250,
        },
      }),
    ]);

    expect(balances).toEqual({
      [ids.a]: 1000,
      [ids.b]: 3000,
      [ids.c]: -2000,
      [ids.d]: -2000,
    });
    expect(settle(balances)).toEqual<Transfer[]>([
      { from: ids.c, to: ids.b, cents: 2000 },
      { from: ids.d, to: ids.b, cents: 1000 },
      { from: ids.d, to: ids.a, cents: 1000 },
    ]);
  });

  it('returns no transfers when everyone paid their own share', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 1000,
        payerId: ids.a,
        shares: { [ids.a]: 1000 },
      }),
      split({
        totalCents: 1000,
        payerId: ids.b,
        shares: { [ids.b]: 1000 },
      }),
    ]);

    expect(settle(balances)).toEqual([]);
  });

  it('settles odd cents cleanly for $10.01 split by 3', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 1001,
        payerId: ids.a,
        shares: {
          [ids.a]: 334,
          [ids.b]: 334,
          [ids.c]: 333,
        },
      }),
    ]);

    expect(settle(balances)).toEqual<Transfer[]>([
      { from: ids.b, to: ids.a, cents: 334 },
      { from: ids.c, to: ids.a, cents: 333 },
    ]);
  });

  it('settles when one person owes multiple creditors', () => {
    expect(
      settle({
        [ids.a]: 2500,
        [ids.b]: 1500,
        [ids.c]: -4000,
      }),
    ).toEqual<Transfer[]>([
      { from: ids.c, to: ids.a, cents: 2500 },
      { from: ids.c, to: ids.b, cents: 1500 },
    ]);
  });

  it('settles when the payer is excluded from the share', () => {
    const balances = computeNetBalances([
      split({
        totalCents: 3000,
        payerId: ids.a,
        shares: {
          [ids.b]: 1500,
          [ids.c]: 1500,
        },
      }),
    ]);

    expect(balances).toEqual({
      [ids.a]: 3000,
      [ids.b]: -1500,
      [ids.c]: -1500,
    });
    expect(settle(balances)).toEqual<Transfer[]>([
      { from: ids.b, to: ids.a, cents: 1500 },
      { from: ids.c, to: ids.a, cents: 1500 },
    ]);
  });

  it('orders ties deterministically by person id', () => {
    expect(
      settle({
        [ids.d]: -1000,
        [ids.b]: -1000,
        [ids.c]: 1000,
        [ids.a]: 1000,
      }),
    ).toEqual<Transfer[]>([
      { from: ids.b, to: ids.a, cents: 1000 },
      { from: ids.d, to: ids.c, cents: 1000 },
    ]);
  });

  it('does not mutate splits or balances', () => {
    const splits = [
      split({
        totalCents: 2000,
        payerId: ids.a,
        shares: {
          [ids.a]: 1000,
          [ids.b]: 1000,
        },
      }),
    ];
    const balances = { [ids.a]: 1000, [ids.b]: -1000 };
    const splitsBefore = JSON.stringify(splits);
    const balancesBefore = JSON.stringify(balances);

    computeNetBalances(splits);
    settle(balances);

    expect(JSON.stringify(splits)).toBe(splitsBefore);
    expect(JSON.stringify(balances)).toBe(balancesBefore);
  });
});
