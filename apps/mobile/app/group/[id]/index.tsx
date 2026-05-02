import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text accessibilityRole="header" testID="page-heading" className="text-2xl font-bold">
        Group detail (Screen 03)
      </Text>
      <Text testID="group-id" className="text-base text-gray-600">
        id: {id}
      </Text>
    </View>
  );
}
