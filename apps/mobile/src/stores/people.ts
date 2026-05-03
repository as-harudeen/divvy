import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Person, PersonId } from '@repo/types';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEV_PEOPLE } from './seed';

export const PEOPLE_STORE_NAME = 'divvy:people';
export const PEOPLE_STORE_VERSION = 1;

interface PeopleData {
  people: Record<PersonId, Person>;
  version: number;
}

interface AddPersonInput {
  name: string;
  avatarColor: string;
  id?: PersonId;
  createdAt?: string;
}

interface PeopleStore extends PeopleData {
  addPerson: (input: AddPersonInput) => Person;
  getById: (id: PersonId) => Person | undefined;
}

function createInitialPeopleData(): PeopleData {
  return {
    people: __DEV__ ? DEV_PEOPLE : {},
    version: PEOPLE_STORE_VERSION,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPerson(value: unknown): value is Person {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.avatarColor === 'string' &&
    typeof value.createdAt === 'string'
  );
}

function migratePeopleStore(persistedState: unknown): PeopleData {
  if (!isRecord(persistedState) || !isRecord(persistedState.people)) {
    return createInitialPeopleData();
  }

  const people: Record<PersonId, Person> = {};
  for (const [id, person] of Object.entries(persistedState.people)) {
    if (isPerson(person)) {
      people[id] = person;
    }
  }

  return {
    people,
    version: PEOPLE_STORE_VERSION,
  };
}

function persistPeopleData(state: PeopleStore): PeopleData {
  return {
    people: state.people,
    version: state.version,
  };
}

export const usePeopleStore = create<PeopleStore>()(
  persist(
    (set, get) => ({
      ...createInitialPeopleData(),
      addPerson: (input) => {
        const person: Person = {
          id: input.id ?? nanoid(),
          name: input.name,
          avatarColor: input.avatarColor,
          createdAt: input.createdAt ?? new Date().toISOString(),
        };

        set((state) => ({
          people: {
            ...state.people,
            [person.id]: person,
          },
          version: PEOPLE_STORE_VERSION,
        }));

        return person;
      },
      getById: (id) => get().people[id],
    }),
    {
      name: PEOPLE_STORE_NAME,
      storage: createJSONStorage<PeopleData>(() => AsyncStorage),
      version: PEOPLE_STORE_VERSION,
      migrate: migratePeopleStore,
      partialize: persistPeopleData,
    },
  ),
);
