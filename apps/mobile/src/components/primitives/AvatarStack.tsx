import type { Person } from '@repo/types';
import { cn } from '@repo/utils';
import { Text, View } from 'react-native';

interface AvatarStackProps {
  people: Person[];
  maxVisible?: number;
  className?: string;
}

function initialsFor(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return '?';
  }

  const initials = parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('');

  return initials.toUpperCase();
}

export function AvatarStack({ people, maxVisible = 3, className }: AvatarStackProps) {
  const visiblePeople = people.slice(0, maxVisible);
  const overflowCount = Math.max(people.length - visiblePeople.length, 0);

  return (
    <View className={cn('flex-row items-center', className)}>
      {visiblePeople.map((person, index) => (
        <View
          key={person.id}
          accessibilityLabel={`Avatar for ${person.name}`}
          className="h-9 w-9 items-center justify-center rounded-full border-2 border-white"
          style={{
            backgroundColor: person.avatarColor,
            marginLeft: index === 0 ? 0 : -8,
            zIndex: visiblePeople.length - index,
          }}
        >
          <Text className="text-xs font-semibold text-white">{initialsFor(person.name)}</Text>
        </View>
      ))}
      {overflowCount > 0 ? (
        <View
          accessibilityLabel={`${overflowCount} more members`}
          className="h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-200"
          style={{ marginLeft: -8 }}
        >
          <Text className="text-xs font-semibold text-gray-700">+{overflowCount}</Text>
        </View>
      ) : null}
    </View>
  );
}
