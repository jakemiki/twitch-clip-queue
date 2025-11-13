import axios from 'axios';
import { KickClip } from '../models/kick';

export const getClip = async (id: string): Promise<KickClip | undefined> => {
  if (id.length <= 0) {
    return;
  }
  try {
    const response = await axios.get(`https://kick.com/api/v2/clips/${id}`);
    return response.data.clip;
  } catch (e) {
    console.error('Failed to Get Kick clip:', id, e);
    return;
  }
};

export const getDirectUrl = async (id: string): Promise<string | undefined> => {
  const clip = await getClip(id);
  if (!clip || !clip.video_url) {
    console.error('Invalid clip or missing playback URL');
    return;
  }
  return clip.video_url;
};

const kickApi = {
  getClip,
  getDirectUrl,
};

export default kickApi;
