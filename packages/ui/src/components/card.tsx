import { cn } from '@repo/utils';
import * as React from 'react';
import { View, type View as ViewRef } from 'react-native';

type CardVariant = 'flat' | 'elevated' | 'outlined';

const variantClasses: Record<CardVariant, string> = {
  flat: 'bg-white',
  elevated: 'bg-white shadow-md',
  outlined: 'bg-white border border-gray-200',
};

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

export const Card = React.forwardRef<ViewRef, CardProps>(
  ({ variant = 'flat', className, children }, ref) => {
    return (
      <View ref={ref} className={cn('rounded-lg p-4', variantClasses[variant], className)}>
        {children}
      </View>
    );
  },
);

Card.displayName = 'Card';
