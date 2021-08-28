import axios from 'axios';
import { AuthInfo, IdToken } from '../models';
import { logIn } from '../store/user';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
const TWITCH_REDIRECT_URI = process.env.REACT_APP_TWITCH_REDIRECT_URI;

const getLoginUrl = (): string => {
  return encodeURI(
    `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}` +
      `&redirect_uri=${TWITCH_REDIRECT_URI}` +
      `&response_type=token id_token` +
      `&scope=openid chat:read` +
      `&claims={"id_token":{"preferred_username":null}}`
  );
};

const redirectToLogin = (): void => {
  window.location.assign(getLoginUrl());
};

const processAuth = (): void => {
  if (!window.location.hash) {
    return;
  }

  const authInfo = window.location.hash
    .substring(1)
    .split('&')
    .reduce((authInfo, s) => {
      const parts = s.split('=');
      authInfo[parts[0]] = decodeURIComponent(decodeURIComponent(parts[1]));
      return authInfo;
    }, {} as Record<string, any>) as AuthInfo;

  window.location.hash = '';

  if (authInfo.access_token && authInfo.id_token) {
    authInfo.decodedIdToken = parseJwt(authInfo.id_token) as IdToken;

    logIn(authInfo.access_token, authInfo.id_token, authInfo.decodedIdToken?.preferred_username ?? '');
  }
};

const revokeToken = async (token: string): Promise<void> => {
  await axios.post(`https://id.twitch.tv/oauth2/revoke?client_id=${TWITCH_CLIENT_ID}&token=${token}`);
};

function parseJwt(token: string) {
  if (!token) {
    return;
  }

  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const TwitchAuth = {
  getLoginUrl,
  redirectToLogin,
  processAuth,
  revokeToken,
};

export default TwitchAuth;
