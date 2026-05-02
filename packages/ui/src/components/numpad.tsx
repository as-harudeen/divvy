import { cn } from '@repo/utils';
import * as React from 'react';
import { Pressable, Text, View, type View as ViewRef } from 'react-native';

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

export interface NumPadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  className?: string;
}

export const NumPad = React.forwardRef<ViewRef, NumPadProps>(
  ({ onDigitPress, onBackspace, className }, ref) => {
    return (
      <View ref={ref} className={cn('gap-2', className)}>
        <View className="flex-row flex-wrap justify-center gap-2">
          {DIGITS.map((digit) => (
            <Pressable
              key={digit}
              accessibilityRole="button"
              accessibilityLabel={`Digit ${digit}`}
              className="h-14 w-1/4 items-center justify-center rounded-lg bg-gray-100 active:bg-gray-200"
              onPress={() => onDigitPress(digit)}
            >
              <Text className="text-2xl font-semibold text-gray-900">{digit}</Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Backspace"
            className="h-14 w-1/4 items-center justify-center rounded-lg active:bg-gray-200"
            onPress={onBackspace}
          >
            <Text className="text-lg text-gray-500">⌫</Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

NumPad.displayName = 'NumPad';
