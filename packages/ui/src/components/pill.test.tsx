import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';
import { Pill } from './pill';

describe('Pill', () => {
  it('renders text content', () => {
    render(<Pill>Active</Pill>);
    expect(screen.getByText('Active')).toBeOnTheScreen();
  });

  it('renders with default variant', () => {
    render(<Pill>Default</Pill>);
    expect(screen.getByText('Default')).toBeOnTheScreen();
  });

  it('renders with success variant', () => {
    render(<Pill variant="success">Paid</Pill>);
    expect(screen.getByText('Paid')).toBeOnTheScreen();
  });

  it('renders with warning variant', () => {
    render(<Pill variant="warning">Pending</Pill>);
    expect(screen.getByText('Pending')).toBeOnTheScreen();
  });

  it('renders with destructive variant', () => {
    render(<Pill variant="destructive">Overdue</Pill>);
    expect(screen.getByText('Overdue')).toBeOnTheScreen();
  });

  it('renders with info variant', () => {
    render(<Pill variant="info">New</Pill>);
    expect(screen.getByText('New')).toBeOnTheScreen();
  });

  it('matches snapshot with default variant', () => {
    const { toJSON } = render(<Pill>Default</Pill>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot with success variant', () => {
    const { toJSON } = render(<Pill variant="success">Paid</Pill>);
    expect(toJSON()).toMatchSnapshot();
  });
});
