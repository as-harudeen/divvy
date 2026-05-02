import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from './card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <Text>Card content</Text>
      </Card>,
    );
    expect(screen.getByText('Card content')).toBeOnTheScreen();
  });

  it('matches snapshot with default props', () => {
    const { toJSON } = render(
      <Card>
        <Text>Default card</Text>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot with elevated variant', () => {
    const { toJSON } = render(
      <Card variant="elevated">
        <Text>Elevated card</Text>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot with outlined variant', () => {
    const { toJSON } = render(
      <Card variant="outlined">
        <Text>Outlined card</Text>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('applies className prop', () => {
    const { toJSON } = render(
      <Card className="p-6">
        <Text>Padded card</Text>
      </Card>,
    );
    expect(toJSON()).toBeTruthy();
  });
});
