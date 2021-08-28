import { entity } from "simpler-state";
import TwitchAuth from "../services/TwitchAuth";
import TwitchChat from "../services/TwitchChat";

export const isLoggedIn = entity<boolean>(false);

export const accessToken = entity<string | null>(null);
export const idToken = entity<string | null>(null);

export const userName = entity<string | null>(null);
export const userChannel = entity<string | null>(null);

export const logIn = (auth: string, id: string, username: string): void => {
  accessToken.set(auth);
  idToken.set(id);
  userName.set(username);
  userChannel.set(username);
  isLoggedIn.set(true);
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
}

export const changeChannel = (channel: string) => {
  TwitchChat.leaveChannel(userChannel.get() as string);
  userChannel.set(channel);
  TwitchChat.joinChannel(channel);
};
