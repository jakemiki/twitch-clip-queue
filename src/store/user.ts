import { trace } from "../common/analytics";
import TwitchAuth from "../services/TwitchAuth";
import TwitchChat from "../services/TwitchChat";
import { createPersistentState } from "./helpers";

export const isLoggedIn = createPersistentState<boolean>('isLoggedIn', false);

export const accessToken = createPersistentState<string | null>('accessToken', null);
export const idToken = createPersistentState<string | null>('idToken', null);

export const userName = createPersistentState<string | null>('userName', null);
export const userChannel = createPersistentState<string | null>('userChannel', null);

export const logIn = (auth: string, id: string, username: string): void => {
  accessToken.set(auth);
  idToken.set(id);
  userName.set(username);
  userChannel.set(username);
  isLoggedIn.set(true);

  trace('user-logged-in');
}

export const logOut = async (): Promise<void> => {
  const token = accessToken.get();
  accessToken.set(null);
  idToken.set(null);
  userName.set(null);
  userChannel.set(null);
  isLoggedIn.set(false);
  if (token) {
    await TwitchAuth.revokeToken(token);
  }

  trace('user-logged-out');
}

export const changeChannel = (channel: string) => {
  TwitchChat.leaveChannel(userChannel.get() as string);
  userChannel.set(channel);
  TwitchChat.joinChannel(channel);

  trace('channel-changed');
};
