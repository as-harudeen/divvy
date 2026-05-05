import '@testing-library/react-native/extend-expect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Person } from '@repo/types';
import { AVATAR_PALETTE } from '@repo/ui';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type React from 'react';

import { AddPersonSheet } from '../src/components/people/AddPersonSheet';
import { usePeopleStore } from '../src/stores/people';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockNanoid = jest.fn<string, []>();
const mockPresentModal = jest.fn<void, []>();
const mockDismissModal = jest.fn<void, []>();

jest.mock('nanoid/non-secure', () => ({
  nanoid: () => mockNanoid(),
}));

type MockBottomSheetModalHandle = {
  present: () => void;
  dismiss: () => void;
};

type MockBottomSheetModalProps = {
  children?: React.ReactNode;
  bottomInset?: number;
  backdropComponent?: (props: Record<string, unknown>) => React.ReactNode;
  keyboardBehavior?: string;
  keyboardBlurBehavior?: string;
  android_keyboardInputMode?: string;
  onDismiss?: () => void;
};

type MockBottomSheetViewProps = {
  children?: React.ReactNode;
  testID?: string;
};

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { Pressable, TextInput, View } = require('react-native');

  const BottomSheetModal = React.forwardRef(
    (
      {
        children,
        backdropComponent: BackdropComponent,
        onDismiss,
        ...modalProps
      }: MockBottomSheetModalProps,
      ref: React.Ref<MockBottomSheetModalHandle>,
    ) => {
      const [presented, setPresented] = React.useState(false);

      React.useImperativeHandle(ref, () => ({
        present: () => {
          mockPresentModal();
          setPresented(true);
        },
        dismiss: () => {
          mockDismissModal();
          setPresented(false);
          onDismiss?.();
        },
      }));

      if (!presented) {
        return null;
      }

      return (
        <View
          testID="mock-bottom-sheet-modal"
          bottomInset={modalProps.bottomInset}
          keyboardBehavior={modalProps.keyboardBehavior}
          keyboardBlurBehavior={modalProps.keyboardBlurBehavior}
          android_keyboardInputMode={modalProps.android_keyboardInputMode}
        >
          {BackdropComponent?.({})}
          <View testID="mock-bottom-sheet-content">{children}</View>
        </View>
      );
    },
  );

  const BottomSheetBackdrop = ({ onPress }: { onPress?: () => void }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Dismiss add person sheet"
      testID="add-person-backdrop"
      onPress={onPress}
    />
  );

  const BottomSheetView = ({ children, testID }: MockBottomSheetViewProps) => (
    <View testID={testID ?? 'mock-bottom-sheet-view'}>{children}</View>
  );

  const BottomSheetModalProvider = ({ children }: { children?: React.ReactNode }) => (
    <View testID="mock-bottom-sheet-provider">{children}</View>
  );

  const BottomSheetTextInput = (props: React.ComponentProps<typeof TextInput>) => (
    <TextInput {...props} testID={props.testID ?? 'bottom-sheet-text-input'} />
  );

  return {
    __esModule: true,
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetTextInput,
    BottomSheetView,
  };
});

const emptyPeopleState = { people: {}, version: 1 };

function avatarColorForId(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0;
  }

  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0];
}

function renderSheet(props?: Partial<{ onAdd: (person: Person) => void; onClose: () => void }>) {
  const onAdd = props?.onAdd ?? jest.fn<void, [Person]>();
  const onClose = props?.onClose ?? jest.fn<void, []>();

  const view = render(<AddPersonSheet visible onAdd={onAdd} onClose={onClose} />);

  return { ...view, onAdd, onClose };
}

describe('AddPersonSheet', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    mockNanoid.mockReset();
    mockNanoid.mockReturnValue('person-fixed');
    mockPresentModal.mockClear();
    mockDismissModal.mockClear();
    usePeopleStore.setState(emptyPeopleState);
  });

  it('does not dismiss the modal before it has been opened', () => {
    const onAdd = jest.fn<void, [Person]>();
    const onClose = jest.fn<void, []>();

    render(<AddPersonSheet visible={false} onAdd={onAdd} onClose={onClose} />);

    expect(mockPresentModal).not.toHaveBeenCalled();
    expect(mockDismissModal).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('uses bottom-sheet interactive keyboard handling without adding a keyboard bottom inset', () => {
    renderSheet();

    expect(screen.getByTestId('mock-bottom-sheet-modal').props.bottomInset).toBeUndefined();
    expect(screen.getByTestId('mock-bottom-sheet-modal')).toHaveProp(
      'keyboardBehavior',
      'interactive',
    );
    expect(screen.getByTestId('mock-bottom-sheet-modal')).toHaveProp(
      'android_keyboardInputMode',
      'adjustPan',
    );
    expect(screen.getByTestId('mock-bottom-sheet-modal')).toHaveProp(
      'keyboardBlurBehavior',
      'restore',
    );
    expect(screen.getByTestId('bottom-sheet-text-input')).toHaveProp(
      'accessibilityLabel',
      'First name',
    );
  });

  it('keeps add disabled when the first name is empty or whitespace', () => {
    renderSheet();

    const addButton = screen.getByLabelText('Add to group');
    expect(addButton).toHaveProp('accessibilityState', { disabled: true });

    fireEvent.changeText(screen.getByLabelText('First name'), '   ');
    expect(addButton).toHaveProp('accessibilityState', { disabled: true });

    fireEvent.changeText(screen.getByLabelText('First name'), ' Riley ');
    expect(addButton).toHaveProp('accessibilityState', { disabled: false });
  });

  it('assigns avatar color deterministically from the generated person id', () => {
    const expectedColor = avatarColorForId('person-fixed');
    const firstSheet = renderSheet();

    fireEvent.changeText(screen.getByLabelText('First name'), 'Riley');
    fireEvent.press(screen.getByLabelText('Add to group'));

    expect(firstSheet.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ avatarColor: expectedColor }),
    );

    firstSheet.unmount();

    const secondSheet = renderSheet();

    fireEvent.changeText(screen.getByLabelText('First name'), 'Morgan');
    fireEvent.press(screen.getByLabelText('Add to group'));

    expect(secondSheet.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ avatarColor: expectedColor }),
    );
  });

  it('appends the trimmed person to the people store and returns it to the caller', () => {
    mockNanoid.mockReturnValue('person-riley');
    const expectedColor = avatarColorForId('person-riley');
    const sheet = renderSheet();

    fireEvent.changeText(screen.getByLabelText('First name'), '  Riley  ');
    fireEvent.press(screen.getByLabelText('Add to group'));

    const storedPerson = usePeopleStore.getState().people['person-riley'];

    expect(storedPerson).toMatchObject({
      id: 'person-riley',
      name: 'Riley',
      avatarColor: expectedColor,
    });
    expect(sheet.onAdd).toHaveBeenCalledWith(storedPerson);
  });

  it('closes after adding and dismisses without saving from the backdrop', () => {
    mockNanoid.mockReturnValue('person-riley');
    const sheet = renderSheet();

    fireEvent.changeText(screen.getByLabelText('First name'), 'Riley');
    fireEvent.press(screen.getByLabelText('Add to group'));

    expect(sheet.onClose).toHaveBeenCalledTimes(1);
    expect(sheet.onAdd).toHaveBeenCalledTimes(1);

    sheet.unmount();

    const backdropSheet = renderSheet();

    fireEvent.press(screen.getByTestId('add-person-backdrop'));

    expect(backdropSheet.onClose).toHaveBeenCalledTimes(1);
    expect(backdropSheet.onAdd).not.toHaveBeenCalled();
  });
});
