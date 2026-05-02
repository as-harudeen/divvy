import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { cn } from '@repo/utils';
import * as React from 'react';
import { Pressable, Text, type View as ViewRef } from 'react-native';

export interface BottomSheetTriggerProps {
  triggerLabel: string;
  snapPoints?: string[];
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetTrigger = React.forwardRef<ViewRef, BottomSheetTriggerProps>(
  ({ triggerLabel, snapPoints = ['50%'], className, children }, _ref) => {
    const modalRef = React.useRef<BottomSheetModal>(null);

    const handleOpen = React.useCallback(() => {
      modalRef.current?.present();
    }, []);

    return (
      <BottomSheetModalProvider>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={triggerLabel}
          className={cn(
            'items-center justify-center rounded-md bg-blue-600 px-4 py-2 active:bg-blue-700',
            className,
          )}
          onPress={handleOpen}
        >
          <Text className="text-sm font-medium text-white">{triggerLabel}</Text>
        </Pressable>
        <BottomSheetModal ref={modalRef} snapPoints={snapPoints}>
          <BottomSheetView>{children}</BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);

BottomSheetTrigger.displayName = 'BottomSheetTrigger';
