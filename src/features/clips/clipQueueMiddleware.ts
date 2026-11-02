import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';
import { REHYDRATE } from 'redux-persist';
import { RootState, AppMiddlewareAPI } from '../../app/store';
import { createLogger } from '../../common/logging';
import { authenticateWithToken } from '../auth/authSlice';
import { settingsChanged } from '../settings/settingsSlice';
import { urlDeleted, urlReceived } from '../chat/actions';
import {
  clipStubReceived,
  queueClipRemoved,
  Clip,
  clipDetailsReceived,
  clipDetailsFailed,
  autoplayTimeoutHandleChanged,
  currentClipWatched,
  currentClipReplaced,
  currentClipSkipped,
  queueCleared,
  autoplayUrlFailed,
  autoplayUrlReceived,
  isOpenChanged,
  autoplayChanged,
  previousClipWatched,
  currentClipForceReplaced,
} from './clipQueueSlice';
import { applyCustomizations } from './customization/customization';
import clipProvider from './providers/providers';
import { chatterKey } from '../chat/models';

const logger = createLogger('ClipQueueMiddleware');

const createClipQueueMiddleware = (): Middleware<{}, RootState> => {
  return (storeAPI: AppMiddlewareAPI) => {
    return (next) => (action) => {
      if (action.type === REHYDRATE && action.key === 'clipQueue') {
        clipProvider.setProviders(action.payload?.providers ?? storeAPI.getState().clipQueue.providers);
      } else if (action.type === REHYDRATE && action.key === 'settings') {
        storeAPI.dispatch(
          isOpenChanged(action.payload?.initialQueueOpen ?? storeAPI.getState().settings.initialQueueOpen)
        );
      } else if (urlReceived.match(action)) {
        const { url, userstate } = action.payload;
        const sender = userstate.username;
        if (storeAPI.getState().clipQueue.isOpen) {
          const id = clipProvider.getIdFromUrl(url);
          if (id) {
            const clip: Clip | undefined = storeAPI.getState().clipQueue.byId[id];

            storeAPI.dispatch(
              clipStubReceived({
                id,
                submitters: [sender],
                submitterIds: [chatterKey(userstate.login ?? sender, userstate.platform)],
                timestamp: formatISO(new Date()),
              })
            );

            if (!clip && storeAPI.getState().clipQueue.byId[id]) {
              clipProvider
                .getClipById(id)
                .then((clip) => {
                  if (clip) {
                    storeAPI.dispatch(clipDetailsReceived(clip));
                  } else {
                    storeAPI.dispatch(clipDetailsFailed(id));
                  }
                })
                .catch((e) => {
                  logger.error(e);
                  storeAPI.dispatch(clipDetailsFailed(id));
                });
            }
          }
        }
      } else if (urlDeleted.match(action)) {
        const id = clipProvider.getIdFromUrl(action.payload);
        if (id) {
          storeAPI.dispatch(queueClipRemoved(id));
        }
      } else if (settingsChanged.match(action)) {
        const { enabledProviders } = action.payload;
        if (enabledProviders) {
          clipProvider.setProviders(enabledProviders);
        }
      } else if (autoplayTimeoutHandleChanged.match(action)) {
        if (!action.payload.handle) {
          if (action.payload.set) {
            const delay = storeAPI.getState().clipQueue.autoplayDelay;
            const handle = setTimeout(() => {
              storeAPI.dispatch(currentClipWatched());
            }, delay);
            action.payload.handle = handle as any;
          } else {
            const handle = storeAPI.getState().clipQueue.autoplayTimeoutHandle;
            clearTimeout(handle);
          }
        }
      } else if (autoplayChanged.match(action) && !action.payload) {
        storeAPI.dispatch(autoplayTimeoutHandleChanged({ set: false }));
      } else if (
        isAnyOf(
          currentClipWatched,
          currentClipReplaced,
          currentClipSkipped,
          previousClipWatched,
          currentClipForceReplaced,
          queueCleared
        )(action)
      ) {
        const handle = storeAPI.getState().clipQueue.autoplayTimeoutHandle;
        clearTimeout(handle);

        if (previousClipWatched.match(action) || currentClipForceReplaced.match(action)) {
          storeAPI.dispatch(autoplayTimeoutHandleChanged({ set: false }));
          return next(action);
        }
        const { autoplay, queueIds } = storeAPI.getState().clipQueue;
        const nextId = queueIds[0];
        if (autoplay && nextId) {
          clipProvider
            .getAutoplayUrl(nextId)
            .then((url) => {
              if (url) {
                storeAPI.dispatch(autoplayUrlReceived(url));
              } else {
                storeAPI.dispatch(autoplayUrlFailed());
              }
            })
            .catch((e) => {
              logger.error(e);
              storeAPI.dispatch(autoplayUrlFailed());
            });
        }
      } else if (isAnyOf(autoplayUrlFailed)(action)) {
        const handle = storeAPI.getState().clipQueue.autoplayTimeoutHandle;
        clearTimeout(handle);
      } else if (authenticateWithToken.fulfilled.match(action)) {
        applyCustomizations(storeAPI);
      }

      return next(action);
    };
  };
};

export default createClipQueueMiddleware;
