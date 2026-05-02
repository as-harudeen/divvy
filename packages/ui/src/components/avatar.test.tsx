import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AVATAR_PALETTE } from '../theme';
import { Avatar, avatarColorForId } from './avatar';

describe('Avatar', () => {
  it('renders initials from name prop', () => {
    render(<Avatar name="Alice" id="a1" />);
    expect(screen.getByText('A')).toBeOnTheScreen();
  });

  it('renders up to 2 initials for multi-word names', () => {
    render(<Avatar name="Alice Bob" id="a2" />);
    expect(screen.getByText('AB')).toBeOnTheScreen();
  });

  it('renders first initial for single character name', () => {
    render(<Avatar name="Z" id="z1" />);
    expect(screen.getByText('Z')).toBeOnTheScreen();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<Avatar name="Charlie" id="c1" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('accepts className override', () => {
    const { toJSON } = render(<Avatar name="Dana" id="d1" className="h-16 w-16" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders children when provided instead of name', () => {
    render(
      <Avatar name="Eve" id="e1">
        <Text>Custom</Text>
      </Avatar>,
    );
    expect(screen.getByText('Custom')).toBeOnTheScreen();
  });
});

describe('avatarColorForId', () => {
  it('returns a color from the palette for any string id', () => {
    const color = avatarColorForId('some-id');
    expect(AVATAR_PALETTE).toContain(color);
  });

  it('is deterministic — same id always yields same color', () => {
    const first = avatarColorForId('user-42');
    const second = avatarColorForId('user-42');
    expect(first).toBe(second);
  });

  it('different ids can produce different colors', () => {
    const colors = new Set<string>();
    for (let i = 0; i < 7; i++) {
      colors.add(avatarColorForId(`id-${i}`));
    }
    expect(colors.size).toBeGreaterThan(1);
  });
});
