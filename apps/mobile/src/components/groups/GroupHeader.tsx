import { Pressable, Text, View } from 'react-native';

interface GroupHeaderProps {
  groupName: string;
  onBack: () => void;
  onEdit: () => void;
}

export function GroupHeader({ groupName, onBack, onEdit }: GroupHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to groups"
        className="min-w-16 flex-row items-center gap-1 py-1 active:opacity-70"
        onPress={onBack}
      >
        <Text testID="group-header-back-arrow" className="text-xs font-medium text-slate-500">
          ←
        </Text>
        <Text testID="group-header-back-label" className="text-xs font-medium text-slate-500">
          Groups
        </Text>
      </Pressable>

      <Text
        accessibilityRole="header"
        testID="page-heading"
        className="max-w-[170px] text-center text-xs font-bold text-slate-950"
        numberOfLines={1}
      >
        {groupName}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${groupName}`}
        className="min-w-16 items-end py-1 active:opacity-70"
        onPress={onEdit}
      >
        <Text className="text-xs font-medium text-blue-600">Edit</Text>
      </Pressable>
    </View>
  );
}
