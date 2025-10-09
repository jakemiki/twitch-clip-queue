import { TwitchEmote } from '../../models/twitch';
import { fetchAllTwitchEmotes } from './GlobalEmotes';
import { fetchAll7TVEmotes } from './SevenTV';
import { fetchAllBTTVEmotes } from './BetterTV';
import { fetchAllFFZEmotes } from './FrankerFaceZ';

export const fetchAllEmotes = async (channelId?: string): Promise<TwitchEmote[]> => {
  try {
    const [twitchEmotes, seventvEmotes, bttvEmotes, ffzEmotes] = await Promise.all([
      fetchAllTwitchEmotes(channelId),
      fetchAll7TVEmotes(channelId),
      fetchAllBTTVEmotes(channelId),
      fetchAllFFZEmotes(channelId),
    ]);
    const allEmotes = [...twitchEmotes, ...seventvEmotes, ...bttvEmotes, ...ffzEmotes];
    return allEmotes;
  } catch (error) {
    console.error('Failed to fetch emotes:', error);
    return [];
  }
};

export const createEmoteMap = (emotes: TwitchEmote[]): Map<string, TwitchEmote> => {
  const emoteMap = new Map<string, TwitchEmote>();
  emotes.forEach((emote) => {
    emoteMap.set(emote.name, emote);
  });
  return emoteMap;
};

export const parseEmotesInText = (
  text: string,
  emoteMap: Map<string, TwitchEmote>
): Array<{ text: string; emote?: TwitchEmote }> => {
  const words = text.split(' ');
  const fragments: Array<{ text: string; emote?: TwitchEmote }> = [];
  words.forEach((word, index) => {
    const emote = emoteMap.get(word);
    if (emote) {
      fragments.push({ text: word, emote });
    } else {
      fragments.push({ text: word });
    }
    if (index < words.length - 1) {
      fragments.push({ text: ' ' });
    }
  });
  return fragments;
};
