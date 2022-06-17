import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist-indexeddb-storage';
import type { RootState } from '../../app/store';
import { legacyDataMigrated } from '../migration/legacyMigration';
import { settingsChanged } from '../settings/settingsSlice';
import { userTimedOut } from '../twitchChat/actions';

export interface Clip {
  id: string;
  submitters: string[];

  status?: 'watched' | 'removed';
  timestamp?: string;

  title?: string;
  author?: string;
  createdAt?: string;
  category?: string;

  thumbnailUrl?: string;
}

interface ClipQueueState {
  byId: Record<string, Clip>;

  currentId?: string;
  queueIds: string[];
  historyIds: string[];
  watchedClipCount: number;

  isOpen: boolean;

  autoplay: boolean;
  autoplayDelay: number;
  clipLimit?: number | null;
  providers: string[];
  layout: string;

  autoplayTimoutHandle?: number;
}

const initialState: ClipQueueState = {
  byId: {},
  queueIds: [],
  historyIds: [],
  watchedClipCount: 0,
  providers: ['twitch-clip', 'twitch-vod', 'youtube'],
  layout: 'classic',
  isOpen: false,
  autoplay: false,
  autoplayDelay: 5000,
};

const addClipToQueue = (state: ClipQueueState, clip: Clip) => {
  const id = clip.id;
  const submitter = clip.submitters[0];

  if (state.byId[id]) {
    let rememberedClip = state.byId[id];
    if (state.queueIds.includes(id)) {
      if (!rememberedClip.submitters.includes(submitter)) {
        rememberedClip = {
          ...rememberedClip,
          submitters: [...rememberedClip.submitters, submitter],
        };
        state.byId[id] = rememberedClip;

        const index = state.queueIds.indexOf(id);
        state.queueIds.splice(index, 1);

        const newIndex = state.queueIds.findIndex(
          (otherId) => state.byId[otherId].submitters.length < rememberedClip.submitters.length
        );
        if (newIndex > -1) {
          state.queueIds.splice(newIndex, 0, id);
        } else {
          state.queueIds.push(id);
        }
      }

      return;
    }
    if (rememberedClip.status) {
      return;
    }
  }

  if (!state.clipLimit || calculateTotalQueueLength(state.watchedClipCount, state.queueIds) < state.clipLimit) {
    state.queueIds.push(id);
    state.byId[id] = clip;
  }
};

const removeClipFromQueue = (state: ClipQueueState, id: string) => {
  if (state.currentId === id) {
    state.currentId = undefined;
  } else {
    const index = state.queueIds.indexOf(id);
    if (index > -1) {
      state.queueIds.splice(index, 1);
    }
  }
};

const addClipToHistory = (state: ClipQueueState, id?: string) => {
  if (!id) {
    return;
  }

  const clip = state.byId[id];

  if (clip) {
    state.historyIds.unshift(id);
  }
};

const advanceQueue = (state: ClipQueueState) => {
  state.currentId = state.queueIds.shift();
  if (state.currentId) {
    addClipToHistory(state, state.currentId);
  }
};

const updateClip = (state: ClipQueueState, id: string | undefined, clipUpdate: Partial<Clip>) => {
  if (!id) {
    return;
  }

  const clip = state.byId[id];
  if (clip) {
    state.byId[id] = {
      ...clip,
      ...clipUpdate,
    };
  }
};

