import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function SettlementScreen() {
  const { id, splitId } = useLocalSearchParams<{ id: string; splitId: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text accessibilityRole="header" testID="page-heading" className="text-2xl font-bold">
        Settlement (Screen 05)
      </Text>
      <Text testID="route-params" className="text-base text-gray-600">
        group: {id} / split: {splitId}
      </Text>
    </View>
  );
}
