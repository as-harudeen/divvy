import type { Person } from '@repo/types';
import { cn } from '@repo/utils';
import { Pressable, Text, View } from 'react-native';

interface PersonRowProps {
  person: Person;
  selected: boolean;
  onPress: (person: Person) => void;
  className?: string;
}

function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export function PersonRow({ person, selected, onPress, className }: PersonRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={selected ? `${person.name} already added` : `Add ${person.name}`}
      accessibilityState={{ disabled: selected }}
      disabled={selected}
      testID={`recent-person-${person.id}`}
      className={cn(
        'h-8 flex-row items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2 active:bg-slate-100',
        selected && 'opacity-[0.35]',
        className,
      )}
      onPress={() => onPress(person)}
    >
      <View
        accessibilityLabel={`Avatar for ${person.name}`}
        className="h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: person.avatarColor }}
      >
        <Text className="text-[10px] font-bold text-white">{initialFor(person.name)}</Text>
      </View>
      <Text className="text-xs font-semibold text-slate-700">{person.name}</Text>
    </Pressable>
  );
}
