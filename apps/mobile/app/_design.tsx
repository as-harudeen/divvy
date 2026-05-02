import { Avatar, BottomSheetTrigger, Button, Card, NumPad, Pill } from '@repo/ui';
import { ScrollView, Text, View } from 'react-native';

const PILL_VARIANTS = ['default', 'success', 'warning', 'destructive', 'info'] as const;

export default function DesignScreen() {
  if (!__DEV__) return null;

  return (
    <ScrollView contentContainerClassName="flex-1 bg-white px-6 py-12 gap-6">
      <Text accessibilityRole="header" className="text-2xl font-bold text-gray-900">
        Design System
      </Text>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-700">Buttons</Text>
        <View className="gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-700">Pills</Text>
        <View className="flex-row flex-wrap gap-2">
          {PILL_VARIANTS.map((v) => (
            <Pill key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Pill>
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-700">Avatars (7-color palette)</Text>
        <View className="flex-row flex-wrap gap-3">
          {['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace'].map((name, i) => (
            <Avatar key={name} name={name} id={`user-${i}`} />
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-700">Cards</Text>
        <Card>
          <Text className="text-base text-gray-900">Flat card</Text>
        </Card>
        <Card variant="elevated">
          <Text className="text-base text-gray-900">Elevated card</Text>
        </Card>
        <Card variant="outlined">
          <Text className="text-base text-gray-900">Outlined card</Text>
        </Card>
      </View>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-700">NumPad</Text>
        <NumPad onDigitPress={() => {}} onBackspace={() => {}} />
      </View>

      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-700">BottomSheet</Text>
        <BottomSheetTrigger triggerLabel="Open Sheet">
          <View className="p-4">
            <Text className="text-base text-gray-900">Sheet content</Text>
          </View>
        </BottomSheetTrigger>
      </View>
    </ScrollView>
  );
}
