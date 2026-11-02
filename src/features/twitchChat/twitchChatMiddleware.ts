import { Middleware } from '@reduxjs/toolkit';
import type { AppMiddlewareAPI, RootState } from '../../app/store';
import { ChatUserstate, Client, DeleteUserstate } from 'tmi.js';
import { selectChatChannels } from '../settings/settingsSlice';
import { createLogger } from '../../common/logging';
import { getUrlFromMessage } from '../../common/utils';
import { urlDeleted, userTimedOut } from '../chat/actions';
import { handleChatMessage } from '../chat/handleMessage';
import { connectionChanged, connectionRemoved, reconnectChat } from '../chat/chatSlice';
import { showNotification } from '@mantine/notifications';

const logger = createLogger('Twitch Chat');

const createTwitchChatMiddleware = (): Middleware<{}, RootState> => (store: AppMiddlewareAPI) => {
  let client: Client | undefined;
  let identity: string | undefined;
  let desired: string[] = [];
  let retry: ReturnType<typeof setTimeout> | undefined;

  const status = (state: 'connecting' | 'connected' | 'reconnecting' | 'error') => {
    desired.forEach((name) => store.dispatch(connectionChanged({ key: `twitch:${name}`, state })));
  };

  return (next) => (action) => {
    const result = next(action);

    if (connectionChanged.match(action) || connectionRemoved.match(action)) return result;
    if (action.type.startsWith('persist/') && !(action.type === 'persist/REHYDRATE' && action.key === 'settings'))
      return result;

    const state = store.getState();
    const channels = selectChatChannels(state)
      .filter((c) => c.platform === 'twitch')
      .map((c) => c.name);
    const nextIdentity =
      state.auth.state === 'authenticating'
        ? identity
        : state.auth.state === 'authenticated'
        ? state.auth.token
        : undefined;
    const retryRequested = reconnectChat.match(action) && action.payload.startsWith('twitch:');
    const changed = JSON.stringify(channels) !== JSON.stringify(desired);

    if (nextIdentity === identity && !changed && !retryRequested) return result;

    if (client && nextIdentity === identity && !retryRequested) {
      const oldChannels = desired;
      desired = channels;

      oldChannels
        .filter((name) => !channels.includes(name))
        .forEach((name) => {
          if (client?.readyState() === 'OPEN') client.part(name).catch((error) => logger.error(error));
          store.dispatch(connectionRemoved(`twitch:${name}`));
        });

      channels
        .filter((name) => !oldChannels.includes(name))
        .forEach((name) => {
          store.dispatch(connectionChanged({ key: `twitch:${name}`, state: 'connecting' }));
          if (client?.readyState() === 'OPEN') client.join(name).catch((error) => logger.error(error));
        });

      return result;
    }

    if (client) {
      clearTimeout(retry);
      client.removeAllListeners();
      client.disconnect().catch(() => {});
      client = undefined;
    }

    const oldChannels = desired;
    desired = channels;
    identity = nextIdentity;

    oldChannels
      .filter((name) => !channels.includes(name))
      .forEach((name) => store.dispatch(connectionRemoved(`twitch:${name}`)));

    if (!identity || !desired.length) {
      desired.forEach((name) => store.dispatch(connectionChanged({ key: `twitch:${name}`, state: 'disconnected' })));
      return result;
    }

    const currentClient = new Client({
      options: {
        debug: process.env.REACT_APP_LOG_LEVEL === 'debug',
        messagesLogLevel: 'debug',
        skipUpdatingEmotesets: true,
        skipMembership: true,
      },
      logger: {
        debug: logger.debug.bind(logger),
        error: logger.error.bind(logger),
        info: logger.info.bind(logger),
        warn: logger.warn.bind(logger),
      } as any,
      identity: { username: state.auth.username!, password: `oauth:${identity}` },
      connection: { reconnect: true, secure: true },
    });

    client = currentClient;
    status('connecting');

    currentClient.on('connected', () => {
      if (client !== currentClient) return;

      status('connecting');
      showNotification({
        id: 'twitch-chat',
        title: 'Twitch Chat',
        message: 'Connected',
        autoClose: true,
        color: 'indigo',
      });
      desired.forEach((name) => currentClient.join(name).catch((error) => logger.error(error)));
    });

    currentClient.on('join', (channel, _username, self) => {
      if (self && client === currentClient)
        store.dispatch(connectionChanged({ key: `twitch:${channel.replace(/^#/, '')}`, state: 'connected' }));
    });

    currentClient.on('disconnected', () => {
      if (client !== currentClient) return;

      status('reconnecting');
      logger.warn('Disconnected.');
      showNotification({ id: 'twitch-chat', title: 'Twitch Chat', message: 'Disconnected from chat.', color: 'red' });
    });

    currentClient.on('reconnect', () => {
      if (client !== currentClient) return;

      status('reconnecting');
      logger.warn('Reconnect.');
      showNotification({
        id: 'twitch-chat',
        title: 'Twitch Chat',
        message: 'Disconnected from chat, trying to reconnect...',
        color: 'red',
      });
    });

    currentClient.on('redeem', (channel, username, type, tags) => logger.info('redeem', channel, username, type, tags));

    currentClient.on('message', (_channel: string, user: ChatUserstate, message: string) => {
      if (client !== currentClient) return;

      handleChatMessage(
        store,
        {
          username: user['display-name'] ?? user.username ?? 'Twitch Chat User',
          login: user.username,
          platform: 'twitch',
          mod: user.mod,
          subscriber: user.subscriber,
          broadcaster: Boolean(user.badges?.broadcaster),
          vip: Boolean(user.badges?.vip),
        },
        message
      );
    });

    currentClient.on(
      'messagedeleted',
      (_channel: string, _username: string, message: string, _tags: DeleteUserstate) => {
        const url = getUrlFromMessage(message);
        if (url) store.dispatch(urlDeleted(url));
      }
    );

    const timeout = (_channel: string, username: string) =>
      store.dispatch(userTimedOut({ username, platform: 'twitch' }));

    currentClient.on('timeout', timeout);
    currentClient.on('ban', timeout);

    const connect = () =>
      currentClient.connect().catch((error) => {
        if (client !== currentClient) return;

        logger.error(error);
        status('error');
        retry = setTimeout(connect, 5000);
      });

    connect();

    return result;
  };
};

export default createTwitchChatMiddleware;
