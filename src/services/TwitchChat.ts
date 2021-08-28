import { addClip } from '../store/queue';
import { accessToken, userChannel, userName } from '../store/user';
import ClipFinder from './ClipFinder';

let socket: WebSocket;

const send = (message: string) => {
  socket.send(message);
};

const parseMessage = (raw: string) => {
  const tagEnd = raw[0] === '@' ? raw.indexOf(' ') : -1;
  const userEnd = raw.indexOf(' ', tagEnd + 1);
  const commandEnd = raw.indexOf(' ', userEnd + 1);

  const tags =
    tagEnd > 0
      ? raw
          .slice(1, tagEnd)
          .split(';')
          .reduce((t, c) => {
            const parts = c.split('=', 2);
            t[parts[0]] = parts[1];
            return t;
          }, {} as Record<string, string>)
      : {};

  const user = raw.slice(tagEnd + 2, raw.indexOf('!', tagEnd + 2));
  const command = raw.slice(userEnd + 1, commandEnd);

  if (command === 'PRIVMSG') {
    const channelEnd = raw.indexOf(' ', commandEnd + 1);
    const messageStart = raw.indexOf(':', channelEnd + 1);
    const channel = raw.slice(commandEnd + 2, channelEnd);
    const message = raw.slice(messageStart + 1).trim();
    return {
      channel,
      user: tags['display-name'] || user,
      command,
      message,
      tags,
    };
  }

  return {
    raw,
    user: tags['display-name'] || user,
    command,
    tags,
  };
};

const connect = () => {
  socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443', 'irc');

  socket.onopen = () => {
    if (socket !== null && socket.readyState === 1) {
      console.log('[TwitchChat] Connecting and authenticating...');

      send('CAP REQ :twitch.tv/tags');
      send(`PASS oauth:${accessToken.get()}`);
      send(`NICK ${userName.get()}`);
      joinChannel(userChannel.get() as string);
    }
  };

  socket.onclose = () => {
    console.log('[TwitchChat] Disconnected');
  };

  socket.onerror = (error) => {
    console.warn('[TwitchChat] Error:', error);
  };

  socket.onmessage = ({ data }: MessageEvent<string>) => {
    if (data.startsWith('PING')) {
      send('PONG :tmi.twitch.tv');
    }

    const message = parseMessage(data);

    if (message.command === 'PRIVMSG' && message.message) {
      const urlStart = message.message.indexOf('http');

      if (urlStart >= 0) {
        const urlEnd = message.message.indexOf(' ', urlStart);
        const url = message.message.slice(urlStart, urlEnd > 0 ? urlEnd : undefined);
        console.log('[TwitchChat] Found url:', url);

        ClipFinder.findByUrl(url).then((clip) => {
          if (clip) {
            clip.submitter = message.user;
            addClip(clip);
          }
        });
      }
    }
  };
};

const disconnect = () => {
  socket.close();
};

const joinChannel = (channel: string) => {
  console.log('[TwitchChat] Joining channel', channel);
  send(`JOIN #${channel}`);
};

const leaveChannel = (channel: string) => {
  console.log('[TwitchChat] Leaving channel', channel);
  send(`PART #${channel}`);

};

const TwitchChat = {
  connect,
  disconnect,
  joinChannel,
  leaveChannel,
};

export default TwitchChat;
