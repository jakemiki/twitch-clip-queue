import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface ChatConnection {
  state: 'connecting' | 'connected' | 'reconnecting' | 'error' | 'disconnected';
  error?: string;
}

export const reconnectChat = createAction<string>('chat/reconnect');

const chatSlice = createSlice({
  name: 'chat',
  initialState: {} as Record<string, ChatConnection>,
  reducers: {
    connectionChanged: (state, { payload }: PayloadAction<ChatConnection & { key: string }>) => {
      const { key, ...connection } = payload;
      state[key] = connection;
    },
    connectionRemoved: (state, { payload }: PayloadAction<string>) => {
      delete state[payload];
    },
  },
});

export const { connectionChanged, connectionRemoved } = chatSlice.actions;
export const selectChatConnections = (state: RootState) => state.chat;
export default chatSlice.reducer;
