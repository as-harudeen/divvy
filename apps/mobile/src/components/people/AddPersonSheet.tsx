import type { Person } from '@repo/types';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput } from 'react-native';

import { usePeopleStore } from '../../stores/people';

const AVATAR_PALETTE = [
  '#2563EB',
  '#DC2626',
  '#16A34A',
  '#9333EA',
  '#EA580C',
  '#0891B2',
  '#CA8A04',
] as const;

interface AddPersonSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (person: Person) => void;
}

function paletteColorFor(name: string): string {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) | 0;
  }

  const paletteIndex = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[paletteIndex] ?? AVATAR_PALETTE[0];
}

export function AddPersonSheet({ visible, onClose, onAdd }: AddPersonSheetProps) {
  const [name, setName] = useState('');
  const trimmedName = name.trim().slice(0, 32);
  const canAdd = trimmedName.length > 0;
  const addPerson = usePeopleStore((state) => state.addPerson);

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }

    const person = addPerson({
      name: trimmedName,
      avatarColor: paletteColorFor(trimmedName),
    });
    setName('');
    onAdd(person);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close add person sheet"
        className="flex-1 justify-end bg-black/20"
        onPress={onClose}
      >
        <Pressable
          testID="add-person-sheet"
          className="gap-4 rounded-t-3xl bg-white px-5 pb-8 pt-5"
          onPress={(event) => event.stopPropagation()}
        >
          <Text className="text-xl font-bold text-slate-950">Add person</Text>
          <TextInput
            accessibilityLabel="First name"
            className="h-12 rounded-xl bg-slate-100 px-4 text-base text-slate-950"
            placeholder="First name"
            value={name}
            maxLength={32}
            onChangeText={setName}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add person"
            accessibilityState={{ disabled: !canAdd }}
            disabled={!canAdd}
            className="h-12 items-center justify-center rounded-xl bg-blue-600 disabled:opacity-40"
            onPress={handleAdd}
          >
            <Text className="text-base font-semibold text-white">Add</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
