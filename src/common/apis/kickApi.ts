import axios from 'axios';
import { KickClip } from '../models/kick';

export async function getClip(id: string): Promise<KickClip | undefined> {
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
}

const kickApi = {
  getClip,
};

export default kickApi;
