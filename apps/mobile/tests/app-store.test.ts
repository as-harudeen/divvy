import AsyncStorage from '@react-native-async-storage/async-storage';

import { APP_STORE_NAME, useAppStore } from '../src/stores/app';
import { usePeopleStore } from '../src/stores/people';
import { DEV_PERSON_IDS } from '../src/stores/seed';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const emptyAppState = { activeGroupId: null, userPersonId: null, version: 1 };
const emptyPeopleState = { people: {}, version: 1 };

describe('app store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAppStore.setState(emptyAppState);
    usePeopleStore.setState(emptyPeopleState);
  });

  it('sets the active group', () => {
    useAppStore.getState().setActiveGroup('group-1');

    expect(useAppStore.getState().activeGroupId).toBe('group-1');
  });

  it('bootstraps a user person idempotently', () => {
    const firstPerson = useAppStore.getState().bootstrapUser();
    const secondPerson = useAppStore.getState().bootstrapUser();

    expect(secondPerson).toEqual(firstPerson);
    expect(useAppStore.getState().userPersonId).toBe(firstPerson.id);
    expect(Object.values(usePeopleStore.getState().people)).toEqual([firstPerson]);
    expect(firstPerson).toMatchObject({
      name: 'You',
      avatarColor: '#2563EB',
    });
  });

  it('recreates the deterministic dev user when app state references a missing seeded person', () => {
    useAppStore.setState({
      activeGroupId: null,
      userPersonId: DEV_PERSON_IDS.you,
      version: 1,
    });

    const person = useAppStore.getState().bootstrapUser();

    expect(person).toMatchObject({
      id: DEV_PERSON_IDS.you,
      name: 'You',
      avatarColor: '#2563EB',
    });
    expect(useAppStore.getState().userPersonId).toBe(DEV_PERSON_IDS.you);
    expect(Object.values(usePeopleStore.getState().people)).toEqual([person]);
  });

  it('round-trips app state through AsyncStorage rehydration', async () => {
    const user = useAppStore.getState().bootstrapUser();
    useAppStore.getState().setActiveGroup('group-saved');

    const persistedApp = await AsyncStorage.getItem(APP_STORE_NAME);
    expect(persistedApp).toContain('group-saved');
    expect(persistedApp).toContain(user.id);

    useAppStore.setState(emptyAppState);
    if (persistedApp !== null) {
      await AsyncStorage.setItem(APP_STORE_NAME, persistedApp);
    }

    await useAppStore.persist.rehydrate();

    expect(useAppStore.getState().activeGroupId).toBe('group-saved');
    expect(useAppStore.getState().userPersonId).toBe(user.id);
  });
});
