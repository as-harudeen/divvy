import { equalSplit, formatCents, fromCents, sumCents, toCents } from './money';

describe('equalSplit()', () => {
  it('distributes remainder to first people: 1000 / 3 → [334, 333, 333]', () => {
    expect(equalSplit(1000, 3)).toEqual([334, 333, 333]);
  });

  it('handles odd-cents: 1 / 3 → [1, 0, 0]', () => {
    expect(equalSplit(1, 3)).toEqual([1, 0, 0]);
  });

  it('splits evenly when divisible: 10000 / 4 → [2500, 2500, 2500, 2500]', () => {
    expect(equalSplit(10000, 4)).toEqual([2500, 2500, 2500, 2500]);
  });

  it('returns all zeros for zero total: 0 / 5 → [0,0,0,0,0]', () => {
    expect(equalSplit(0, 5)).toEqual([0, 0, 0, 0, 0]);
  });

  it('returns total in single-person split: 100 / 1 → [100]', () => {
    expect(equalSplit(100, 1)).toEqual([100]);
  });
});

describe('formatCents()', () => {
  it('formats cents as currency: 9640 → "$96.40"', () => {
    expect(formatCents(9640)).toBe('$96.40');
  });

  it('formats zero: 0 → "$0.00"', () => {
    expect(formatCents(0)).toBe('$0.00');
  });

  it('supports locale and currency overrides', () => {
    expect(formatCents(9640, 'de-DE', 'EUR')).toBe('96,40 €');
  });

  it('formats negative balances for display', () => {
    expect(formatCents(-250)).toBe('-$2.50');
  });
});

describe('sumCents()', () => {
  it('sums cent values: [334, 333, 333] === 1000', () => {
    expect(sumCents([334, 333, 333])).toBe(1000);
  });
});

describe('toCents()', () => {
  it('converts dollar number to cents', () => {
    expect(toCents(96.4)).toBe(9640);
  });

  it('converts dollar string to cents', () => {
    expect(toCents('96.40')).toBe(9640);
  });

  it('converts zero', () => {
    expect(toCents(0)).toBe(0);
  });

  it('converts whole dollar amount', () => {
    expect(toCents(10)).toBe(1000);
  });

  it('preserves exact cents without floating-point rounding', () => {
    expect(toCents('12.34')).toBe(1234);
  });
});

describe('fromCents()', () => {
  it('converts cents to dollar number', () => {
    expect(fromCents(9640)).toBeCloseTo(96.4);
  });

  it('converts zero', () => {
    expect(fromCents(0)).toBe(0);
  });
});

describe('input validation', () => {
  it('equalSplit throws on non-integer totalCents', () => {
    expect(() => equalSplit(100.5, 3)).toThrow();
  });

  it('equalSplit throws on non-integer n', () => {
    expect(() => equalSplit(1000, 3.5)).toThrow();
  });

  it('formatCents throws on non-integer cents', () => {
    expect(() => formatCents(96.4)).toThrow();
  });

  it('sumCents throws on non-integer member', () => {
    expect(() => sumCents([100, 50.5])).toThrow();
  });

  it('toCents throws on negative values', () => {
    expect(() => toCents(-1)).toThrow();
  });

  it('toCents throws on malformed strings', () => {
    expect(() => toCents('12abc')).toThrow();
  });

  it('toCents throws on values with fractional cents', () => {
    expect(() => toCents('1.255')).toThrow();
    expect(() => toCents(1.005)).toThrow();
  });

  it('equalSplit throws on zero n', () => {
    expect(() => equalSplit(100, 0)).toThrow();
  });

  it('equalSplit throws on negative totals', () => {
    expect(() => equalSplit(-1, 3)).toThrow();
  });
});
