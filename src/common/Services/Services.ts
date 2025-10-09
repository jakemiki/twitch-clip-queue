import { ChatMessage, ChatReplayConfig, JustlogResponse, TwitchBadge } from '../models/twitch';
import axios from 'axios';

export const CHAT_LOG_SERVICES = ['https://logs.ivr.fi', 'https://logs.spanix.team', 'https://logs.susgee.dev'];

type BadgeParserFunction = (badgeString: string, channelId?: string) => Promise<TwitchBadge[]>;

export const fetchChatMessages = async (
  config: ChatReplayConfig,
  badgeParser: BadgeParserFunction
): Promise<ChatMessage[]> => {
  const { offsetSeconds, duration, channelLogin, vodStartTime } = config;

  const clipStartTime = vodStartTime.getTime() + offsetSeconds * 1000;
  const clipEndTime = clipStartTime + duration * 1000;

  for (let i = 0; i < CHAT_LOG_SERVICES.length; i++) {
    const serviceUrl = CHAT_LOG_SERVICES[i];
    try {
      const bufferMs = 2 * 60 * 1000;
      const fromDate = new Date(clipStartTime - bufferMs);
      const toDate = new Date(clipEndTime + bufferMs);

      const apiUrl = `${serviceUrl}/channel/${channelLogin}?from=${fromDate.toISOString()}&to=${toDate.toISOString()}&jsonBasic=true`;

      const response = await axios.get<JustlogResponse>(apiUrl, {
        timeout: 15000,
        headers: { Accept: 'application/json' },
      });

      if (response.data?.messages && Array.isArray(response.data.messages)) {
        const filteredMessages = response.data.messages
          .filter((msg) => {
            const msgTime = new Date(msg.timestamp).getTime();
            return msgTime >= clipStartTime && msgTime <= clipEndTime;
          })
          .filter((msg, index) => {
            const msgTime = new Date(msg.timestamp);
            const offsetFromClipStart = (msgTime.getTime() - clipStartTime) / 1000;
            return Math.max(0, offsetFromClipStart) <= duration;
          });

        const chatMessages = await Promise.all(
          filteredMessages.map(async (msg, index) => {
            const msgTime = new Date(msg.timestamp);
            const offsetFromClipStart = (msgTime.getTime() - clipStartTime) / 1000;
            return {
              id: msg.id || `chat-${index}`,
              message: {
                fragments: [{ text: msg.text }],
              },
              commenter: {
                displayName: msg.displayName,
                login: msg.displayName.toLowerCase(),
                color: msg.tags.color || '#8A2BE2',
                badges: await badgeParser(msg.tags.badges || '', config.channelId),
              },
              contentOffsetSeconds: Math.max(0, offsetFromClipStart),
              createdAt: msg.timestamp,
            };
          })
        );
        const sortedMessages = chatMessages.sort((a, b) => a.contentOffsetSeconds - b.contentOffsetSeconds);
        if (sortedMessages.length > 0) {
          return sortedMessages;
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Service ${i + 1} failed: ${errorMsg}`);
      continue;
    }
  }
  return [
    {
      id: 'Apex_Tame',
      message: { fragments: [{ text: 'No chat messages found for this clip timeframe' }] },
      commenter: {
        displayName: 'Apex_Tame',
        login: 'Apex_Tame',
        color: '#9146FF',
        badges: [],
      },
      contentOffsetSeconds: 0,
      createdAt: new Date().toISOString(),
    },
  ];
};
