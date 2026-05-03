import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Group, GroupId, GroupStatus, PersonId } from '@repo/types';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEV_GROUPS } from './seed';
import { useSplitsStore } from './splits';

export const GROUPS_STORE_NAME = 'divvy:groups';
export const GROUPS_STORE_VERSION = 1;

interface GroupsData {
  groups: Record<GroupId, Group>;
  version: number;
}

interface CreateGroupInput {
  name: string;
  memberIds: PersonId[];
  id?: GroupId;
  createdAt?: string;
  lastActivityAt?: string;
  status?: GroupStatus;
}

interface GroupsStore extends GroupsData {
  createGroup: (input: CreateGroupInput) => Group;
  addMember: (groupId: GroupId, personId: PersonId) => Group | undefined;
  removeMember: (groupId: GroupId, personId: PersonId) => Group | undefined;
  recomputeStatus: (groupId: GroupId) => GroupStatus | undefined;
}

function createInitialGroupsData(): GroupsData {
  return {
    groups: __DEV__ ? DEV_GROUPS : {},
    version: GROUPS_STORE_VERSION,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isGroup(value: unknown): value is Group {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.memberIds) &&
    value.memberIds.every((memberId) => typeof memberId === 'string') &&
    typeof value.createdAt === 'string' &&
    typeof value.lastActivityAt === 'string' &&
    (value.status === 'active' || value.status === 'settled')
  );
}

function uniqueMemberIds(memberIds: PersonId[]): PersonId[] {
  return Array.from(new Set(memberIds));
}

function migrateGroupsStore(persistedState: unknown): GroupsData {
  if (!isRecord(persistedState) || !isRecord(persistedState.groups)) {
    return createInitialGroupsData();
  }

  const groups: Record<GroupId, Group> = {};
  for (const [id, group] of Object.entries(persistedState.groups)) {
    if (isGroup(group)) {
      groups[id] = group;
    }
  }

  return {
    groups,
    version: GROUPS_STORE_VERSION,
  };
}

function persistGroupsData(state: GroupsStore): GroupsData {
  return {
    groups: state.groups,
    version: state.version,
  };
}

function touchGroup(group: Group): Group {
  return {
    ...group,
    lastActivityAt: new Date().toISOString(),
  };
}

export const useGroupsStore = create<GroupsStore>()(
  persist(
    (set, get) => ({
      ...createInitialGroupsData(),
      createGroup: (input) => {
        const createdAt = input.createdAt ?? new Date().toISOString();
        const group: Group = {
          id: input.id ?? nanoid(),
          name: input.name,
          memberIds: uniqueMemberIds(input.memberIds),
          createdAt,
          lastActivityAt: input.lastActivityAt ?? createdAt,
          status: input.status ?? 'active',
        };

        set((state) => ({
          groups: {
            ...state.groups,
            [group.id]: group,
          },
          version: GROUPS_STORE_VERSION,
        }));

        return group;
      },
      addMember: (groupId, personId) => {
        const group = get().groups[groupId];
        if (group === undefined) {
          return undefined;
        }

        const nextGroup = touchGroup({
          ...group,
          memberIds: uniqueMemberIds([...group.memberIds, personId]),
        });

        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: nextGroup,
          },
          version: GROUPS_STORE_VERSION,
        }));

        return nextGroup;
      },
      removeMember: (groupId, personId) => {
        const group = get().groups[groupId];
        if (group === undefined) {
          return undefined;
        }

        const nextGroup = touchGroup({
          ...group,
          memberIds: group.memberIds.filter((memberId) => memberId !== personId),
        });

        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: nextGroup,
          },
          version: GROUPS_STORE_VERSION,
        }));

        return nextGroup;
      },
      recomputeStatus: (groupId) => {
        const group = get().groups[groupId];
        if (group === undefined) {
          return undefined;
        }

        const groupSplits = useSplitsStore.getState().selectByGroup(groupId);
        const status: GroupStatus =
          groupSplits.length > 0 &&
          groupSplits.every((split) => split.settlementStatus === 'settled')
            ? 'settled'
            : 'active';

        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: {
              ...group,
              status,
            },
          },
          version: GROUPS_STORE_VERSION,
        }));

        return status;
      },
    }),
    {
      name: GROUPS_STORE_NAME,
      storage: createJSONStorage<GroupsData>(() => AsyncStorage),
      version: GROUPS_STORE_VERSION,
      migrate: migrateGroupsStore,
      partialize: persistGroupsData,
    },
  ),
);
