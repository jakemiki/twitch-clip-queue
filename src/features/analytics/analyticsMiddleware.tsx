import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import { AppMiddlewareAPI, RootState } from '../../app/store';
import { trace } from './analytics';
import { authenticateWithToken } from '../auth/authSlice';
import { clipDetailsFailed, clipDetailsReceived, clipStubReceived, currentClipWatched, isOpenChanged, queueCleared } from '../clips/clipQueueSlice';
import { settingsChanged } from '../settings/settingsSlice';

const createAnalyticsMiddleware = (): Middleware<{}, RootState> => {
  return (storeApi: AppMiddlewareAPI) => {
    return (next) => (action) => {
      if (
        isAnyOf(
          clipStubReceived,
          clipDetailsReceived,
          clipDetailsFailed,
          currentClipWatched,
          isOpenChanged,
          authenticateWithToken.fulfilled,
          settingsChanged,
          queueCleared
        )(action)
      ) {
        trace(action.type);
      }
      return next(action);
    };
  };
};

export default createAnalyticsMiddleware;
