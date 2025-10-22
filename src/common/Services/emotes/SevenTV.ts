import axios from 'axios';
import { TwitchEmote } from '../../models/twitch';

const SEVENTV_API_BASE = 'https://7tv.io/v3';
const SEVENTV_CDN_BASE = 'https://cdn.7tv.app/emote';
const SEVENTV_EMOTE_BASE = 'https://7tv.app/emotes';

export const fetch7TVGlobalEmotes = async (): Promise<TwitchEmote[]> => {
  try {
    const response = await axios.get(`${SEVENTV_API_BASE}/emote-sets/global`);
    const data = response.data;
    return (
      data.emotes?.map((emote: any) => ({
        name: emote.name,
        url: `${SEVENTV_CDN_BASE}/${emote.id}/1x.webp`,
        type: '7tv' as const,
      })) || []
    );
  } catch (error) {
    console.error('Failed to fetch 7TV global emotes:', error);
    return [];
  }
};

export const fetch7TVChannelEmotes = async (channelId: string): Promise<TwitchEmote[]> => {
  try {
    const response = await axios.get(`${SEVENTV_API_BASE}/users/twitch/${channelId}`);
    const data = response.data;
    return (
      data.emote_set?.emotes?.map((emote: any) => ({
        name: emote.name,
        url: `${SEVENTV_CDN_BASE}/${emote.id}/1x.webp`,
        type: '7tv' as const,
      })) || []
    );
  } catch (error) {
    console.error('Failed to fetch 7TV channel emotes:', error);
    return [];
  }
};

export const fetchAll7TVEmotes = async (channelId?: string): Promise<TwitchEmote[]> => {
  const [globalEmotes, channelEmotes] = await Promise.all([
    fetch7TVGlobalEmotes(),
    channelId ? fetch7TVChannelEmotes(channelId) : Promise.resolve([]),
  ]);
  return [...globalEmotes, ...channelEmotes];
};

export const get7TVEmoteUrl = (emoteId: string): string => {
  return `${SEVENTV_EMOTE_BASE}/${emoteId}`;
};
