import { AVATAR_PALETTE, COLORS, RADII, SPACING, TYPE_SCALE } from './theme';

describe('theme tokens', () => {
  describe('COLORS', () => {
    it('has primary color', () => {
      expect(COLORS.primary).toBeDefined();
    });

    it('has neutral palette', () => {
      expect(COLORS.neutral).toBeDefined();
      expect(typeof COLORS.neutral[0]).toBe('string');
    });

    it('has destructive color', () => {
      expect(COLORS.destructive).toBeDefined();
    });

    it('has success color', () => {
      expect(COLORS.success).toBeDefined();
    });
  });

  describe('AVATAR_PALETTE', () => {
    it('contains exactly 7 colors', () => {
      expect(AVATAR_PALETTE).toHaveLength(7);
    });

    it('every entry is a valid hex color', () => {
      for (const color of AVATAR_PALETTE) {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it('has no duplicate colors', () => {
      const set = new Set(AVATAR_PALETTE);
      expect(set.size).toBe(7);
    });
  });

  describe('SPACING', () => {
    it('has entries for common spacing values', () => {
      expect(SPACING[1]).toBe(4);
      expect(SPACING[2]).toBe(8);
      expect(SPACING[4]).toBe(16);
      expect(SPACING[6]).toBe(24);
      expect(SPACING[8]).toBe(32);
      expect(SPACING[12]).toBe(48);
    });
  });

  describe('RADII', () => {
    it('has sm, md, lg, full keys', () => {
      expect(RADII).toHaveProperty('sm');
      expect(RADII).toHaveProperty('md');
      expect(RADII).toHaveProperty('lg');
      expect(RADII).toHaveProperty('full');
    });
  });

  describe('TYPE_SCALE', () => {
    it('has heading1 through heading2 and body and small', () => {
      expect(TYPE_SCALE).toHaveProperty('heading1');
      expect(TYPE_SCALE).toHaveProperty('heading2');
      expect(TYPE_SCALE).toHaveProperty('body');
      expect(TYPE_SCALE).toHaveProperty('small');
    });

    it('each entry has className and fontFamily', () => {
      for (const scale of Object.values(TYPE_SCALE)) {
        expect(scale).toHaveProperty('className');
        expect(scale).toHaveProperty('fontFamily');
        expect(typeof scale.className).toBe('string');
        expect(typeof scale.fontFamily).toBe('string');
      }
    });
  });
});
