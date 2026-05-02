function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label} must be an integer, got ${value}`);
  }
}

function assertSafeInteger(value: number, label: string): void {
  assertInteger(value, label);
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${label} must be a safe integer, got ${value}`);
  }
}

function parseDollarCents(dollars: number | string): number {
  const raw = typeof dollars === 'string' ? dollars.trim() : dollars.toString();
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) {
    throw new TypeError(`toCents: invalid dollar value "${dollars}"`);
  }

  const [whole = '', fractional = ''] = raw.split('.');
  const cents = Number(`${whole}${fractional.padEnd(2, '0')}`);
  assertSafeInteger(cents, 'cents');
  return cents;
}

export function toCents(dollars: number | string): number {
  if (typeof dollars === 'number' && !Number.isFinite(dollars)) {
    throw new TypeError(`toCents: invalid dollar value "${dollars}"`);
  }
  if (typeof dollars === 'number' && dollars < 0) {
    throw new RangeError(`toCents: negative values are not allowed, got ${dollars}`);
  }
  return parseDollarCents(dollars);
}

export function fromCents(cents: number): number {
  assertSafeInteger(cents, 'cents');
  return cents / 100;
}

export function formatCents(cents: number, locale = 'en-US', currency = 'USD'): string {
  assertSafeInteger(cents, 'cents');
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function equalSplit(totalCents: number, n: number): number[] {
  assertSafeInteger(totalCents, 'totalCents');
  assertSafeInteger(n, 'n');
  if (totalCents < 0) {
    throw new RangeError(`equalSplit: totalCents must be non-negative, got ${totalCents}`);
  }
  if (n <= 0) {
    throw new RangeError(`equalSplit: n must be positive, got ${n}`);
  }

  const base = Math.floor(totalCents / n);
  const remainder = totalCents - base * n;

  const shares: number[] = [];
  for (let i = 0; i < n; i++) {
    shares.push(i < remainder ? base + 1 : base);
  }
  return shares;
}

export function sumCents(values: number[]): number {
  return values.reduce((acc, value) => {
    assertSafeInteger(value, 'cents value');
    const total = acc + value;
    assertSafeInteger(total, 'cents sum');
    return total;
  }, 0);
}
