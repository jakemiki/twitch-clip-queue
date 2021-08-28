import axios from 'axios';
import { TwitchClip, TwitchGame } from '../models';
import { accessToken } from '../store/user';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;

const TwitchApiClient = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {
    'Client-ID': TWITCH_CLIENT_ID,
  },
});

const getClip = async (id: string): Promise<TwitchClip> => {
  const { data } = await TwitchApiClient.get<{ data: TwitchClip[] }>(`clips?id=${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken.get()}`,
    },
  });

  return data.data[0];
};

const getGame = async (id: string): Promise<TwitchGame> => {
  const { data } = await TwitchApiClient.get<{ data: TwitchGame[] }>(`games?id=${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken.get()}`,
    },
  });

  return data.data[0];
};

const TwitchApi = {
  getClip,
  getGame,
};

export default TwitchApi;
