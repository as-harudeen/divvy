import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { Person } from '@repo/types';
import { AVATAR_PALETTE } from '@repo/ui';
import { cn } from '@repo/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { usePeopleStore } from '../../stores/people';

interface AddPersonSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (person: Person) => void;
}

function paletteColorForId(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0;
  }

  const paletteIndex = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[paletteIndex] ?? AVATAR_PALETTE[0];
}

function initialForName(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export function AddPersonSheet({ visible, onClose, onAdd }: AddPersonSheetProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const hasPresentedRef = useRef(false);
  const [name, setName] = useState('');
  const [draftPersonId, setDraftPersonId] = useState<string | null>(null);
  const [selectedAvatarColor, setSelectedAvatarColor] = useState<string>(AVATAR_PALETTE[0]);
  const trimmedName = name.trim().slice(0, 32);
  const canAdd = trimmedName.length > 0;
  const addPerson = usePeopleStore((state) => state.addPerson);
  const snapPoints = useMemo(() => ['46%'], []);

  useEffect(() => {
    if (visible) {
      const nextPersonId = nanoid();

      setDraftPersonId(nextPersonId);
      setSelectedAvatarColor(paletteColorForId(nextPersonId));
      hasPresentedRef.current = true;
      modalRef.current?.present();
      return;
    }

    if (hasPresentedRef.current) {
      modalRef.current?.dismiss();
    }
  }, [visible]);

  const resetDraft = useCallback(() => {
    setName('');
    setDraftPersonId(null);
  }, []);

  const handleDismiss = useCallback(() => {
    hasPresentedRef.current = false;
    resetDraft();
    onClose();
  }, [onClose, resetDraft]);

  const dismissSheet = useCallback(() => {
    modalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        accessibilityLabel="Dismiss add person sheet"
        accessibilityRole="button"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
        onPress={dismissSheet}
      />
    ),
    [dismissSheet],
  );

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }

    const personId = draftPersonId ?? nanoid();
    const person = addPerson({
      id: personId,
      name: trimmedName,
      avatarColor: selectedAvatarColor,
    });

    onAdd(person);
    dismissSheet();
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF', borderRadius: 24 }}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1', width: 28 }}
      android_keyboardInputMode="adjustPan"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={handleDismiss}
      snapPoints={snapPoints}
    >
      <BottomSheetView testID="add-person-sheet" className="gap-4 px-4 pb-6 pt-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-950">Add person</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close add person sheet"
            className="px-1 py-2"
            onPress={dismissSheet}
          >
            <Text className="text-xs font-medium text-slate-500">Close</Text>
          </Pressable>
        </View>

        <View className="gap-1">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Name</Text>
          <View className="h-12 flex-row items-center gap-2 rounded-lg border border-slate-950 bg-white px-2">
            <View
              accessibilityRole="image"
              accessibilityLabel="Avatar preview"
              testID="add-person-avatar-preview"
              className="h-7 w-7 items-center justify-center rounded-full"
              style={{ backgroundColor: selectedAvatarColor }}
            >
              <Text className="text-xs font-bold text-white">{initialForName(trimmedName)}</Text>
            </View>
            <BottomSheetTextInput
              accessibilityLabel="First name"
              autoFocus
              className="h-10 flex-1 text-base text-slate-950"
              maxLength={32}
              placeholder="Riley"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>
          <Text className="text-[9px] font-medium text-slate-400">
            First name only - keep it short. No phone or email needed.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Avatar color
          </Text>
          <View className="flex-row items-center gap-2">
            {AVATAR_PALETTE.map((color, index) => {
              const selected = color === selectedAvatarColor;
              return (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`Avatar color ${index + 1}`}
                  accessibilityState={{ selected }}
                  testID={`avatar-color-swatch-${index}`}
                  className={cn(
                    'h-6 w-6 items-center justify-center rounded-full',
                    selected && 'border-2 border-blue-600',
                  )}
                  onPress={() => setSelectedAvatarColor(color)}
                >
                  <View
                    className="h-5 w-5 rounded-full border border-white"
                    style={{ backgroundColor: color }}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add to group"
          accessibilityState={{ disabled: !canAdd }}
          disabled={!canAdd}
          className={cn(
            'h-12 overflow-hidden rounded-lg active:opacity-90',
            !canAdd && 'opacity-40',
          )}
          onPress={handleAdd}
        >
          <LinearGradient
            colors={canAdd ? ['#2563EB', '#4F46E5', '#7C3AED'] : ['#94A3B8', '#94A3B8']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text className="text-sm font-bold text-white">Add to group</Text>
          </LinearGradient>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
