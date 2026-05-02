import '@testing-library/react-native/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { NumPad } from './numpad';

describe('NumPad', () => {
  it('renders digits 0-9', () => {
    render(<NumPad onDigitPress={() => {}} onBackspace={() => {}} />);
    for (const digit of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
      expect(screen.getByText(digit)).toBeOnTheScreen();
    }
  });

  it('renders a backspace key', () => {
    render(<NumPad onDigitPress={() => {}} onBackspace={() => {}} />);
    expect(screen.getByLabelText('Backspace')).toBeOnTheScreen();
  });

  it('calls onDigitPress with the digit string when a digit is pressed', () => {
    const handleDigit = jest.fn();
    render(<NumPad onDigitPress={handleDigit} onBackspace={() => {}} />);
    fireEvent.press(screen.getByText('7'));
    expect(handleDigit).toHaveBeenCalledWith('7');
  });

  it('calls onBackspace when the backspace key is pressed', () => {
    const handleBackspace = jest.fn();
    render(<NumPad onDigitPress={() => {}} onBackspace={handleBackspace} />);
    fireEvent.press(screen.getByLabelText('Backspace'));
    expect(handleBackspace).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<NumPad onDigitPress={() => {}} onBackspace={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
