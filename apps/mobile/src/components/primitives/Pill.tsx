import { cn } from '@repo/utils';
import * as React from 'react';
import { Text, View, type View as ViewRef } from 'react-native';

type PillVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info';

const variantClasses: Record<PillVariant, string> = {
  default: 'bg-gray-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  destructive: 'bg-red-100',
  info: 'bg-blue-100',
};

const variantTextClasses: Record<PillVariant, string> = {
  default: 'text-gray-800',
  success: 'text-green-800',
  warning: 'text-amber-800',
  destructive: 'text-red-800',
  info: 'text-blue-800',
};

export interface PillProps {
  variant?: PillVariant;
  className?: string;
  textClassName?: string;
  testID?: string;
  children: React.ReactNode;
}

export const Pill = React.forwardRef<ViewRef, PillProps>(
  ({ variant = 'default', className, textClassName, testID, children }, ref) => {
    return (
      <View
        ref={ref}
        accessibilityRole="text"
        testID={testID}
        className={cn(
          'flex-row items-center self-start rounded-full px-3 py-1',
          variantClasses[variant],
          className,
        )}
      >
        {typeof children === 'string' ? (
          <Text className={cn('text-sm font-medium', variantTextClasses[variant], textClassName)}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    );
  },
);

Pill.displayName = 'Pill';
