import type { Person } from '@repo/types';
import { cn } from '@repo/utils';
import { Pressable, Text, View } from 'react-native';

interface MemberPillProps {
  person: Person;
  onRemove: (person: Person) => void;
  className?: string;
}

function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export function MemberPill({ person, onRemove, className }: MemberPillProps) {
  return (
    <View
      testID={`member-pill-${person.id}`}
      className={cn(
        'h-8 flex-row items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2',
        className,
      )}
    >
      <View
        accessibilityLabel={`Avatar for ${person.name}`}
        className="h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: person.avatarColor }}
      >
        <Text className="text-[10px] font-bold text-white">{initialFor(person.name)}</Text>
      </View>
      <Text className="text-xs font-semibold text-slate-950">{person.name}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${person.name}`}
        testID={`member-pill-remove-${person.id}`}
        className="h-5 w-5 items-center justify-center rounded-full active:bg-slate-100"
        hitSlop={8}
        onPress={() => onRemove(person)}
      >
        <Text className="text-xs font-bold text-slate-400">x</Text>
      </Pressable>
    </View>
  );
}
