import { cn } from '@repo/utils';
import * as React from 'react';
import { Text, View, type View as ViewRef } from 'react-native';
import { AVATAR_PALETTE } from '../theme';

export function avatarColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] as string;
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return '?';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  if (parts.length === 1) return first.toUpperCase();
  const last = parts[parts.length - 1]?.charAt(0) ?? '';
  return `${first}${last}`.toUpperCase();
}

export interface AvatarProps {
  name: string;
  id: string;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

export const Avatar = React.forwardRef<ViewRef, AvatarProps>(
  ({ name, id, className, textClassName, children }, ref) => {
    const bgColor = avatarColorForId(id);
    const initials = getInitials(name);

    return (
      <View
        ref={ref}
        accessibilityRole="image"
        accessibilityLabel={`Avatar for ${name}`}
        className={cn('h-10 w-10 items-center justify-center rounded-full', className)}
        style={{ backgroundColor: bgColor }}
      >
        {children ?? (
          <Text className={cn('text-sm font-bold text-white', textClassName)}>{initials}</Text>
        )}
      </View>
    );
  },
);

Avatar.displayName = 'Avatar';
