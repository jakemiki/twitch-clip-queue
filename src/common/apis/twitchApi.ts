import axios from 'axios';
import type { AppMiddlewareAPI } from '../../app/store';
import { TwitchClip, TwitchGame, TwitchVideo, ChatMessage, VODInfo, ChatReplayConfig } from '../models/twitch';

let store: AppMiddlewareAPI;
export const injectStore = (_store: AppMiddlewareAPI) => {
  store = _store;
};

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID ?? '';

const twitchApiClient = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {
    'Client-ID': TWITCH_CLIENT_ID,
  },
});

const twitchGqlClient = axios.create({
  baseURL: 'https://gql.twitch.tv/gql',
  headers: {
    'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
  },
});

const getDirectUrl = async (id: string): Promise<string | undefined> => {
  const data = [
    {
      operationName: 'ClipsDownloadButton',
      variables: {
        slug: id,
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: '6e465bb8446e2391644cf079851c0cb1b96928435a240f07ed4b240f0acc6f1b',
        },
      },
    },
  ];

  const resp = await twitchGqlClient.post('', data);
  const [respData] = resp.data;
  const playbackAccessToken = respData.data.clip.playbackAccessToken;
  const url =
    respData.data.clip.videoQualities[0].sourceURL +
    '?sig=' +
    playbackAccessToken.signature +
    '&token=' +
    encodeURIComponent(playbackAccessToken.value);
  return url;
};

twitchApiClient.interceptors.request.use((request) => {
  const { token } = store?.getState().auth;
  if (token) {
    request.headers = { Authorization: `Bearer ${token}`, ...request.headers };
  }
  return request;
});

const getClip = async (id: string): Promise<TwitchClip> => {
  const { data } = await twitchApiClient.get<{ data: TwitchClip[] }>(`clips?id=${id}`);
  return data.data[0];
};

const getVideo = async (id: string): Promise<TwitchVideo> => {
  const { data } = await twitchApiClient.get<{ data: TwitchVideo[] }>(`videos?id=${id}`);
  return data.data[0];
};

const getGame = async (id: string): Promise<TwitchGame> => {
  const { data } = await twitchApiClient.get<{ data: TwitchGame[] }>(`games?id=${id}`);
  return data.data[0];
};

const getGlobalEmotes = async (): Promise<any[]> => {
  const { data } = await twitchApiClient.get('chat/emotes/global');
  return data.data;
};

const getChannelEmotes = async (channelId: string): Promise<any[]> => {
  const { data } = await twitchApiClient.get(`chat/emotes?broadcaster_id=${channelId}`);
  return data.data;
};

const getClipWithVodInfo = async (clipId: string): Promise<VODInfo> => {
  const cleanClipId = clipId.replace(/^twitch-clip:/, '');

  try {
    const clipData = await getClip(cleanClipId);
    if (!clipData.video_id || clipData.video_id === '') {
      return { hasVod: false, offsetSeconds: 0 };
    }

    const vodData = await getVideo(clipData.video_id);
    let offsetSeconds: number;

    if (clipData.vod_offset !== undefined && clipData.vod_offset !== null) {
      offsetSeconds = clipData.vod_offset;
    } else {
      const clipTime = new Date(clipData.created_at).getTime();
      const vodTime = new Date(vodData.created_at).getTime();
      offsetSeconds = Math.max(0, Math.floor((clipTime - vodTime) / 1000));
    }
    return {
      videoId: clipData.video_id,
      offsetSeconds,
      hasVod: true,
      clipCreatedAt: clipData.created_at,
      vodCreatedAt: vodData.created_at,
      channelId: clipData.broadcaster_id,
      channelLogin: clipData.broadcaster_name.toLowerCase(),
    };
  } catch (error) {
    return { hasVod: false, offsetSeconds: 0 };
  }
};

const getChatReplay = async (config: ChatReplayConfig): Promise<ChatMessage[]> => {
  const { fetchChatMessages } = await import('../Services/Services');
  const { parseTwitchBadges } = await import('../Services/BadgeService');

  const badgeParser = (badgeString: string, channelId?: string) =>
    parseTwitchBadges(badgeString, channelId, twitchApiClient);
  return fetchChatMessages(config, badgeParser);
};

const twitchApi = {
  getClip,
  getVideo,
  getGame,
  getDirectUrl,
  getChatReplay,
  getClipWithVodInfo,
  getGlobalEmotes,
  getChannelEmotes,
};

export default twitchApi;
