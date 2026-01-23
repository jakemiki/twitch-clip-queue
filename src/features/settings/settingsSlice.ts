import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist-indexeddb-storage';
import type { RootState } from '../../app/store';
import { authenticateWithToken } from '../auth/authSlice';
import { legacyDataMigrated } from '../migration/legacyMigration';
import { AllSettings, ColorScheme } from './models';

interface SettingsState {
  colorScheme: ColorScheme | null;
  channel?: string;
  commandPrefix: string;
  volume: number | undefined;
  ignoredChatters: string[];
  initialQueueOpen: boolean;
  platformIconMode: 'colored' | 'grayscale' | 'disabled';
}

const initialState: SettingsState = {
  colorScheme: null,
  commandPrefix: '!queue',
  platformIconMode: 'colored',
  volume: 1,
  ignoredChatters: [
    'streamlabs',
    'nightbot',
    'streamelements',
    'fossabot',
    'moobot',
    'sery_bot',
    'wizebot',
    'kofistreambot',
  ],
  initialQueueOpen: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    colorSchemeToggled: (state, { payload }: PayloadAction<ColorScheme>) => {
      state.colorScheme = (state.colorScheme ?? payload) === 'dark' ? 'light' : 'dark';
    },
    channelChanged: (state, { payload }: PayloadAction<string>) => {
      state.channel = payload;
    },
    settingsChanged: (state, { payload }: PayloadAction<AllSettings>) => {
      if (payload.channel) {
        state.channel = payload.channel;
      }
      if (payload.colorScheme) {
        state.colorScheme = payload.colorScheme;
      }
      if (payload.commandPrefix) {
        state.commandPrefix = payload.commandPrefix;
      }
      if (payload.ignoredChatters || payload.ignoredChatters === '') {
        state.ignoredChatters = payload.ignoredChatters
          .split('\n')
          .map((x) => x.trim())
          .filter((c) => !!c);
      }
      if (payload.initialQueueOpen !== undefined) {
        state.initialQueueOpen = payload.initialQueueOpen === 'true';
      }
      if (payload.platformIconMode) {
        state.platformIconMode = payload.platformIconMode;
      }
    },
    setVolume: (state, action: PayloadAction<number | undefined>) => {
      state.volume = action.payload;
    },
    addIgnoredChatter: (state, action: PayloadAction<string>) => {
      state.ignoredChatters = [...state.ignoredChatters, action.payload.trim()].filter((c) => !!c);
    },
    removeIgnoredChatter: (state, action: PayloadAction<string>) => {
      state.ignoredChatters = state.ignoredChatters.filter((c) => c !== action.payload.trim()).filter((c) => !!c);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authenticateWithToken.fulfilled, (state, { payload }) => {
      if (!state.channel) {
        state.channel = payload.username;
      }
    });
    builder.addCase(legacyDataMigrated, (state, { payload }) => {
      if (payload.channel) {
        state.channel = payload.channel;
      }
    });
  },
});

const selectSettings = (state: RootState): SettingsState => state.settings;
export const { setVolume } = settingsSlice.actions;
export const selectChannel = (state: RootState) => state.settings.channel;
export const selectCommandPrefix = (state: RootState) => state.settings.commandPrefix;
export const selectIgnoredChatters = (state: RootState) => state.settings.ignoredChatters;
export const selectInitialQueueOpen = (state: RootState) => state.settings.initialQueueOpen;
export const selectPlatformIconMode = (state: RootState) => state.settings.platformIconMode;

export const selectColorScheme = createSelector(
  [selectSettings, (_, defaultColorScheme: ColorScheme) => defaultColorScheme],
  (state, defaultColorScheme) => state.colorScheme ?? defaultColorScheme
);

export const { colorSchemeToggled, channelChanged, settingsChanged, addIgnoredChatter, removeIgnoredChatter } =
  settingsSlice.actions;

const settingsReducer = persistReducer(
  {
    key: 'settings',
    version: 1,
    storage: storage('twitch-clip-queue'),
  },
  settingsSlice.reducer
);

export default settingsReducer;
