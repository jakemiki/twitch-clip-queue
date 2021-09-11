import { createLogger } from '../common/logging';
import { acceptingClips, addClip } from '../store/queue';
import { accessToken, userChannel, userName } from '../store/user';
import { Client, Userstate } from 'tmi.js';
import ClipFinder from './ClipFinder';

const logger = createLogger('Twitch Chat');

let client: Client;

const handleMessage = (userstate: Userstate, message: string) => {
  if (!acceptingClips.get()) {
    return;
  }

  const urlStart = message.indexOf('http');

  if (urlStart >= 0) {
    const urlEnd = message.indexOf(' ', urlStart);
    const url = message.slice(urlStart, urlEnd > 0 ? urlEnd : undefined);
    logger.debug('Found url:', url);

    ClipFinder.findByUrl(url).then((clip) => {
      if (clip) {
        clip.url = url;
        clip.submitter = userstate['display-name'] || userstate.username;
        addClip(clip);
      }
    });
  }
};

const connect = () => {
  client = new Client({
    options: {
      debug: process.env.REACT_APP_LOG_LEVEL === 'debug',
      skipUpdatingEmotesets: true,
      skipMembership: true,
    } as any,
    logger: {
      error: logger.error.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
    },
    identity: {
      username: userName.get() as string,
      password: `oauth:${accessToken.get()}`,
    },
    connection: {
      reconnect: true,
      secure: true,
    },
  });

  logger.info('Connecting and authenticating...');
  client
    .connect()
    .then(() => {
      logger.info('Connected.');
      joinChannel(userChannel.get() as string);
    })
    .catch(logger.error.bind(logger));

  client.on('disconnected', (reason) => logger.info('Disconnected:', reason));
  client.on('message', (_channel, userstate, message, self) => self || handleMessage(userstate, message));
  client.on('messagedeleted', (_channel, _username, message) => {});
  client.on('timeout', (_channel, username) => {})
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
