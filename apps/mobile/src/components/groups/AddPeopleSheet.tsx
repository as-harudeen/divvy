import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import type { Group, GroupId, Person, PersonId } from '@repo/types';
import { AVATAR_PALETTE } from '@repo/ui';
import { cn } from '@repo/utils';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useGroupsStore } from '../../stores/groups';
import { usePeopleStore } from '../../stores/people';
import { MemberPill } from './MemberPill';

const MAX_NAME_LENGTH = 32;
const DAY_MS = 86_400_000;

interface AddPeopleSheetProps {
  visible: boolean;
  groupId: GroupId;
  onClose: () => void;
}

interface PersonPoolEntry {
  person: Person;
  lastSeenAt: string;
  lastSeenLabel: string;
}

function paletteColorForId(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0;
  }

  const paletteIndex = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[paletteIndex] ?? AVATAR_PALETTE[0];
}

function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function formatRelativeAge(lastSeenAt: string, nowMs: number): string {
  const timestampMs = Date.parse(lastSeenAt);
  if (Number.isNaN(timestampMs)) {
    return 'recently';
  }

  const diffDays = Math.max(0, Math.floor((nowMs - timestampMs) / DAY_MS));
  if (diffDays === 0) {
    return 'today';
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  if (diffDays < 35) {
    return `${Math.floor(diffDays / 7)}w ago`;
  }

  if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}mo ago`;
  }

  return `${Math.floor(diffDays / 365)}y ago`;
}

function personCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'person' : 'people'}`;
}

function buildPersonPool({
  peopleById,
  groups,
  nowMs,
}: {
  peopleById: Record<PersonId, Person>;
  groups: Record<GroupId, Group>;
  nowMs: number;
}): PersonPoolEntry[] {
  const entriesByPersonId = new Map<PersonId, PersonPoolEntry>();

  for (const group of Object.values(groups)) {
    for (const personId of group.memberIds) {
      const person = peopleById[personId];
      if (person === undefined) {
        continue;
      }

      const existingEntry = entriesByPersonId.get(personId);
      if (
        existingEntry !== undefined &&
        existingEntry.lastSeenAt.localeCompare(group.lastActivityAt) >= 0
      ) {
        continue;
      }

      entriesByPersonId.set(personId, {
        person,
        lastSeenAt: group.lastActivityAt,
        lastSeenLabel: `${group.name} · ${formatRelativeAge(group.lastActivityAt, nowMs)}`,
      });
    }
  }

  return Array.from(entriesByPersonId.values()).sort(
    (left, right) =>
      right.lastSeenAt.localeCompare(left.lastSeenAt) ||
      left.person.name.localeCompare(right.person.name) ||
      left.person.id.localeCompare(right.person.id),
  );
}

function selectedPeopleForIds(
  peopleById: Record<PersonId, Person>,
  selectedMemberIds: PersonId[],
): Person[] {
  return selectedMemberIds
    .map((personId) => peopleById[personId])
    .filter((person) => person !== undefined);
}

function HighlightedName({ person, query }: { person: Person; query: string }) {
  const trimmedQuery = query.trim();
  const shouldHighlight =
    trimmedQuery.length > 0 &&
    person.name.toLocaleLowerCase().startsWith(trimmedQuery.toLocaleLowerCase());

  if (!shouldHighlight) {
    return (
      <Text
        testID={`add-people-row-name-${person.id}`}
        className="text-sm font-bold text-slate-950"
      >
        {person.name}
      </Text>
    );
  }

  const prefix = person.name.slice(0, trimmedQuery.length);
  const suffix = person.name.slice(trimmedQuery.length);

  return (
    <Text testID={`add-people-row-name-${person.id}`} className="text-sm font-bold text-slate-950">
      <Text
        testID={`add-people-row-name-prefix-${person.id}`}
        className="text-sm font-bold text-blue-600"
      >
        {prefix}
      </Text>
      {suffix}
    </Text>
  );
}

interface PersonResultRowProps {
  entry: PersonPoolEntry;
  locked: boolean;
  query: string;
  selected: boolean;
  onToggle: (person: Person) => void;
}

