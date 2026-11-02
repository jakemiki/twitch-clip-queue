import axios from 'axios';
import { KickClip, KickChatChannel } from '../models/kick';

export const getChannel = async (name: string, signal?: AbortSignal): Promise<KickChatChannel> => {
  const { data } = await axios.get<KickChatChannel>(`https://kick.com/api/v2/channels/${encodeURIComponent(name)}`, {
    signal,
    timeout: 15000,
  });

  if (!data.chatroom?.id || !data.user_id) throw new Error('Kick channel has no chatroom.');

  return data;
};

export const getChatUrl = async (channelId: number, signal?: AbortSignal): Promise<string> => {
  const { data } = await axios.post<{
    data: { mode: string; connections: { provider: string; credentials: { app_key?: string; cluster?: string } }[] };
  }>(
    `https://web.kick.com/api/v1/realtime/channels/${channelId}/chat/connection`,
    {
      client: { id: `clip-queue-${Math.random().toString(36).slice(2)}`, type: 'web' },
      capabilities: { accepted_providers: [{ provider: 'pusher' }] },
    },
    { signal, timeout: 15000 }
  );

  const connection = data.data?.connections?.find((c) => c.provider === 'pusher');
  if (data.data?.mode !== 'websocket' || !connection?.credentials.app_key || !connection.credentials.cluster) {
    throw new Error('Kick did not return a supported chat connection.');
  }

  const { app_key, cluster } = connection.credentials;

  return `wss://ws-${cluster}.pusher.com/app/${app_key}?protocol=7&client=js&version=1.0&flash=false`;
};

export const getClip = async (id: string): Promise<KickClip | undefined> => {
  if (id.length <= 0) {
    return;
  }

  try {
    const response = await axios.get(`https://kick.com/api/v2/clips/${encodeURIComponent(id)}`, { timeout: 15000 });
    return response.data.clip;
  } catch (e) {
    console.error('Failed to Get Kick clip:', id, e);
    return;
  }
};

export const getDirectUrl = async (id: string): Promise<string | undefined> => {
  const clip = await getClip(id);
  if (!clip || !(clip.video_url || clip.clip_url)) {
    console.error('Invalid clip or missing playback URL');
    return;
  }

  return clip.video_url || clip.clip_url;
};

const kickApi = {
  getChannel,
  getChatUrl,
  getClip,
  getDirectUrl,
};

export default kickApi;
