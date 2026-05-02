import { Text, View } from 'react-native';

export default function CreateGroupScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text accessibilityRole="header" testID="page-heading" className="text-2xl font-bold">
        Create group (Screen 02)
      </Text>
    </View>
  );
}
