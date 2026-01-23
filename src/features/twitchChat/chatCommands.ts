import type { AppMiddlewareAPI } from '../../app/store';
import {
  autoplayChanged,
  currentClipSkipped,
  currentClipWatched,
  isOpenChanged,
  memoryPurged,
  queueCleared,
} from '../clips/clipQueueSlice';
import { addIgnoredChatter, removeIgnoredChatter, settingsChanged } from '../settings/settingsSlice';
import { createLogger } from '../../common/logging';
import { urlDeleted, Userstate } from './actions';
import clipProvider from '../clips/providers/providers';

const logger = createLogger('Chat Command');

interface ChatCommandPayload {
  command: string;
  args: string[];
  userstate: Userstate;
}

type CommandHandler = (storeApi: AppMiddlewareAPI, args: string[], userstate: Userstate) => void;

const isModOrBroadcaster = (userstate: Userstate): boolean => {
  return Boolean(userstate.mod || userstate.broadcaster);
};

const requireModOrBroadcaster = (handler: CommandHandler): CommandHandler => {
  return (storeApi, args, userstate) => {
    if (!isModOrBroadcaster(userstate)) return;
    handler(storeApi, args, userstate);
  };
};

const commands: Record<string, CommandHandler> = {
  open: requireModOrBroadcaster((storeApi) => {
    storeApi.dispatch(isOpenChanged(true));
  }),

  close: requireModOrBroadcaster((storeApi) => {
    storeApi.dispatch(isOpenChanged(false));
  }),

  next: requireModOrBroadcaster((storeApi) => {
    storeApi.dispatch(currentClipWatched());
  }),

  skip: requireModOrBroadcaster((storeApi) => {
    storeApi.dispatch(currentClipSkipped());
  }),

  remove: (storeApi, [url], userstate) => {
    if (!url) return;

    const id = clipProvider.getIdFromUrl(url);
    if (!id) return;

    const state = storeApi.getState();
    const clip = state.clipQueue.byId[id];

    const isMod = isModOrBroadcaster(userstate);
    const isSubmitter = clip?.submitters.includes(userstate.username);

    if (isMod || isSubmitter) {
      storeApi.dispatch(urlDeleted(url));
    }
  },

  clear: requireModOrBroadcaster((storeApi) => {
    storeApi.dispatch(queueCleared());
  }),

  purgememory: requireModOrBroadcaster((storeApi) => {
    storeApi.dispatch(memoryPurged());
  }),

  autoplay: requireModOrBroadcaster((storeApi, [enabled]) => {
    if (['on', 'true', '1'].includes(enabled)) {
      storeApi.dispatch(autoplayChanged(true));
    } else if (['off', 'false', '0'].includes(enabled)) {
      storeApi.dispatch(autoplayChanged(false));
    }
  }),

  limit: requireModOrBroadcaster((storeApi, [limit]) => {
    if (!limit) return;

    if (limit === 'off' || limit === '0') {
      storeApi.dispatch(settingsChanged({ clipLimit: null }));
      return;
    }

    const parsedLimit = Number.parseInt(limit);
    if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
      storeApi.dispatch(settingsChanged({ clipLimit: parsedLimit }));
    }
  }),

  'ignore+': requireModOrBroadcaster((storeApi, [name]) => {
    storeApi.dispatch(addIgnoredChatter(name));
  }),

  'ignore-': requireModOrBroadcaster((storeApi, [name]) => {
    storeApi.dispatch(removeIgnoredChatter(name));
  }),
};

export function processCommand(storeApi: AppMiddlewareAPI, { command, args, userstate }: ChatCommandPayload) {
  logger.info(`Received '${command}' command`, args);

  const commandFunc = commands[command];

  if (commandFunc) {
    commandFunc(storeApi, args, userstate);
  }
}
