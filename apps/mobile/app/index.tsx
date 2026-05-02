import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text
        accessibilityRole="header"
        testID="page-heading"
        className="text-3xl font-bold text-gray-900"
      >
        Divvy
      </Text>
      <Text className="text-base text-gray-600">Home (Screen 01) — placeholder</Text>
      <Link href="/group/new" testID="create-group-link" className="text-blue-600 underline">
        Create group
      </Link>
    </View>
  );
}
