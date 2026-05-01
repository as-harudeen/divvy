import { Button } from '@repo/ui';
import { Linking, ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-1 items-center justify-center gap-6 px-6 py-16">
        <Text
          accessibilityRole="header"
          testID="page-heading"
          className="text-center text-3xl font-bold text-gray-900"
        >
          🚀 React Native + Supabase + TDD Template
        </Text>
        <Text className="max-w-md text-center text-base text-gray-600">
          Your monorepo template is ready. Connect Supabase, generate types, and write your first
          test.
        </Text>
        <View className="flex-row flex-wrap justify-center gap-3">
          <Button onPress={() => Linking.openURL('https://supabase.com/docs')}>
            Supabase Docs
          </Button>
          <Button variant="outline" onPress={() => Linking.openURL('https://docs.expo.dev')}>
            Expo Docs
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
