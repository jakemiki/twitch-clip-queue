import { configureStore, combineReducers, MiddlewareAPI } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createAnalyticsMiddleware from '../features/analytics/analyticsMiddleware';
import authReducer from '../features/auth/authSlice';
import createClipQueueMiddleware from '../features/clips/clipQueueMiddleware';
import clipQueueReducer from '../features/clips/clipQueueSlice';
import { tryMigrateLegacyData } from '../features/migration/legacyMigration';
import settingsReducer from '../features/settings/settingsSlice';
import createTwitchChatMiddleware from '../features/twitchChat/twitchChatMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  clipQueue: clipQueueReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(createTwitchChatMiddleware(), createClipQueueMiddleware(), createAnalyticsMiddleware()),
});


export const persistor = persistStore(store, undefined, () => {
  tryMigrateLegacyData(store.dispatch);
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkConfig = { dispatch: AppDispatch; state: RootState };
export type AppMiddlewareAPI = MiddlewareAPI<AppDispatch, RootState>;
