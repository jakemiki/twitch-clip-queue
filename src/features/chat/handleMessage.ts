import type { AppMiddlewareAPI } from '../../app/store';
import { getUrlFromMessage } from '../../common/utils';
import { processCommand } from './chatCommands';
import { urlReceived, Userstate } from './actions';
import { chatterKey } from './models';

export function handleChatMessage(store: AppMiddlewareAPI, userstate: Userstate, message: string) {
  const { commandPrefix, ignoredChatters } = store.getState().settings;
  const username = userstate.username.toLowerCase();
  const login = (userstate.login ?? userstate.username).toLowerCase();
  const identity = chatterKey(login, userstate.platform);

  if (ignoredChatters.some((name) => [username, login, identity].includes(name.trim().toLowerCase()))) return;

  if (commandPrefix && message.startsWith(commandPrefix)) {
    const [command, ...args] = message.substring(commandPrefix.length).split(' ');
    processCommand(store, { command, args, userstate });
    return;
  }

  const url = getUrlFromMessage(message);
  if (url) store.dispatch(urlReceived({ url, userstate }));
}
