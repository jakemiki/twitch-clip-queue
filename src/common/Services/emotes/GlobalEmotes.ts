import twitchApi from '../../apis/twitchApi';
import { TwitchEmote } from '../../models/twitch';

export const fetchTwitchGlobalEmotes = async (): Promise<TwitchEmote[]> => {
  try {
    const response = await twitchApi.getGlobalEmotes();
    return response.map((emote: any) => ({
      name: emote.name,
      url: emote.images.url_1x,
      type: 'twitch' as const,
    }));
  } catch (error) {
    console.error('Failed to fetch Twitch global emotes:', error);
    return [];
  }
};

export const fetchTwitchChannelEmotes = async (channelId: string): Promise<TwitchEmote[]> => {
  try {
    const response = await twitchApi.getChannelEmotes(channelId);
    return response.map((emote: any) => ({
      name: emote.name,
      url: emote.images.url_1x,
      type: 'twitch' as const,
    }));
  } catch (error) {
    console.error('Failed to fetch Twitch channel emotes:', error);
    return [];
  }
};

export const fetchAllTwitchEmotes = async (channelId?: string): Promise<TwitchEmote[]> => {
  const [globalEmotes, channelEmotes] = await Promise.all([
    fetchTwitchGlobalEmotes(),
    channelId ? fetchTwitchChannelEmotes(channelId) : Promise.resolve([]),
  ]);
  return [...globalEmotes, ...channelEmotes];
};
