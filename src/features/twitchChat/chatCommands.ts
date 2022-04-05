import type { AppMiddlewareAPI } from '../../app/store';
import {
  autoplayChanged,
  currentClipSkipped,
  currentClipWatched,
  isOpenChanged,
  memoryPurged,
  queueCleared,
} from '../clips/clipQueueSlice';
import { settingsChanged } from '../settings/settingsSlice';
import { createLogger } from '../../common/logging';
import { urlDeleted, Userstate } from './actions';

const logger = createLogger('Chat Command');

type Dispatch = AppMiddlewareAPI['dispatch'];

interface ChatCommandPayload {
  command: string;
  args: string[];
  userstate: Userstate;
}

type CommmandFunction = (dispatch: Dispatch, args: string[]) => void;

const commands: Record<string, CommmandFunction> = {
  open: (dispatch) => dispatch(isOpenChanged(true)),
  close: (dispatch) => dispatch(isOpenChanged(false)),
  next: (dispatch) => dispatch(currentClipWatched()),
  skip: (dispatch) => dispatch(currentClipSkipped()),
  remove: (dispatch, [url]) => url && dispatch(urlDeleted(url)),
  clear: (dispatch) => dispatch(queueCleared()),
  purgememory: (dispatch) => dispatch(memoryPurged()),
  autoplay: (dispatch, [enabled]) => {
    if (['on', 'true', '1'].includes(enabled)) {
      dispatch(autoplayChanged(true));
    } else if (['off', 'false', '0'].includes(enabled)) {
      dispatch(autoplayChanged(false));
    }
  },
  limit: (dispatch, [limit]) => {
    if (!limit) {
      return;
    }

    if (limit === 'off' || limit === '0') {
      dispatch(settingsChanged({ clipLimit: null }));
    }

    const parsedLimit = Number.parseInt(limit);

    if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
      dispatch(settingsChanged({ clipLimit: parsedLimit }));
    }
  },
};

export function processCommand(dispatch: Dispatch, { command, args, userstate }: ChatCommandPayload) {
  if (!userstate.mod && !userstate.broadcaster) {
    return;
  }

  logger.info(`Received '${command}' command`, args);

  const commandFunc = commands[command];

  if (commandFunc) {
    commandFunc(dispatch, args);
  }
}
