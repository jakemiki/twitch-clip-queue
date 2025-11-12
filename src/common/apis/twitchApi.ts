import axios from 'axios';
import type { AppMiddlewareAPI } from '../../app/store';
import { TwitchClip, TwitchGame, TwitchVideo } from '../models/twitch';

let store: AppMiddlewareAPI;
export const injectStore = (_store: AppMiddlewareAPI) => {
  store = _store;
};

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID ?? '';
const TWITCH_CLIPS_CDN = 'https://clips-media-assets2.twitch.tv';

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
      operationName: 'VideoAccessToken_Clip',
      variables: {
        slug: id,
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11',
        },
      },
    },
  ];

  const resp = await twitchGqlClient.post('', data);
  const [respData] = resp.data;

  if (!respData.data.clip) {
    throw new Error('Clip not found');
  }

  if (!respData.data.clip.videoQualities || respData.data.clip.videoQualities.length === 0) {
    throw new Error('No video qualities available');
  }

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

const getFallbackM3u8Url = (id: string): string => {
  return `${TWITCH_CLIPS_CDN}/${id}/AT-cm%7C${id}.m3u8`;
};

const twitchApi = {
  getClip,
  getVideo,
  getGame,
  getDirectUrl,
  getFallbackM3u8Url,
};

export default twitchApi;
