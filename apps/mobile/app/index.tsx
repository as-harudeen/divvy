import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { GroupCard } from '../src/components/groups/GroupCard';
import { useAppStore } from '../src/stores/app';
import { useGroupsStore } from '../src/stores/groups';
import { usePeopleStore } from '../src/stores/people';
import { useSplitsStore } from '../src/stores/splits';

function BrandMark({ testID, size = 'header' }: { testID?: string; size?: 'header' | 'hero' }) {
  const isHero = size === 'hero';

  return (
    <Image
      accessibilityLabel="Divvy mark"
      resizeMode="contain"
      source={require('../assets/brand/divvy-mark.png')}
      testID={testID}
      className={
        isHero ? 'h-10 w-10 items-center justify-center' : 'h-4 w-4 items-center justify-center'
      }
    />
  );
}

function BrandWordmark({ testID }: { testID?: string }) {
  return (
    <Image
      accessibilityLabel="Divvy"
      resizeMode="contain"
      source={require('../assets/brand/divvy-wordmark.png')}
      testID={testID}
      className="h-6 w-20"
    />
  );
}

function Header({ userInitial }: { userInitial: string }) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <BrandWordmark testID="brand-wordmark-header" />
      <View testID="user-initial" className="h-6 w-6 items-center justify-center">
        <Text className="text-sm font-semibold text-slate-950">{userInitial}</Text>
      </View>
    </View>
  );
}