const clipQueueSlice = createSlice({
  name: 'clipQueue',
  initialState,
  reducers: {
    queueCleared: (state) => {
      state.queueIds.forEach((id) => {
        delete state.byId[id];
      });
      state.currentId = undefined;
      state.autoplayTimoutHandle = undefined;
      state.queueIds = [];
      state.watchedClipCount = 0;
    },
    memoryPurged: (state) => {
      const memory = state.byId;
      state.byId = {};
      state.historyIds = [];

      if (state.currentId) {
        state.byId[state.currentId] = memory[state.currentId];
      }
      state.queueIds.forEach((id) => {
        state.byId[id] = memory[id];
      });
    },
    currentClipWatched: (state) => {
      advanceQueue(state);
      if (state.currentId) {
        state.watchedClipCount += 1;
      }
      updateClip(state, state.currentId, { status: 'watched' });
      state.autoplayTimoutHandle = undefined;
    },
    currentClipSkipped: (state) => {
      advanceQueue(state);
      updateClip(state, state.currentId, { status: 'watched' });
      state.autoplayTimoutHandle = undefined;
    },
    clipStubReceived: (state, { payload: clip }: PayloadAction<Clip>) => addClipToQueue(state, clip),
    clipDetailsReceived: (state, { payload: clip }: PayloadAction<Clip>) => {
      if (state.byId[clip.id]) {
        const submitters = state.byId[clip.id].submitters;
        updateClip(state, clip.id, {
          ...clip,
          submitters,
        });
      }
    },
    clipDetailsFailed: (state, { payload }: PayloadAction<string>) => {
      removeClipFromQueue(state, payload);
      if (state.byId[payload]) {
        delete state.byId[payload];
      }
    },
    queueClipRemoved: (state, { payload }: PayloadAction<string>) => {
      removeClipFromQueue(state, payload);
      addClipToHistory(state, payload);
      updateClip(state, payload, { status: 'removed' });
    },
    memoryClipRemoved: (state, { payload }: PayloadAction<string>) => {
      removeClipFromQueue(state, payload);
      state.historyIds = state.historyIds.filter((id) => id !== payload);
      delete state.byId[payload];
    },
    currentClipReplaced: (state, { payload }: PayloadAction<string>) => {
      const index = state.queueIds.indexOf(payload);
      if (index > -1) {
        state.queueIds.splice(index, 1);

        if (payload) {
          addClipToHistory(state, payload);
        }

        state.currentId = payload;
        state.watchedClipCount += 1;
        updateClip(state, state.currentId, { status: 'watched' });
        state.autoplayTimoutHandle = undefined;
      }
    },
    currentClipForceReplaced: (state, { payload }: PayloadAction<Clip>) => {
      state.byId[payload.id] = payload;
      state.currentId = payload.id;
      state.autoplayTimoutHandle = undefined;
    },
    isOpenChanged: (state, { payload }: PayloadAction<boolean>) => {
      state.isOpen = payload;
      if (payload) {
        state.watchedClipCount = 0;
      }
    },
    autoplayChanged: (state, { payload }: PayloadAction<boolean>) => {
      state.autoplay = payload;
    },
    autoplayTimeoutHandleChanged: (
      state,
      { payload }: PayloadAction<{ set: boolean; handle?: number | undefined }>
    ) => {
      state.autoplayTimoutHandle = payload.handle;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userTimedOut, (state, { payload }) => {
      for (const id of state.queueIds) {
        const clip = state.byId[id];
        state.byId[id] = {
          ...clip,
          submitters: clip.submitters.filter((submitter) => submitter.toLowerCase() !== payload),
        };
      }

      state.queueIds = state.queueIds.filter((id) => state.byId[id].submitters.length > 0);
    });
    builder.addCase(settingsChanged, (state, { payload }) => {
      if (payload.clipLimit !== undefined) {
        state.clipLimit = payload.clipLimit;
      }
      if (payload.enabledProviders) {
        state.providers = payload.enabledProviders;
      }
      if (payload.layout) {
        state.layout = payload.layout;
      }
    });
    builder.addCase(legacyDataMigrated, (state, { payload }) => {
      state.watchedClipCount = 0;
      state.autoplay = payload.autoplay;
      state.byId = payload.byIds;
      state.historyIds = payload.historyIds;
      state.queueIds = payload.queueIds;

      if (payload.providers) {
        state.providers = payload.providers;
      }
      if (payload.clipLimit) {
        state.clipLimit = payload.clipLimit;
      }
    });
  },
});

const selectByIds = (state: RootState) => state.clipQueue.byId;

export const selectQueueIds = (state: RootState) => state.clipQueue.queueIds;
export const selectCurrentId = (state: RootState) => state.clipQueue.currentId;
export const selectHistoryIds = (state: RootState) => state.clipQueue.historyIds;
export const selectWatchedCount = (state: RootState) => state.clipQueue.watchedClipCount;
export const selectIsOpen = (state: RootState) => state.clipQueue.isOpen;
export const selectAutoplayEnabled = (state: RootState) => state.clipQueue.autoplay;
export const selectClipLimit = (state: RootState) => state.clipQueue.clipLimit;
export const selectProviders = (state: RootState) => state.clipQueue.providers;
export const selectLayout = (state: RootState) => state.clipQueue.layout;
export const selectAutoplayTimeoutHandle = (state: RootState) => state.clipQueue.autoplayTimoutHandle;
export const selectAutoplayDelay = (state: RootState) => state.clipQueue.autoplayDelay;

export const selectClipById = (id: string) => (state: RootState) => state.clipQueue.byId[id];

export const selectNextId = createSelector([selectQueueIds], (queueIds) => queueIds[0]);
export const selectCurrentClip = createSelector([selectByIds, selectCurrentId], (byIds, id) =>
  id ? byIds[id] : undefined
);
export const selectNextClip = createSelector([selectByIds, selectNextId], (byIds, id) => byIds[id]);

const calculateTotalQueueLength = (watchedCount: number, queueIds: string[]) => {
  return watchedCount + queueIds.length;
};
export const selectTotalQueueLength = createSelector([selectWatchedCount, selectQueueIds], calculateTotalQueueLength);

export const selectClipHistoryIdsPage = createSelector(
  [selectHistoryIds, (_, page: number, perPage: number) => ({ page, perPage })],
  (historyIds, { page, perPage }) => ({
    clips: historyIds.slice((page - 1) * perPage, page * perPage),
    totalPages: Math.ceil(historyIds.length / perPage),
  })
);

export const {
  queueCleared,
  memoryPurged,
  currentClipWatched,
  currentClipSkipped,
  currentClipReplaced,
  currentClipForceReplaced,
  clipStubReceived,
  clipDetailsReceived,
  clipDetailsFailed,
  queueClipRemoved,
  memoryClipRemoved,
  isOpenChanged,
  autoplayChanged,
  autoplayTimeoutHandleChanged,
} = clipQueueSlice.actions;

const clipQueueReducer = persistReducer(
  {
    key: 'clipQueue',
    storage: storage('twitch-clip-queue'),
    version: 1,
    blacklist: ['isOpen'],
  },
  clipQueueSlice.reducer
);

export default clipQueueReducer;
