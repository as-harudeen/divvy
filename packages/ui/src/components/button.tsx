import { cn } from '@repo/utils';
import * as React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, Text, type View } from 'react-native';

// --- Variant type definitions ---

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

// --- Variant class maps ---

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-100 active:bg-gray-200',
  destructive: 'bg-red-600 active:bg-red-700',
  ghost: 'bg-transparent active:bg-gray-100',
  outline: 'border border-gray-300 bg-transparent active:bg-gray-50',
};

const variantTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-900',
  destructive: 'text-white',
  ghost: 'text-gray-700',
  outline: 'text-gray-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  lg: 'h-12 px-6',
};

const sizeTextClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
};

// --- Component props ---

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

// --- Component ---

/**
 * A Pressable-based button with variant + size support, styled via NativeWind.
 *
 * TDD: See button.test.tsx for the contract this component satisfies.
 */
export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className,
      textClassName,
      children,
      accessibilityState,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled ?? isLoading;
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: isLoading, ...accessibilityState }}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center gap-2 rounded-md',
          variantClasses[variant],
          sizeClasses[size],
          isDisabled ? 'opacity-50' : '',
          className,
        )}
        {...props}
      >
        {isLoading ? <ActivityIndicator accessibilityLabel="Loading" /> : null}
        {typeof children === 'string' ? (
          <Text
            className={cn(
              'font-medium',
              variantTextClasses[variant],
              sizeTextClasses[size],
              textClassName,
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