function PrimaryAction({
  children,
  testID,
  accessibilityLabel,
  onPress,
}: {
  children: string;
  testID: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      className="h-14 overflow-hidden rounded-lg active:opacity-90"
      style={{
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.24,
        shadowRadius: 18,
        elevation: 6,
      }}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#0EA5E9', '#2563EB', '#4F46E5']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text className="text-base font-semibold text-white">{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function formatLastActivityLabel(lastActivityAt: string, now = new Date()): string {
  const date = new Date(lastActivityAt);
  if (Number.isNaN(date.getTime())) {
    return 'Recent';
  }

  const activityDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;

  if (activityDay === today) {
    return `Today - ${new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)}`;
  }

  if (activityDay === yesterday) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default function HomeScreen() {
  const router = useRouter();
  const groupsById = useGroupsStore((state) => state.groups);
  const peopleById = usePeopleStore((state) => state.people);
  const splitsById = useSplitsStore((state) => state.splits);
  const activeGroupId = useAppStore((state) => state.activeGroupId);
  const userPersonId = useAppStore((state) => state.userPersonId);
  const setActiveGroup = useAppStore((state) => state.setActiveGroup);
  const groups = useMemo(
    () =>
      Object.values(groupsById).sort((firstGroup, secondGroup) =>
        secondGroup.lastActivityAt.localeCompare(firstGroup.lastActivityAt),
      ),
    [groupsById],
  );
  const totalsByGroup = useMemo(() => {
    const totals = new Map<string, number>();
    for (const split of Object.values(splitsById)) {
      totals.set(split.groupId, (totals.get(split.groupId) ?? 0) + split.totalCents);
    }
    return totals;
  }, [splitsById]);
  const selectedActiveGroupId = groups.some((group) => group.id === activeGroupId)
    ? activeGroupId
    : (groups[0]?.id ?? null);
  const activeGroup = groups.find((group) => group.id === selectedActiveGroupId);
  const activeGroupMembers =
    activeGroup?.memberIds
      .map((memberId) => peopleById[memberId])
      .filter((person) => person !== undefined) ?? [];
  const userInitial =
    (userPersonId !== null ? peopleById[userPersonId]?.name.charAt(0) : 'Y') ?? 'Y';

  const handleCreateGroup = () => {
    router.push('/group/new');
  };

  const handleOpenGroup = (groupId: string) => {
    router.push({
      pathname: '/group/[id]',
      params: { id: groupId },
    });
  };

  const handleNewSplit = () => {
    if (activeGroup === undefined) {
      return;
    }

    router.push({
      pathname: '/group/[id]/split/new',
      params: { id: activeGroup.id },
    });
  };

  return (
    <View className="flex-1 bg-slate-50 px-4 pb-6 pt-12">
      <Header userInitial={userInitial.toUpperCase()} />
      {groups.length === 0 ? (
        <View className="flex-1">
          <View className="gap-2">
            <Text
              accessibilityRole="header"
              testID="page-heading"
              className="text-3xl font-bold text-slate-950"
            >
              Welcome to Divvy
            </Text>
            <Text className="max-w-[260px] text-sm leading-5 text-slate-500">
              Split bills with friends in seconds. Create your first group to get started.
            </Text>
          </View>

          <View className="mt-6 flex-1 justify-center">
            <View className="items-center rounded-xl border border-blue-100 bg-indigo-50 px-6 py-8">
              <View
                className="mb-4 h-20 w-20 items-center justify-center rounded-xl bg-white"
                style={{
                  shadowColor: '#64748B',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.12,
                  shadowRadius: 18,
                  elevation: 4,
                }}
              >
                <BrandMark size="hero" />
              </View>
              <Text className="text-xl font-bold text-slate-950">No groups yet</Text>
              <Text className="mt-4 text-center text-sm leading-5 text-slate-600">
                A group is a circle of people you split with - roommates, a trip, brunch crew. You
                only set it up once.
              </Text>

              <View className="mt-6 w-full gap-3">
                {['Name a group', 'Add a few people', 'Split your first bill'].map(
                  (label, index) => (
                    <View
                      key={label}
                      className="h-10 flex-row items-center gap-3 rounded-lg bg-white px-4"
                    >
                      <View className="h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                        <Text className="text-xs font-bold text-white">{index + 1}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-slate-900">{label}</Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          </View>

          <PrimaryAction
            accessibilityLabel="Create your first group"
            testID="create-group-link"
            onPress={handleCreateGroup}
          >
            + Create your first group
          </PrimaryAction>
          <Text className="mt-3 text-center text-xs text-slate-400">
            No login - No phone numbers - Just names
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <View className="gap-1">
            <Text
              accessibilityRole="header"
              testID="page-heading"
              className="text-3xl font-bold text-slate-950"
            >
              Your groups
            </Text>
            <Text className="text-sm text-slate-500">
              {groups.length} active - tap to open or split
            </Text>
          </View>

          <ScrollView className="mt-4 flex-1" showsVerticalScrollIndicator={false}>
            <View
              accessibilityLabel={`Groups: ${groups.map((group) => group.name).join(', ')}`}
              testID="group-list"
              className="gap-3 pb-8"
            >
              {groups.map((group) => {
                const members = group.memberIds
                  .map((memberId) => peopleById[memberId])
                  .filter((person) => person !== undefined);

                return (
                  <GroupCard
                    key={group.id}
                    group={group}
                    members={members}
                    activeGroupId={selectedActiveGroupId}
                    totalCents={totalsByGroup.get(group.id) ?? 0}
                    lastActivityLabel={formatLastActivityLabel(group.lastActivityAt)}
                    testID={`group-card-${group.id}`}
                    onPress={() => {
                      setActiveGroup(group.id);
                      handleOpenGroup(group.id);
                    }}
                  />
                );
              })}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create new group"
                testID="group-list-create-row"
                className="h-12 items-center justify-center rounded-xl border border-dashed border-slate-300 active:bg-slate-100"
                onPress={handleCreateGroup}
              >
                <Text className="text-sm font-medium text-slate-500">+ Create new group</Text>
              </Pressable>
            </View>
          </ScrollView>

          {activeGroup !== undefined ? (
            <View className="gap-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${activeGroup.name}`}
                testID="active-group-strip"
                className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3 active:bg-slate-100"
                style={{
                  shadowColor: '#64748B',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 14,
                  elevation: 4,
                }}
                onPress={() => handleOpenGroup(activeGroup.id)}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-2 w-2 rounded-full bg-blue-500" />
                  <View>
                    <Text className="text-[10px] font-semibold text-slate-400">
                      SPLITTING UNDER
                    </Text>
                    <Text className="text-sm font-bold text-slate-950">
                      {activeGroup.name} - {activeGroupMembers.length}{' '}
                      {activeGroupMembers.length === 1 ? 'person' : 'people'}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs font-semibold text-blue-600">Change</Text>
              </Pressable>

              <PrimaryAction
                accessibilityLabel="New split"
                testID="new-split-button"
                onPress={handleNewSplit}
              >
                + New split
              </PrimaryAction>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
