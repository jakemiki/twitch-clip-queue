import axios from 'axios';
import { TokenInfo, UserInfo } from '../../common/models/twitch';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
const TWITCH_REDIRECT_URI = process.env.REACT_APP_TWITCH_REDIRECT_URI;

const defaultScopes = ['openid', 'chat:read'];

const getLoginUrl = (state: string = ''): string => {
  return encodeURI(
    `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}` +
      `&redirect_uri=${TWITCH_REDIRECT_URI}` +
      `&response_type=token` +
      `&scope=${[...defaultScopes].join(' ')}` +
      `&claims={"userinfo":{"picture":null, "preferred_username":null}}` +
      `&state=${state}`
  );
};

const redirectToLogin = (state?: string): void => {
  window.location.assign(getLoginUrl(state));
};

const validateToken = async (token: string): Promise<{ data: TokenInfo; status: number }> => {
  const { data, status } = await axios.get<TokenInfo>(`https://id.twitch.tv/oauth2/validate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { data, status };
};

const getUserInfo = async (token: string): Promise<{ data: UserInfo; status: number }> => {
  const { data, status } = await axios.get<UserInfo>(`https://id.twitch.tv/oauth2/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { data, status };
};

const revokeToken = async (token: string): Promise<void> => {
  await axios.post(`https://id.twitch.tv/oauth2/revoke`, `client_id=${TWITCH_CLIENT_ID}&token=${token}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

const twitchAuthApi = {
  getLoginUrl,
  redirectToLogin,
  revokeToken,
  validateToken,
  getUserInfo,
};

export default twitchAuthApi;
