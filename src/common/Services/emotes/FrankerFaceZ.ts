import axios from 'axios';
import { TwitchEmote } from '../../models/twitch';

const FFZ_API_BASE = 'https://api.frankerfacez.com/v1';
const FFZ_EMOTE_BASE = 'https://www.frankerfacez.com/emoticons';

export const fetchFFZGlobalEmotes = async (): Promise<TwitchEmote[]> => {
  try {
    const response = await axios.get(`${FFZ_API_BASE}/set/global`);
    const data = response.data;
    const emotes: TwitchEmote[] = [];
    Object.values(data.sets).forEach((set: any) => {
      set.emoticons?.forEach((emote: any) => {
        const urls = emote.urls;
        const url = urls['1'] || urls['2'] || urls['4'];
        if (url) {
          emotes.push({
            name: emote.name,
            url: `https:${url}`,
            type: 'ffz' as const,
          });
        }
      });
    });
    return emotes;
  } catch (error) {
    console.error('Failed to fetch FFZ global emotes:', error);
    return [];
  }
};

export const fetchFFZChannelEmotes = async (channelId: string): Promise<TwitchEmote[]> => {
  try {
    const response = await axios.get(`${FFZ_API_BASE}/room/id/${channelId}`);
    const data = response.data;
    const emotes: TwitchEmote[] = [];
    if (data.room?.set && data.sets[data.room.set]) {
      const roomSet = data.sets[data.room.set];
      roomSet.emoticons?.forEach((emote: any) => {
        const urls = emote.urls;
        const url = urls['1'] || urls['2'] || urls['4'];
        if (url) {
          emotes.push({
            name: emote.name,
            url: `https:${url}`,
            type: 'ffz' as const,
          });
        }
      });
    }
    return emotes;
  } catch (error) {
    console.error('Failed to fetch FFZ channel emotes:', error);
    return [];
  }
};

export const fetchAllFFZEmotes = async (channelId?: string): Promise<TwitchEmote[]> => {
  const [globalEmotes, channelEmotes] = await Promise.all([
    fetchFFZGlobalEmotes(),
    channelId ? fetchFFZChannelEmotes(channelId) : Promise.resolve([]),
  ]);
  return [...globalEmotes, ...channelEmotes];
};

export const getFFZEmoteUrl = (emoteId: string, emoteName: string): string => {
  return `${FFZ_EMOTE_BASE}/${emoteId}-${emoteName}`;
};
