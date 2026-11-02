export type ChatPlatform = 'twitch' | 'kick';

export interface ChatChannel {
  platform: ChatPlatform;
  name: string;
}

export const channelKey = ({ platform, name }: ChatChannel) => `${platform}:${name.toLowerCase()}`;

export const chatterKey = (username: string, platform: ChatPlatform = 'twitch') =>
  `${platform}:${username.toLowerCase()}`;

export function normalizeChannel(value: string, platform: ChatPlatform): string | undefined {
  let name = value.trim();

  if (/^(https?:\/\/)?(www\.)?(kick|twitch)\.(com|tv)\//i.test(name)) {
    try {
      const url = new URL(/^https?:\/\//i.test(name) ? name : `https://${name}`);
      const host = platform === 'kick' ? 'kick.com' : 'twitch.tv';
      if (![host, `www.${host}`].includes(url.hostname) || !/^\/[^/]+\/?$/.test(url.pathname)) return;

      name = url.pathname.split('/')[1];
    } catch {
      return;
    }
  }

  name = name.replace(/^[@#]/, '').toLowerCase();
  const pattern = platform === 'kick' ? /^[a-z0-9_][a-z0-9_-]{0,24}$/ : /^[a-z0-9_]{1,25}$/;

  return pattern.test(name) ? name : undefined;
}
