import { createLogger } from '../common/logging';
import { getUrlFromMessage } from '../common/utils';
import { acceptingClips, addClip, clipMemory, clipQueue, removeClip } from '../store/queue';
import { accessToken, userChannel, userName } from '../store/user';
import { Client, Userstate } from 'tmi.js';
import ClipFinder from './ClipFinder';
import { none } from '@hookstate/core';
import { commands } from '../common/commands';
import { same } from '../store/helpers';

const logger = createLogger('Twitch Chat');
let client: Client;

const handleMessage = (userstate: Userstate, message: string, self: boolean) => {
  if (message.startsWith('!')) {
    logger.debug('Userstate', userstate);
    if (!userstate.mod && userstate.badges?.['broadcaster'] !== '1') {
      return;
    }

    const [commandName, ...args] = message.substr(1).split(' ');

    const command = commands[commandName];
    if (!command) {
      return;
    }

    command(...args);
    return;
  }

  if (!acceptingClips.get() && !self) {
    return;
  }

  const url = getUrlFromMessage(message);

  if (url) {
    logger.debug('[handleMessage] Found url:', url);

    ClipFinder.findByUrl(url).then((clip) => {
      if (clip) {
        clip.url = url;
        clip.submitter = {
          userName: userstate.username,
          displayName: userstate['display-name'],
        };
        addClip(clip);
      }
    });
  }
};

const handleMessageDeleted = (message: string) => {
  const url = getUrlFromMessage(message);

  if (url) {
    logger.debug('[handleMessageDeleted] Found url:', url);

    ClipFinder.findByUrl(url).then((clip) => {
      if (clip) {
        removeClip(clip);
      }
    });
  }
};

const handleTimeout = (username: string) => {
  const clipsFromUser = clipQueue.filter(
    (clip) => clip.submitter.get()?.userName === username || clip.submitters.get()?.some((s) => s.userName === username)
  );

  clipsFromUser.forEach((clip) => {
    if (clip.submitter.get()?.userName === username) {
      if (!clip.submitters.get()?.length) {
        const memory = clipMemory.find((c) => same(c.get(), clip.get()));
        memory?.set(none);
        clip.set(none);
      } else {
        clip.submitter.set(clip.submitters.get()?.[0]);
        clip.submitters.set((submitters) => {
          submitters?.shift();
          return submitters;
        });
      }
    } else {
      clip.submitters.set((submitters) => submitters?.filter((s) => s.userName !== username));
    }
  });
};

const connect = () => {
  client = new Client({
    options: {
      debug: process.env.REACT_APP_LOG_LEVEL === 'debug',
      skipUpdatingEmotesets: true,
      skipMembership: true,
      messagesLogLevel: 'debug'
    } as any,
    logger: {
      error: logger.error.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
      debug: logger.debug.bind(logger),
    } as any,
    identity: {
      username: userName.get() as string,
      password: `oauth:${accessToken.get()}`,
    },
    connection: {
      reconnect: true,
      secure: true,
    },
  });

  client.on('disconnected', (reason) => logger.info('Disconnected:', reason));
  client.on('message', (_channel, userstate, message, self) => handleMessage(userstate, message, self));
  client.on('messagedeleted', (_channel, _username, message) => handleMessageDeleted(message));
  client.on('timeout', (_channel, username) => handleTimeout(username));
  client.on('ban', (_channel, username) => handleTimeout(username));

  logger.info('Connecting and authenticating...');
  client
    .connect()
    .then(() => {
      logger.info('Connected.');
      joinChannel(userChannel.get() ?? userName.get() ?? '');
    })
    .catch((error) => {
      logger.error(error);
      setTimeout(() => connect(), 5000);
    });
};

const disconnect = async () => {
  await client?.disconnect();
};

const joinChannel = async (channel: string) => {
  logger.info('Joining channel', channel);
  await client.join(channel.toLowerCase());
};

const leaveChannel = async (channel: string) => {
  logger.info('Leaving channel', channel);
  await client.part(channel.toLowerCase());
};

const TwitchChat = {
  connect,
  disconnect,
  joinChannel,
  leaveChannel,
};

export default TwitchChat;