function PersonResultRow({ entry, locked, query, selected, onToggle }: PersonResultRowProps) {
  const { person } = entry;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        locked ? `${person.name} is already in this group` : `Select ${person.name}`
      }
      accessibilityState={{ disabled: locked, selected }}
      disabled={locked}
      testID={`add-people-row-${person.id}`}
      className={cn(
        'min-h-[58px] flex-row items-center gap-3 rounded-xl px-3 py-2 active:bg-slate-100',
        selected ? 'bg-blue-50' : 'bg-white',
        locked && 'opacity-45',
      )}
      onPress={() => onToggle(person)}
    >
      <View
        accessibilityLabel={`Avatar for ${person.name}`}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: person.avatarColor }}
      >
        <Text className="text-xs font-bold text-white">{initialFor(person.name)}</Text>
      </View>

      <View className="min-w-0 flex-1">
        <HighlightedName person={person} query={query} />
        <Text
          testID={`add-people-row-context-${person.id}`}
          className="text-[10px] font-medium text-slate-500"
          numberOfLines={1}
        >
          {entry.lastSeenLabel}
        </Text>
      </View>

      {locked ? (
        <View
          testID={`add-people-in-group-tag-${person.id}`}
          className="rounded-full bg-slate-100 px-2 py-1"
        >
          <Text className="text-[10px] font-bold text-slate-500">In group</Text>
        </View>
      ) : (
        <View
          testID={`add-people-row-check-${person.id}`}
          className={cn(
            'h-5 w-5 items-center justify-center rounded-full border',
            selected ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white',
          )}
        >
          <Text className="text-[10px] font-bold text-white">{selected ? '✓' : ''}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function AddPeopleSheet({ visible, groupId, onClose }: AddPeopleSheetProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const hasPresentedRef = useRef(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<PersonId[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const peopleById = usePeopleStore((state) => state.people);
  const addPerson = usePeopleStore((state) => state.addPerson);
  const groups = useGroupsStore((state) => state.groups);
  const addMember = useGroupsStore((state) => state.addMember);
  const currentGroup = groups[groupId];
  const currentMemberIds = useMemo(
    () => new Set<PersonId>(currentGroup?.memberIds ?? []),
    [currentGroup],
  );
  const nowMs = Date.now();
  const trimmedQuery = searchValue.trim().slice(0, MAX_NAME_LENGTH);
  const normalizedQuery = normalizeName(trimmedQuery);
  const selectedPeople = useMemo(
    () => selectedPeopleForIds(peopleById, selectedMemberIds),
    [peopleById, selectedMemberIds],
  );
  const personPool = useMemo(
    () => buildPersonPool({ peopleById, groups, nowMs }),
    [groups, nowMs, peopleById],
  );
  const filteredPool = useMemo(
    () =>
      normalizedQuery.length === 0
        ? personPool
        : personPool.filter((entry) => normalizeName(entry.person.name).includes(normalizedQuery)),
    [normalizedQuery, personPool],
  );
  const hasExactMatch =
    normalizedQuery.length > 0 &&
    Object.values(peopleById).some((person) => normalizeName(person.name) === normalizedQuery);
  const canCreate = normalizedQuery.length > 0 && !hasExactMatch;
  const canConfirm = selectedMemberIds.length > 0;
  const snapPoints = useMemo(() => [isSearchFocused ? '62%' : '92%'], [isSearchFocused]);

  useEffect(() => {
    if (visible) {
      hasPresentedRef.current = true;
      modalRef.current?.present();
      return;
    }

    if (hasPresentedRef.current) {
      modalRef.current?.dismiss();
    }
  }, [visible]);

  const resetDraft = useCallback(() => {
    setSearchValue('');
    setSelectedMemberIds([]);
    setIsSearchFocused(false);
  }, []);

  const handleDismiss = useCallback(() => {
    hasPresentedRef.current = false;
    resetDraft();
    onClose();
  }, [onClose, resetDraft]);

  const dismissSheet = useCallback(() => {
    modalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        accessibilityLabel="Dismiss add people sheet"
        accessibilityRole="button"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
        pressBehavior="close"
        onPress={dismissSheet}
      />
    ),
    [dismissSheet],
  );

  const togglePerson = useCallback((person: Person) => {
    setSelectedMemberIds((currentIds) =>
      currentIds.includes(person.id)
        ? currentIds.filter((personId) => personId !== person.id)
        : [...currentIds, person.id],
    );
  }, []);

  const removeSelectedPerson = useCallback((person: Person) => {
    setSelectedMemberIds((currentIds) => currentIds.filter((personId) => personId !== person.id));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleCreate = useCallback(() => {
    if (!canCreate) {
      return;
    }

    const personId = nanoid();
    const person = addPerson({
      id: personId,
      name: trimmedQuery,
      avatarColor: paletteColorForId(personId),
    });

    setSelectedMemberIds((currentIds) =>
      currentIds.includes(person.id) ? currentIds : [...currentIds, person.id],
    );
    setSearchValue('');
  }, [addPerson, canCreate, trimmedQuery]);

  const handleConfirm = useCallback(() => {
    if (!canConfirm) {
      return;
    }

    for (const personId of selectedMemberIds) {
      addMember(groupId, personId);
    }

    dismissSheet();
  }, [addMember, canConfirm, dismissSheet, groupId, selectedMemberIds]);

  const renderCreateRow = useCallback(
    (name: string) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Create ${name}`}
        testID="add-people-create-row"
        className="min-h-[58px] flex-row items-center gap-3 rounded-xl border border-blue-600 bg-blue-50 px-3 py-2 active:bg-blue-100"
        onPress={handleCreate}
      >
        <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-600">
          <Text className="text-lg font-semibold text-white">+</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text
            testID="add-people-create-title"
            className="text-sm font-bold text-slate-950"
            numberOfLines={1}
          >
            Create "{name}"
          </Text>
          <Text className="text-[10px] font-medium text-slate-500">
            New person - added to this group
          </Text>
        </View>
        <Text className="text-xs font-bold text-blue-600">Add →</Text>
      </Pressable>
    ),
    [handleCreate],
  );

  const renderSectionHeader = useCallback(
    ({ countLabel, title }: { countLabel?: string; title: string }) => (
      <View className="flex-row items-center justify-between px-1 pb-2 pt-1">
        <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {title}
        </Text>
        {countLabel === undefined ? null : (
          <Text
            testID="add-people-section-count"
            className="text-[10px] font-semibold text-slate-400"
          >
            {countLabel}
          </Text>
        )}
      </View>
    ),
    [],
  );

  const renderPersonRow = useCallback(
    ({ item }: ListRenderItemInfo<PersonPoolEntry>) => {
      return (
        <PersonResultRow
          entry={item}
          locked={currentMemberIds.has(item.person.id)}
          query={trimmedQuery}
          selected={selectedMemberIds.includes(item.person.id)}
          onToggle={togglePerson}
        />
      );
    },
    [currentMemberIds, selectedMemberIds, togglePerson, trimmedQuery],
  );

  const keyExtractor = useCallback((item: PersonPoolEntry) => `person-${item.person.id}`, []);

  return (
    <BottomSheetModal
      ref={modalRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF', borderRadius: 24 }}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: '#D9DDE7', width: 38 }}
      android_keyboardInputMode="adjustPan"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="none"
      enableDynamicSizing={false}
      onDismiss={handleDismiss}
      snapPoints={snapPoints}
    >
      <View testID="add-people-sheet" className="gap-3 px-3 pb-4 pt-1" style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel add people"
            testID="add-people-cancel-button"
            className="min-w-16 py-2"
            onPress={dismissSheet}
          >
            <Text className="text-xs font-medium text-slate-500">Cancel</Text>
          </Pressable>

          <Text className="text-base font-bold text-slate-950">Add people</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add selected people"
            accessibilityState={{ disabled: !canConfirm }}
            disabled={!canConfirm}
            testID="add-people-confirm-button"
            className="min-w-16 items-end py-2"
            onPress={handleConfirm}
          >
            <Text
              testID="add-people-confirm-label"
              className={cn('text-xs font-bold', canConfirm ? 'text-blue-600' : 'text-slate-400')}
            >
              Add ({selectedMemberIds.length})
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          testID="add-people-selected-pill-strip"
          className="min-h-8 max-h-9"
          contentContainerClassName="flex-row gap-2"
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
        >
          {selectedPeople.map((person) => (
            <MemberPill
              key={person.id}
              person={person}
              className="bg-blue-50"
              onRemove={removeSelectedPerson}
            />
          ))}
        </ScrollView>

        <View className="h-12 flex-row items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3">
          <Text className="text-sm font-semibold text-slate-400">⌕</Text>
          <BottomSheetTextInput
            accessibilityLabel="Search or type a new name"
            testID="add-people-search-input"
            className="h-10 flex-1 text-sm font-medium text-slate-950"
            maxLength={MAX_NAME_LENGTH}
            placeholder="Search or type a new name"
            placeholderTextColor="#94A3B8"
            value={searchValue}
            onChangeText={setSearchValue}
            onBlur={() => setIsSearchFocused(false)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {searchValue.length === 0 ? null : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              testID="add-people-search-clear"
              className="h-5 w-5 items-center justify-center rounded-full bg-slate-300"
              onPress={clearSearch}
            >
              <Text className="text-[10px] font-bold text-white">x</Text>
            </Pressable>
          )}
        </View>

        <View testID="add-people-fixed-results-header" className="gap-2">
          {normalizedQuery.length > 0 ? (
            <>
              {canCreate ? (
                <>
                  {renderSectionHeader({ title: 'CREATE NEW' })}
                  {renderCreateRow(trimmedQuery)}
                </>
              ) : null}
              {renderSectionHeader({ title: 'MATCHES' })}
            </>
          ) : (
            renderSectionHeader({
              title: 'FROM YOUR GROUPS',
              countLabel: personCountLabel(personPool.length),
            })
          )}
        </View>

        <BottomSheetFlatList
          data={filteredPool}
          keyExtractor={keyExtractor}
          renderItem={renderPersonRow}
          keyboardShouldPersistTaps="handled"
          testID="add-people-results-list"
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: 6, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheetModal>
  );
}
