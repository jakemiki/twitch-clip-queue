import { Middleware } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import type { AppMiddlewareAPI, RootState } from '../../app/store';
import kickApi from '../../common/apis/kickApi';
import { KickChatChannel, KickChatMessage } from '../../common/models/kick';
import { getUrlFromMessage } from '../../common/utils';
import { urlDeleted, userTimedOut, Userstate } from '../chat/actions';
import { ChatConnection, connectionChanged, connectionRemoved, reconnectChat } from '../chat/chatSlice';
import { handleChatMessage } from '../chat/handleMessage';
import { channelKey } from '../chat/models';
import { selectChatChannels, settingsChanged } from '../settings/settingsSlice';

interface SocketData extends Partial<KickChatMessage> {
  activity_timeout?: number;
  message?: { id: string };
  user?: { username: string };
}

interface SocketEvent {
  event: string;
  channel?: string;
  data?: string | SocketData;
}

interface KickChatConnection {
  client?: WebSocket;
  disposed: boolean;
  subscribed: boolean;
  reconnectAttempts: number;
  activityTimeout: number;
  timers: {
    reconnect?: ReturnType<typeof setTimeout>;
    activity?: ReturnType<typeof setTimeout>;
    connection?: ReturnType<typeof setTimeout>;
  };
}

const createClient = (url: string) => {
  const client = new WebSocket(url);

  return client;
};

const parseMessage = (message: string) => {
  try {
    const event: SocketEvent = JSON.parse(message);
    if (!event || typeof event.event !== 'string') return;

    const data: SocketData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data ?? {};
    if (!data || typeof data !== 'object') return;

    return { event, data };
  } catch {
    return;
  }
};

const handleMessage =
  (storeApi: AppMiddlewareAPI, channel: KickChatChannel, messageUrls: Map<string, string | undefined>) =>
  (message: KickChatMessage) => {
    if (
      typeof message.id !== 'string' ||
      typeof message.content !== 'string' ||
      typeof message.sender?.username !== 'string' ||
      messageUrls.has(message.id)
    )
      return;

    messageUrls.set(message.id, getUrlFromMessage(message.content));
    if (messageUrls.size > 5000) messageUrls.delete(messageUrls.keys().next().value);

    const identityBadges = message.sender.identity?.badges;
    const badges = Array.isArray(identityBadges) ? identityBadges : [];
    const userstate: Userstate = {
      username: message.sender.username,
      platform: 'kick',
      broadcaster: message.sender.id === channel.user_id,
      mod: badges.some((badge) => badge.type === 'moderator'),
      subscriber: badges.some((badge) => badge.type === 'subscriber'),
      vip: badges.some((badge) => badge.type === 'vip'),
    };

    handleChatMessage(storeApi, userstate, message.content);
  };

const handleMessageDeleted =
  (storeApi: AppMiddlewareAPI, messageUrls: Map<string, string | undefined>) => (data: SocketData) => {
    if (!data.message?.id) return;

    const url = messageUrls.get(data.message.id);
    if (url) {
      storeApi.dispatch(urlDeleted(url));
    }

    messageUrls.delete(data.message.id);
  };

const handleTimeout = (storeApi: AppMiddlewareAPI) => (data: SocketData) => {
  if (typeof data.user?.username !== 'string') return;

  storeApi.dispatch(userTimedOut({ username: data.user.username, platform: 'kick' }));
};

