import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function SplitNewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text accessibilityRole="header" testID="page-heading" className="text-2xl font-bold">
        Split new (Screen 04)
      </Text>
      <Text testID="group-id" className="text-base text-gray-600">
        group: {id}
      </Text>
    </View>
  );
}
