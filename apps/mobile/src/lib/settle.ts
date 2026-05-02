import type { PersonId, Split, Transfer } from '@repo/types';

interface SettlementEntry {
  personId: PersonId;
  cents: number;
}

function assertSafeInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label} must be an integer, got ${value}`);
  }
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${label} must be a safe integer, got ${value}`);
  }
}

function comparePersonId(left: PersonId, right: PersonId): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function compareSettlementEntries(left: SettlementEntry, right: SettlementEntry): number {
  const centsDelta = right.cents - left.cents;
  if (centsDelta !== 0) {
    return centsDelta;
  }
  return comparePersonId(left.personId, right.personId);
}

function addBalance(
  balances: Record<PersonId, number>,
  personId: PersonId,
  deltaCents: number,
): void {
  assertSafeInteger(deltaCents, 'deltaCents');
  const nextBalance = (balances[personId] ?? 0) + deltaCents;
  assertSafeInteger(nextBalance, 'net balance');
  balances[personId] = nextBalance;
}

export function computeNetBalances(splits: Split[]): Record<PersonId, number> {
  const balances: Record<PersonId, number> = {};

  for (const split of splits) {
    assertSafeInteger(split.totalCents, 'split.totalCents');
    addBalance(balances, split.payerId, split.totalCents);

    for (const [personId, shareCents] of Object.entries(split.shares)) {
      assertSafeInteger(shareCents, `share for ${personId}`);
      addBalance(balances, personId, -shareCents);
    }
  }

  return balances;
}

export function settle(balances: Record<PersonId, number>): Transfer[] {
  const creditors: SettlementEntry[] = [];
  const debtors: SettlementEntry[] = [];

  for (const [personId, balanceCents] of Object.entries(balances)) {
    assertSafeInteger(balanceCents, `balance for ${personId}`);

    if (balanceCents > 0) {
      creditors.push({ personId, cents: balanceCents });
    }
    if (balanceCents < 0) {
      debtors.push({ personId, cents: -balanceCents });
    }
  }

  creditors.sort(compareSettlementEntries);
  debtors.sort(compareSettlementEntries);

  const transfers: Transfer[] = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    if (creditor === undefined || debtor === undefined) {
      break;
    }

    const cents = Math.min(creditor.cents, debtor.cents);
    transfers.push({
      from: debtor.personId,
      to: creditor.personId,
      cents,
    });

    creditor.cents -= cents;
    debtor.cents -= cents;

    if (creditor.cents === 0) {
      creditorIndex += 1;
    }
    if (debtor.cents === 0) {
      debtorIndex += 1;
    }
  }

  return transfers;
}
