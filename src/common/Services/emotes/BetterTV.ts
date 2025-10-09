import axios from 'axios';
import { TwitchEmote } from '../../models/twitch';

const BTTV_API_BASE = 'https://api.betterttv.net/3';
const BTTV_CDN_BASE = 'https://cdn.betterttv.net/emote';

export const fetchBTTVGlobalEmotes = async (): Promise<TwitchEmote[]> => {
  try {
    const response = await axios.get(`${BTTV_API_BASE}/cached/emotes/global`);
    return response.data.map((emote: any) => ({
      name: emote.code,
      url: `${BTTV_CDN_BASE}/${emote.id}/1x`,
      type: 'bttv' as const,
    }));
  } catch (error) {
    console.error('Failed to fetch BTTV global emotes:', error);
    return [];
  }
};

export const fetchBTTVChannelEmotes = async (channelId: string): Promise<TwitchEmote[]> => {
  try {
    const response = await axios.get(`${BTTV_API_BASE}/cached/users/twitch/${channelId}`);
    const data = response.data;
    const channelEmotes =
      data.channelEmotes?.map((emote: any) => ({
        name: emote.code,
        url: `${BTTV_CDN_BASE}/${emote.id}/1x`,
        type: 'bttv' as const,
      })) || [];
    const sharedEmotes =
      data.sharedEmotes?.map((emote: any) => ({
        name: emote.code,
        url: `${BTTV_CDN_BASE}/${emote.id}/1x`,
        type: 'bttv' as const,
      })) || [];
    return [...channelEmotes, ...sharedEmotes];
  } catch (error) {
    console.error('Failed to fetch BTTV channel emotes:', error);
    return [];
  }
};

export const fetchAllBTTVEmotes = async (channelId?: string): Promise<TwitchEmote[]> => {
  const [globalEmotes, channelEmotes] = await Promise.all([
    fetchBTTVGlobalEmotes(),
    channelId ? fetchBTTVChannelEmotes(channelId) : Promise.resolve([]),
  ]);
  return [...globalEmotes, ...channelEmotes];
};
