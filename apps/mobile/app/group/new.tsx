import type { Person, PersonId } from '@repo/types';
import { cn } from '@repo/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { MemberPill } from '../../src/components/groups/MemberPill';
import { AddPersonSheet } from '../../src/components/people/AddPersonSheet';
import { PersonRow } from '../../src/components/people/PersonRow';
import { useAppStore } from '../../src/stores/app';
import { useGroupsStore } from '../../src/stores/groups';
import { usePeopleStore } from '../../src/stores/people';

function memberCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'member' : 'members'}`;
}

function selectedInitialMembers(userPersonId: PersonId | null): PersonId[] {
  const people = usePeopleStore.getState().people;
  if (userPersonId !== null && people[userPersonId] !== undefined) {
    return [userPersonId];
  }

  return [];
}

function peopleForIds(peopleById: Record<PersonId, Person>, ids: PersonId[]): Person[] {
  return ids.map((id) => peopleById[id]).filter((person) => person !== undefined);
}

export default function CreateGroupScreen() {
  const router = useRouter();
  const peopleById = usePeopleStore((state) => state.people);
  const userPersonId = useAppStore((state) => state.userPersonId);
  const bootstrapUser = useAppStore((state) => state.bootstrapUser);
  const createGroup = useGroupsStore((state) => state.createGroup);
  const setActiveGroup = useAppStore((state) => state.setActiveGroup);
  const [groupName, setGroupName] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<PersonId[]>(() =>
    selectedInitialMembers(userPersonId),
  );
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const trimmedGroupName = groupName.trim();
  const selectedMembers = useMemo(
    () => peopleForIds(peopleById, selectedMemberIds),
    [peopleById, selectedMemberIds],
  );
  const recentPeople = useMemo(
    () =>
      Object.values(peopleById)
        .filter((person) => person.id !== userPersonId || !selectedMemberIds.includes(person.id))
        .sort((firstPerson, secondPerson) => firstPerson.name.localeCompare(secondPerson.name)),
    [peopleById, selectedMemberIds, userPersonId],
  );
  const canSave = trimmedGroupName.length > 0 && selectedMemberIds.length > 0;

  useEffect(() => {
    const user = bootstrapUser();
    setSelectedMemberIds((currentIds) =>
      currentIds.includes(user.id) ? currentIds : [user.id, ...currentIds],
    );
  }, [bootstrapUser]);

  const addMember = (person: Person) => {
    setSelectedMemberIds((currentIds) =>
      currentIds.includes(person.id) ? currentIds : [...currentIds, person.id],
    );
  };

  const removeMember = (person: Person) => {
    setSelectedMemberIds((currentIds) => currentIds.filter((personId) => personId !== person.id));
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    const group = createGroup({
      name: trimmedGroupName,
      memberIds: selectedMemberIds,
    });

    setActiveGroup(group.id);
    router.replace({
      pathname: '/group/[id]',
      params: { id: group.id },
    });
  };

  return (
    <View className="flex-1 bg-slate-50 px-4 pb-6 pt-12">
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel create group"
          className="min-w-16 py-2"
          onPress={() => router.back()}
        >
          <Text className="text-sm font-medium text-slate-500">Cancel</Text>
        </Pressable>
        <Text
          accessibilityRole="header"
          testID="page-heading"
          className="text-base font-bold text-slate-950"
        >
          New group
        </Text>
        <View className="min-w-16" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="gap-6 pb-6">
          <View className="gap-2">
            <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Group name
            </Text>
            <TextInput
              accessibilityLabel="Group name"
              className="h-12 rounded-xl bg-white px-4 text-base font-semibold text-slate-950"
              placeholder="Saturday brunch"
              placeholderTextColor="#64748B"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                People
              </Text>
              <Text testID="member-count" className="text-[10px] font-semibold text-slate-400">
                {memberCountLabel(selectedMemberIds.length)}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {selectedMembers.map((person) => (
                <MemberPill key={person.id} person={person} onRemove={removeMember} />
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add person"
              testID="add-person-button"
              className="h-8 flex-row items-center self-start rounded-full bg-white px-3 active:bg-slate-100"
              onPress={() => setIsAddPersonOpen(true)}
            >
              <Text className="text-xs font-semibold text-slate-500">+ Add person</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Recent - Tap to add
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {recentPeople.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  selected={selectedMemberIds.includes(person.id)}
                  onPress={addMember}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create group"
        accessibilityState={{ disabled: !canSave }}
        disabled={!canSave}
        testID="create-group-save-button"
        className={cn(
          'h-14 overflow-hidden rounded-lg active:opacity-90',
          !canSave && 'opacity-40',
        )}
        onPress={handleSave}
      >
        <LinearGradient
          colors={canSave ? ['#2563EB', '#4F46E5', '#7C3AED'] : ['#94A3B8', '#94A3B8']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text className="text-base font-semibold text-white">Create group -&gt;</Text>
        </LinearGradient>
      </Pressable>

      <AddPersonSheet
        visible={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        onAdd={addMember}
      />
    </View>
  );
}
