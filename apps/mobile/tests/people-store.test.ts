import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Person } from '@repo/types';

import { PEOPLE_STORE_NAME, usePeopleStore } from '../src/stores/people';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const emptyPeopleState = { people: {}, version: 1 };

function flushPersist(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('people store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    usePeopleStore.setState(emptyPeopleState);
    await flushPersist();
  });

  it('adds people and retrieves them by id', () => {
    const person = usePeopleStore.getState().addPerson({
      name: 'Ada Lovelace',
      avatarColor: '#4F46E5',
    });

    expect(usePeopleStore.getState().getById(person.id)).toEqual<Person>({
      id: person.id,
      name: 'Ada Lovelace',
      avatarColor: '#4F46E5',
      createdAt: person.createdAt,
    });
  });

  it('round-trips people through AsyncStorage rehydration', async () => {
    const person = usePeopleStore.getState().addPerson({
      name: 'Grace Hopper',
      avatarColor: '#0891B2',
    });
    await flushPersist();

    const persistedPeople = await AsyncStorage.getItem(PEOPLE_STORE_NAME);
    expect(persistedPeople).toContain(person.id);

    usePeopleStore.setState(emptyPeopleState);
    if (persistedPeople !== null) {
      await AsyncStorage.setItem(PEOPLE_STORE_NAME, persistedPeople);
    }
    await usePeopleStore.persist.rehydrate();

    expect(usePeopleStore.getState().getById(person.id)).toEqual(person);
  });

  it('migrates version 0 people data into the version 1 store', async () => {
    const legacyPerson: Person = {
      id: 'person-legacy',
      name: 'Legacy User',
      avatarColor: '#7C3AED',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    await AsyncStorage.setItem(
      PEOPLE_STORE_NAME,
      JSON.stringify({
        state: {
          people: {
            [legacyPerson.id]: legacyPerson,
          },
          version: 0,
        },
        version: 0,
      }),
    );

    await usePeopleStore.persist.rehydrate();

    expect(usePeopleStore.getState().version).toBe(1);
    expect(usePeopleStore.getState().getById(legacyPerson.id)).toEqual(legacyPerson);
  });
});
