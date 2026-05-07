import type { Person, PersonId, Split } from '@repo/types';
import { cn } from '@repo/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AddPeopleSheet } from '../../../src/components/groups/AddPeopleSheet';
import { GroupHeader } from '../../../src/components/groups/GroupHeader';
import { BalanceCard } from '../../../src/components/splits/BalanceCard';
import { SplitRow } from '../../../src/components/splits/SplitRow';
import { computeNetBalances } from '../../../src/lib/settle';
import { useAppStore } from '../../../src/stores/app';
import { useGroupsStore } from '../../../src/stores/groups';
import { usePeopleStore } from '../../../src/stores/people';
import { useSplitsStore } from '../../../src/stores/splits';

function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

function peopleForIds(peopleById: Record<PersonId, Person>, ids: PersonId[]): Person[] {
  return ids.map((id) => peopleById[id]).filter((person) => person !== undefined);
}

function splitInvolvesPerson(split: Split, personId: PersonId): boolean {
  return split.payerId === personId || personId in split.shares;
}

function openSplitCount(splits: Split[]): number {
  return splits.filter((split) => split.settlementStatus !== 'settled').length;
}

interface MemberAvatarButtonProps {
  person: Person;
  selected: boolean;
  onPress: (person: Person) => void;
}

function MemberAvatarButton({ person, selected, onPress }: MemberAvatarButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Filter balances to ${person.name}`}
      accessibilityState={{ selected }}
      testID={`member-avatar-${person.id}`}
      className="w-12 items-center gap-1 active:opacity-75"
      onPress={() => onPress(person)}
    >
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full border-2',
          selected ? 'border-blue-500' : 'border-white',
        )}
        style={{ backgroundColor: person.avatarColor }}
      >
        <Text className="text-xs font-bold text-white">{initialFor(person.name)}</Text>
      </View>
      <Text
        testID={`member-avatar-label-${person.id}`}
        className={cn(
          'max-w-12 text-center text-[10px] font-semibold',
          selected ? 'text-blue-600' : 'text-slate-500',
        )}
        numberOfLines={1}
      >
        {person.name}
      </Text>
    </Pressable>
  );
}

interface AddMemberButtonProps {
  onPress: () => void;
}

function AddMemberButton({ onPress }: AddMemberButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add member"
      testID="member-add-button"
      className="w-12 items-center gap-1 active:opacity-75"
      onPress={onPress}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white">
        <Text className="text-base font-semibold text-slate-400">+</Text>
      </View>
      <Text
        testID="member-add-label"
        className="text-center text-[10px] font-semibold text-slate-500"
      >
        Add
      </Text>
    </Pressable>
  );
}

interface NewSplitButtonProps {
  onPress: () => void;
}

function NewSplitButton({ onPress }: NewSplitButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="New split"
      testID="new-split-button"
      className="h-12 overflow-hidden rounded-lg active:opacity-90"
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
        <Text className="text-base font-semibold text-white">+ New split</Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = useGroupsStore((state) => state.groups[id]);
  const recomputeStatus = useGroupsStore((state) => state.recomputeStatus);
  const peopleById = usePeopleStore((state) => state.people);
  const splitsById = useSplitsStore((state) => state.splits);
  const userPersonId = useAppStore((state) => state.userPersonId);
  const [selectedMemberId, setSelectedMemberId] = useState<PersonId | null>(null);
  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
  const groupId = group?.id ?? null;

  const members = useMemo(
    () => (group === undefined ? [] : peopleForIds(peopleById, group.memberIds)),
    [group, peopleById],
  );
  const groupSplits = useMemo(
    () =>
      Object.values(splitsById)
        .filter((split) => split.groupId === id)
        .sort(
          (left, right) =>
            right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id),
        ),
    [id, splitsById],
  );
  const balanceSplits = useMemo(
    () =>
      selectedMemberId === null
        ? groupSplits
        : groupSplits.filter((split) => splitInvolvesPerson(split, selectedMemberId)),
    [groupSplits, selectedMemberId],
  );
  const balances = useMemo(() => computeNetBalances(balanceSplits), [balanceSplits]);
  const netCents = userPersonId === null ? 0 : (balances[userPersonId] ?? 0);
  const selectedMember =
    selectedMemberId === null
      ? undefined
      : members.find((member) => member.id === selectedMemberId);

  useEffect(() => {
    if (groupId === null) {
      return undefined;
    }

    recomputeStatus(groupId);

    return useSplitsStore.subscribe((state, previousState) => {
      if (state.splits !== previousState.splits) {
        recomputeStatus(groupId);
      }
    });
  }, [groupId, recomputeStatus]);

  const handleBack = () => {
    router.push('/');
  };

  const handleEdit = () => {
    setIsAddPeopleOpen(true);
  };

  const handleAddMember = () => {
    setIsAddPeopleOpen(true);
  };

  const handleMemberPress = (person: Person) => {
    setSelectedMemberId((currentId) => (currentId === person.id ? null : person.id));
  };

  const handleOpenSplit = (split: Split) => {
    router.push({
      pathname: '/group/[id]/split/[splitId]/settle',
      params: { id, splitId: split.id },
    });
  };

  const handleNewSplit = () => {
    router.push({
      pathname: '/group/[id]/split/new',
      params: { id },
    });
  };

  if (group === undefined) {
    return (
      <View testID="group-detail-screen" className="flex-1 bg-[#F3F3F8] px-3 pb-5 pt-11">
        <GroupHeader groupName="Group not found" onBack={handleBack} onEdit={handleEdit} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm font-medium text-slate-500">This group is not available.</Text>
        </View>
      </View>
    );
  }

  return (
    <View testID="group-detail-screen" className="flex-1 bg-[#F3F3F8] px-3 pb-5 pt-11">
      <GroupHeader groupName={group.name} onBack={handleBack} onEdit={handleEdit} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-5">
          <ScrollView
            horizontal
            testID="member-row-scroll"
            className="-mx-3 h-[58px]"
            contentContainerClassName="flex-row gap-1 px-3"
            showsHorizontalScrollIndicator={false}
          >
            {members.map((member) => (
              <MemberAvatarButton
                key={member.id}
                person={member}
                selected={selectedMemberId === member.id}
                onPress={handleMemberPress}
              />
            ))}
            <AddMemberButton onPress={handleAddMember} />
          </ScrollView>

          <BalanceCard
            netCents={netCents}
            splitCount={balanceSplits.length}
            openSplitCount={openSplitCount(balanceSplits)}
            contextName={selectedMember?.name}
          />

          <View className="gap-3">
            <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Splits
            </Text>

            {groupSplits.length === 0 ? (
              <View className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8">
                <Text className="text-center text-base font-semibold text-slate-950">
                  Add your first split
                </Text>
              </View>
            ) : (
              <View
                accessibilityLabel={`Splits: ${groupSplits.map((split) => split.label).join(', ')}`}
                testID="split-feed"
                className="gap-3"
              >
                {groupSplits.map((split) => (
                  <SplitRow key={split.id} split={split} onPress={handleOpenSplit} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <NewSplitButton onPress={handleNewSplit} />
      <AddPeopleSheet
        visible={isAddPeopleOpen}
        groupId={group.id}
        onClose={() => setIsAddPeopleOpen(false)}
      />
    </View>
  );
}
