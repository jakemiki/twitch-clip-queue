import { createAction } from '@reduxjs/toolkit';
import type { ChatPlatform } from './models';

export interface Userstate {
  username: string;
  login?: string;
  platform?: ChatPlatform;
  mod?: boolean;
  broadcaster?: boolean;
  subscriber?: boolean;
  vip?: boolean;
}

export const urlReceived = createAction<{ url: string; userstate: Userstate }>('chat/urlReceived');
export const urlDeleted = createAction<string>('chat/urlDeleted');
export const userTimedOut = createAction<{ username: string; platform: ChatPlatform }>('chat/userTimedOut');
