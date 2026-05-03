import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GroupId, Person, PersonId } from '@repo/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { usePeopleStore } from './people';
import { DEV_GROUP_IDS, DEV_PERSON_IDS } from './seed';

export const APP_STORE_NAME = 'divvy:app';
export const APP_STORE_VERSION = 1;

interface AppData {
  activeGroupId: GroupId | null;
  userPersonId: PersonId | null;
  version: number;
}

interface AppStore extends AppData {
  setActiveGroup: (groupId: GroupId | null) => void;
  bootstrapUser: () => Person;
}

function createInitialAppData(): AppData {
  return {
    activeGroupId: __DEV__ ? DEV_GROUP_IDS.apartment : null,
    userPersonId: __DEV__ ? DEV_PERSON_IDS.you : null,
    version: APP_STORE_VERSION,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function migrateAppStore(persistedState: unknown): AppData {
  if (!isRecord(persistedState)) {
    return createInitialAppData();
  }

  return {
    activeGroupId:
      typeof persistedState.activeGroupId === 'string' ? persistedState.activeGroupId : null,
    userPersonId:
      typeof persistedState.userPersonId === 'string' ? persistedState.userPersonId : null,
    version: APP_STORE_VERSION,
  };
}

function persistAppData(state: AppStore): AppData {
  return {
    activeGroupId: state.activeGroupId,
    userPersonId: state.userPersonId,
    version: state.version,
  };
}

function findExistingUserPerson(userPersonId: PersonId | null): Person | undefined {
  const peopleStore = usePeopleStore.getState();

  if (userPersonId !== null) {
    const userPerson = peopleStore.getById(userPersonId);
    if (userPerson !== undefined) {
      return userPerson;
    }
  }

  return Object.values(peopleStore.people).find((person) => person.name === 'You');
}

function userPersonInputFor(userPersonId: PersonId | null): {
  name: string;
  avatarColor: string;
  id?: PersonId;
} {
  const baseInput = {
    name: 'You',
    avatarColor: '#2563EB',
  };

  if (__DEV__ && userPersonId === DEV_PERSON_IDS.you) {
    return {
      ...baseInput,
      id: DEV_PERSON_IDS.you,
    };
  }

  return baseInput;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...createInitialAppData(),
      setActiveGroup: (groupId) => {
        set({
          activeGroupId: groupId,
          version: APP_STORE_VERSION,
        });
      },
      bootstrapUser: () => {
        const existingUser = findExistingUserPerson(get().userPersonId);
        if (existingUser !== undefined) {
          set({
            userPersonId: existingUser.id,
            version: APP_STORE_VERSION,
          });
          return existingUser;
        }

        const person = usePeopleStore.getState().addPerson(userPersonInputFor(get().userPersonId));
        set({
          userPersonId: person.id,
          version: APP_STORE_VERSION,
        });

        return person;
      },
    }),
    {
      name: APP_STORE_NAME,
      storage: createJSONStorage<AppData>(() => AsyncStorage),
      version: APP_STORE_VERSION,
      migrate: migrateAppStore,
      partialize: persistAppData,
    },
  ),
);
