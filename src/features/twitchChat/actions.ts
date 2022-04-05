import { createAction } from '@reduxjs/toolkit';

export interface Userstate {
  username: string;
  mod?: boolean;
  broadcaster?: boolean;
  subscriber?: boolean;
  vip?: boolean;
}

export const urlReceived = createAction<{ url: string; userstate: Userstate }>('twitchChat/urlReceived');
export const urlDeleted = createAction<string>('twitchChat/urlDeleted');
export const userTimedOut = createAction<string>('twitchChat/userTimedOut');
