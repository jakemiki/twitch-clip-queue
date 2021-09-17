import { createState } from "@hookstate/core";
import { trace } from "../common/analytics";
import TwitchAuth from "../services/TwitchAuth";
import TwitchChat from "../services/TwitchChat";
import { createPersistentState } from "./helpers";
import { currentClip } from "./queue";

export const isLoggedIn = createState<boolean>(false);

export const accessToken = createState<string | null>(null);
export const idToken = createState<string | null>(null);

export const userName = createState<string | null>(null);
export const userChannel = createPersistentState<string | null>('userChannel', null);

export const logIn = (auth: string, id: string, username: string): void => {
  accessToken.set(auth);
  idToken.set(id);
  userName.set(username);

  if (!userChannel.get()) {
    userChannel.set(username);
  }

  isLoggedIn.set(true);

  trace('user-logged-in');

  // temp easter egg
  if (username.toLowerCase() === 'wolfabelle' && (new Date()).getDay() === 5) {
    currentClip.set({
      title: 'ITS FRIDAY THEN, ITS SATURDAY, SUNDAY! GO MUFASA!',
      channel: 'MUFASA',
      id: '1TewCPi92ro',
      provider: 'youtube',
      thumbnailUrl: 'https://i.ytimg.com/vi/1TewCPi92ro/hqdefault.jpg',
      submitter: { displayName: 'Friday', userName: '' },
      submitters: new Array(69420),
      game: 'Friday',
    })
  }
  //
}

export const logOut = async (): Promise<void> => {
  const token = accessToken.get();
  accessToken.set(null);
  idToken.set(null);
  userName.set(null);
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