const createConnection = (storeApi: AppMiddlewareAPI, name: string) => {
  const { dispatch } = storeApi;
  const key = `kick:${name}`;
  const abortController = new AbortController();
  const messageUrls = new Map<string, string | undefined>();
  const connection: KickChatConnection = {
    disposed: false,
    subscribed: false,
    reconnectAttempts: 0,
    activityTimeout: 120000,
    timers: {},
  };

  const updateConnection = (state: ChatConnection['state'], error?: string) => {
    if (!connection.disposed) dispatch(connectionChanged({ key, state, error }));
  };

  const disconnect = () => {
    clearTimeout(connection.timers.activity);
    clearTimeout(connection.timers.connection);

    if (!connection.client) return;

    connection.client.onmessage = null;
    connection.client.onerror = null;
    connection.client.onclose = null;

    if (connection.client.readyState < WebSocket.CLOSING) connection.client.close();

    connection.client = undefined;
    connection.subscribed = false;
  };

  const reconnect = (error?: string) => {
    if (connection.disposed || connection.timers.reconnect !== undefined) return;

    disconnect();
    updateConnection(error ? 'error' : 'reconnecting', error);

    connection.timers.reconnect = setTimeout(() => {
      connection.timers.reconnect = undefined;
      connect();
    }, Math.min(30000, 1000 * 2 ** connection.reconnectAttempts++));
  };

  const send = (event: string, data: object = {}) => {
    if (connection.client?.readyState === WebSocket.OPEN) connection.client.send(JSON.stringify({ event, data }));
  };

  const resetActivityTimeout = () => {
    clearTimeout(connection.timers.activity);
    connection.timers.activity = setTimeout(() => {
      send('pusher:ping');
      connection.timers.connection = setTimeout(() => reconnect('Kick chat stopped responding. Retrying…'), 30000);
    }, connection.activityTimeout);
  };

  const connect = async () => {
    if (connection.disposed) return;

    updateConnection(connection.reconnectAttempts ? 'reconnecting' : 'connecting');

    try {
      const channel = await kickApi.getChannel(name, abortController.signal);
      if (connection.disposed) return;

      const url = await kickApi.getChatUrl(channel.id, abortController.signal);
      if (connection.disposed) return;

      const subscription = `chatrooms.${channel.chatroom.id}.v2`;
      const messageHandler = handleMessage(storeApi, channel, messageUrls);
      const messageDeletedHandler = handleMessageDeleted(storeApi, messageUrls);
      const timeoutHandler = handleTimeout(storeApi);

      connection.subscribed = false;
      connection.client = createClient(url);
      connection.timers.connection = setTimeout(() => reconnect('Kick chat connection timed out. Retrying…'), 15000);

      connection.client.onmessage = ({ data: message }) => {
        const parsed = parseMessage(message);
        if (!parsed || connection.disposed) return;

        const { event, data } = parsed;
        if (connection.subscribed) {
          clearTimeout(connection.timers.connection);
          resetActivityTimeout();
        }

        if (event.event === 'pusher:connection_established') {
          if (
            typeof data.activity_timeout === 'number' &&
            Number.isFinite(data.activity_timeout) &&
            data.activity_timeout > 0
          ) {
            connection.activityTimeout = Math.min(data.activity_timeout * 1000, 120000);
          }

          send('pusher:subscribe', { channel: subscription });
        } else if (event.event === 'pusher:ping') {
          send('pusher:pong');
        } else if (event.event === 'pusher:error' || event.event === 'pusher:subscription_error') {
          reconnect('Kick chat connection failed. Retrying…');
        } else if (event.channel === subscription) {
          if (event.event === 'pusher_internal:subscription_succeeded') {
            connection.subscribed = true;
            connection.reconnectAttempts = 0;
            clearTimeout(connection.timers.connection);
            updateConnection('connected');
            resetActivityTimeout();
          } else if (connection.subscribed && event.event === 'App\\Events\\ChatMessageEvent') {
            messageHandler(data as KickChatMessage);
          } else if (connection.subscribed && event.event === 'App\\Events\\MessageDeletedEvent') {
            messageDeletedHandler(data);
          } else if (connection.subscribed && event.event === 'App\\Events\\UserBannedEvent') {
            timeoutHandler(data);
          }
        }
      };

      connection.client.onerror = () => reconnect('Kick chat disconnected. Retrying…');
      connection.client.onclose = () => reconnect();
    } catch {
      reconnect('Could not load this Kick channel. Check the name or retry.');
    }
  };

  connect();

  return () => {
    connection.disposed = true;
    abortController.abort();
    clearTimeout(connection.timers.reconnect);
    disconnect();
    messageUrls.clear();
  };
};

const createKickChatMiddleware = (): Middleware<{}, RootState> => {
  return (storeApi: AppMiddlewareAPI) => {
    const connections = new Map<string, () => void>();

    const disconnectChannel = (key: string) => {
      const disconnect = connections.get(key);
      if (!disconnect) return;

      connections.delete(key);
      disconnect();
      storeApi.dispatch(connectionRemoved(key));
    };

    return (next) => (action) => {
      const result = next(action);

      if (
        settingsChanged.match(action) ||
        (action.type === REHYDRATE && (action.key === 'settings' || action.key === 'clipQueue')) ||
        reconnectChat.match(action)
      ) {
        const state = storeApi.getState();
        if (state.settings._persist?.rehydrated === false || state.clipQueue._persist?.rehydrated === false) {
          return result;
        }

        if (reconnectChat.match(action)) disconnectChannel(action.payload);

        const channels = selectChatChannels(state).filter((channel) => channel.platform === 'kick');
        const wanted = new Set(channels.map(channelKey));

        connections.forEach((_, key) => {
          if (!wanted.has(key)) disconnectChannel(key);
        });

        channels.forEach((channel) => {
          const key = channelKey(channel);
          if (!connections.has(key)) connections.set(key, createConnection(storeApi, channel.name));
        });
      }

      return result;
    };
  };
};

export default createKickChatMiddleware;
